import { UserRepository } from '../repositories/user.repository';
import { ArtistService } from '../artist/artist.service';
import { DateService } from '@xbeat/server-toolkit';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../common/common.module';
import { AlbumRepository } from '../repositories/album.repository';
import { FeaturingRepository } from '../repositories/featuring.repository';
import { SongRepository } from '../repositories/song.repository';
import { ScheduleProvider } from '../common/providers/schedule/schedule.provider';
import { ArtistRepository } from '../repositories/artist.repository';
import { AlbumResolver } from './album.resolver';
import { AlbumService } from './album.service';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([AlbumRepository, SongRepository, FeaturingRepository, ArtistRepository, UserRepository])
  ],
  providers: [AlbumService, ArtistService, AlbumResolver, ScheduleProvider, DateService]
})
export class AlbumModule {}
