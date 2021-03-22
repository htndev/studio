import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExistsType, StatusType, UserJwtPayload } from '@xbeat/server-toolkit';

import { Artist } from '../entities/artist.entity';
import { ArtistRepository } from '../repositories/artist.repository';
import { UserRepository } from '../repositories/user.repository';
import { ArtistExistsInput } from './inputs/artist-exists.input';
import { ArtistSearchInput } from './inputs/artist-search.input';
import { NewArtistInput } from './inputs/new-artist.input';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
    @InjectRepository(Artist) private readonly artistRepository: ArtistRepository
  ) {}

  async createArtists({ name }: NewArtistInput, { id }: UserJwtPayload): Promise<StatusType> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException('Current user not found');
    }

    await this.artistRepository.createArtist({ name, user });

    return {
      status: HttpStatus.CREATED,
      message: 'Artist successfully created'
    };
  }

  async isArtistExists({ name }: ArtistExistsInput): Promise<ExistsType> {
    return {
      exists: await this.artistRepository.isExists({ name })
    };
  }

  async findArtistsLike(searchCriteria: ArtistSearchInput): Promise<Artist[]> {
    return this.artistRepository.findLikeArtist(searchCriteria);
  }

  async findUserArtists(id: number): Promise<Artist[]> {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.artists;
  }

  async findArtistById(id: number) {
    return this.artistRepository.findById(id);
  }
}
