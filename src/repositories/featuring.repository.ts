import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@xbeat/server-toolkit';
import { EntityRepository } from 'typeorm';

import { Featuring } from '../entities/featuring.entity';

@Injectable()
@EntityRepository(Featuring)
export class FeaturingRepository extends BaseRepository<Featuring> {
  async createFeaturing({ artist, song }: Pick<Featuring, 'artist' | 'song'>): Promise<Featuring> {
    const feat = new Featuring();

    feat.artist = artist;
    feat.song = song;

    return feat.save();
  }
}
