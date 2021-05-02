import { buildFieldLabels } from '@xbeat/server-toolkit';
import { Featuring } from '../../../entities/featuring.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FeaturingRepository } from '../../../repositories/featuring.repository';

@Injectable()
export class FeaturingService {
  constructor(@InjectRepository(FeaturingRepository) private readonly featuringRepository: FeaturingRepository) {}

  async findFeat({ songId, artistId }: { songId: number; artistId: number }): Promise<Featuring> {
    const label = 'feat';
    return this.featuringRepository
      .createQueryBuilder(label)
      .select(buildFieldLabels(label, ['id', 'songId', 'artistId']))
      .where(`${label}.artistId = :artistId`, { artistId })
      .andWhere(`${label}.songId = :songId`, { songId })
      .getOne();
    // return this.featuringRepository.findOne({ artistId, songId });
  }
}
