import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../common/common.module';
import { ArtistRepository } from '../repositories/artist.repository';
import { UserRepository } from '../repositories/user.repository';
import { ArtistService } from '../artist/artist.service';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([UserRepository, ArtistRepository])],
  providers: [UserResolver, UserService, ArtistService]
})
export class UserModule {}
