import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FeaturingRepository } from '../../../repositories/featuring.repository';
import { FeaturingService } from './featuring.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeaturingRepository])],
  providers: [FeaturingService],
  exports: [FeaturingService]
})
export class FeaturingModule {}
