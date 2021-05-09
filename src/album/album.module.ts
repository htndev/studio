import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateService } from '@xbeat/server-toolkit';

import { ArtistService } from '../artist/artist.service';
import { CommonModule } from '../common/common.module';
import { ScheduleProvider } from '../common/providers/schedule/schedule.provider';
import { AlbumRepository } from '../repositories/album.repository';
import { ArtistRepository } from '../repositories/artist.repository';
import { FeaturingRepository } from '../repositories/featuring.repository';
import { SongRepository } from '../repositories/song.repository';
import { UserRepository } from '../repositories/user.repository';
import { SongService } from '../song/song.service';
import { AlbumResolver } from './album.resolver';
import { AlbumService } from './album.service';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([AlbumRepository, SongRepository, FeaturingRepository, ArtistRepository, UserRepository])
  ],
  providers: [AlbumService, ArtistService, AlbumResolver, ScheduleProvider, DateService, SongService]
})
export class AlbumModule {}
