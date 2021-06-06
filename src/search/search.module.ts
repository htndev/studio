import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../common/common.module';
import { PlaylistRepository } from '../repositories/playlist.repository';
import { SongRepository } from '../repositories/song.repository';
import { UserRepository } from '../repositories/user.repository';
import { AlbumRepository } from './../repositories/album.repository';
import { ArtistRepository } from './../repositories/artist.repository';
import { SearchResolver } from './search.resolver';
import { SearchService } from './search.service';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([
      ArtistRepository,
      UserRepository,
      PlaylistRepository,
      AlbumRepository,
      SongRepository
    ])
  ],
  providers: [SearchService, SearchResolver]
})
export class SearchModule {}
