import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@xbeat/server-toolkit';
import { EntityRepository } from 'typeorm';

import { MAX_ALBUM_URL_LENGTH } from '../common/constants/common.constant';
import RandomProvider from '../common/providers/random/random.provider';
import { Album } from '../entities/album.entity';

@Injectable()
@EntityRepository(Album)
export class AlbumRepository extends BaseRepository<Album> {
  private readonly label = 'album';

  async generateUrl(): Promise<string> {
    const url = RandomProvider.getRandomString(MAX_ALBUM_URL_LENGTH);

    return (await this.isExists({ url })) ? this.generateUrl() : url;
  }

  async findAlbumById(id: number): Promise<Album> {
    return this.findOne({
      select: ['id', 'name', 'released', 'cover', 'url', 'artistId'],
      where: {
        id
      }
    });
  }
}
