import { ArtistType } from '..//../../artist/types/artist.type';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FeaturingRepository } from '../../../repositories/featuring.repository';
import { ArtistRepository } from '../../../repositories/artist.repository';

@Injectable()
export class FeaturingService {
  constructor(
    @InjectRepository(FeaturingRepository) private readonly featuringRepository: FeaturingRepository,
    @InjectRepository(ArtistRepository) artistRepository: ArtistRepository
  ) {}

  async findFeat({ songId }: { songId: number }): Promise<ArtistType[]> {
    const feats = await this.featuringRepository.find({ songId });
    return feats.map(feat => feat.artist);
  }
}
