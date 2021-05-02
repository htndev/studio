import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlbumService } from '../album/album.service';
import { CommonModule } from '../common/common.module';
import { FeaturingModule } from '../common/services/featuring/featuring.module';
import { AlbumRepository } from '../repositories/album.repository';
import { ArtistRepository } from '../repositories/artist.repository';
import { FeaturingRepository } from '../repositories/featuring.repository';
import { SongRepository } from '../repositories/song.repository';
import { ArtistService } from '../artist/artist.service';
import { UserRepository } from '../repositories/user.repository';
import { SongResolver } from './song.resolver';
import { SongService } from './song.service';

@Module({
  imports: [
    CommonModule,
    FeaturingModule,
    TypeOrmModule.forFeature([SongRepository, AlbumRepository, FeaturingRepository, ArtistRepository, UserRepository])
  ],
  providers: [SongService, AlbumService, ArtistService, SongResolver]
})
export class SongModule {}
