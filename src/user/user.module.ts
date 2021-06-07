import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArtistService } from '../artist/artist.service';
import { CommonModule } from '../common/common.module';
import { ArtistRepository } from '../repositories/artist.repository';
import { UserRepository } from '../repositories/user.repository';
import { AlbumRepository } from '../repositories/album.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([UserRepository, ArtistRepository, AlbumRepository])],
  providers: [UserResolver, UserService, ArtistService]
})
export class UserModule {}
