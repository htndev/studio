import { ConflictException, Injectable } from '@nestjs/common';
import { buildFieldLabels } from '@xbeat/server-toolkit';
import { EntityRepository, Repository } from 'typeorm';

import { MAX_ARTIST_URL_LENGTH } from '../common/constants/common.constant';
import RandomProvider from '../common/providers/random/random.provider';
import { Artist } from '../entities/artist.entity';
import { AllowedArtistFields, QueryResult } from './../common/constants/type.constant';

@Injectable()
@EntityRepository(Artist)
export class ArtistRepository extends Repository<Artist> {
  private readonly label = 'artist';
  private readonly defaultFields = ['id', 'name', 'url', 'header', 'avatar'];

  async createArtist({ name, user }: Pick<Artist, 'name' | 'user'>): Promise<Artist> {
    if (await this.isExists({ name })) {
      throw new ConflictException(`Artist with name '${name}' already exists`);
    }

    const artist = new Artist();

    artist.name = name;
    artist.url = await this.generateRandomArtistUrl();
    artist.user = user;

    return artist.save();
  }

  async isExists(query: Partial<Artist>): Promise<boolean> {
    try {
      await this.findOneOrFail(query);

      return true;
    } catch (e) {
      return false;
    }
  }

  async findById<F extends AllowedArtistFields>(id: number, fields?: F[]): Promise<QueryResult<Artist, F>> {
    return this.createQueryBuilder(this.label)
      .select(buildFieldLabels(this.label, fields ?? this.defaultFields))
      .where('id = :id', { id })
      .getOne();
  }

  async findLikeArtist({ name, url }: { name?: string; url?: string }): Promise<Artist[]> {
    const searchCriteria = name ? 'name' : 'url';
    const searchValue = name ? name : url;

    return this.createQueryBuilder(this.label)
      .select(buildFieldLabels(this.label, [...this.defaultFields, 'userId']))
      .where(`${searchCriteria} ILIKE :${searchCriteria}`, { [searchCriteria]: `%${searchValue}%` })
      .getMany();
  }

  private async generateRandomArtistUrl(): Promise<string> {
    const url = RandomProvider.getRandomString(MAX_ARTIST_URL_LENGTH);

    return (await this.isExists({ url })) ? this.generateRandomArtistUrl() : url;
  }
}
