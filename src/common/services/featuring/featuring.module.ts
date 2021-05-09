import { ArtistRepository } from './../../../repositories/artist.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FeaturingRepository } from '../../../repositories/featuring.repository';
import { FeaturingService } from './featuring.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeaturingRepository, ArtistRepository])],
  providers: [FeaturingService],
  exports: [FeaturingService]
})
export class FeaturingModule {}
