import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../common/common.module';
import { ArtistRepository } from '../repositories/artist.repository';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../user/user.service';
import { ArtistResolver } from './artist.resolver';
import { ArtistService } from './artist.service';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([UserRepository, ArtistRepository])],
  providers: [ArtistService, UserService, ArtistResolver]
})
export class ArtistModule {}
