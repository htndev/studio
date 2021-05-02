import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@xbeat/server-toolkit';
import { EntityRepository, Raw } from 'typeorm';

import RandomProvider from '../common/providers/random/random.provider';
import { Album } from '../entities/album.entity';
import { MAX_ALBUM_URL_LENGTH } from '../common/constants/common.constant';

@Injectable()
@EntityRepository(Album)
export class AlbumRepository extends BaseRepository<Album> {
  async generateUrl(): Promise<string> {
    const url = RandomProvider.getRandomString(MAX_ALBUM_URL_LENGTH);

    return (await this.isExists({ url })) ? this.generateUrl() : url;
  }
}
