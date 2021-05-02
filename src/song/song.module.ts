import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../common/common.module';
import { AlbumRepository } from '../repositories/album.repository';
import { SongRepository } from '../repositories/song.repository';
import { SongResolver } from './song.resolver';
import { SongService } from './song.service';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([SongRepository, AlbumRepository])],
  providers: [SongService, SongResolver]
})
export class SongModule {}
