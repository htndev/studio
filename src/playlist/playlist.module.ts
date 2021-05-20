import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../common/common.module';
import { PlaylistRepository } from '../repositories/playlist.repository';
import { UserRepository } from '../repositories/user.repository';
import { PlaylistSongRepository } from '../repositories/playlist-song.repository';
import { SongRepository } from '../repositories/song.repository';
import { PlaylistResolver } from './playlist.resolver';
import { PlaylistService } from './playlist.service';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([UserRepository, PlaylistRepository, PlaylistSongRepository, SongRepository])
  ],
  providers: [PlaylistResolver, PlaylistService]
})
export class PlaylistModule {}
