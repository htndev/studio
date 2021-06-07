import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExistsType, StatusType, UserJwtPayload } from '@xbeat/server-toolkit';

import { AlbumType } from '../common/types/album.type';
import { Artist } from '../entities/artist.entity';
import { AlbumRepository } from '../repositories/album.repository';
import { ArtistRepository } from '../repositories/artist.repository';
import { UserRepository } from '../repositories/user.repository';
import { ArtistExistsInput } from './inputs/artist-exists.input';
import { ArtistSearchInput } from './inputs/artist-search.input';
import { NewArtistInput } from './inputs/new-artist.input';
import { UpdateArtistAvatarInput } from './inputs/update-artist-avatar.input';
import { UpdateArtistHeaderInput } from './inputs/update-artist-header.input';
import { ArtistType } from './types/artist.type';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
    @InjectRepository(ArtistRepository) private readonly artistRepository: ArtistRepository,
    @InjectRepository(AlbumRepository) private readonly albumRepository: AlbumRepository
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

  async findArtistById(id: number): Promise<ArtistType> {
    return this.artistRepository.findById(id);
  }

  async updateArtistAvatar({ url, avatar }: UpdateArtistAvatarInput, { id }: UserJwtPayload): Promise<StatusType> {
    const artist = await this.artistRepository.findOne({ url });

    if (!artist) {
      throw new NotFoundException('Artist does not exist');
    }

    if (artist.userId !== id) {
      throw new ConflictException('You cannot modify not your own artist');
    }

    artist.avatar = avatar;

    await artist.save();

    return {
      status: HttpStatus.ACCEPTED,
      message: 'Avatar updated successfully'
    };
  }

  async updateArtistHeader({ url, header }: UpdateArtistHeaderInput, { id }: UserJwtPayload): Promise<StatusType> {
    const artist = await this.artistRepository.findOne({ url });

    if (!artist) {
      throw new NotFoundException('Artist does not exist');
    }

    if (artist.userId !== id) {
      throw new ConflictException('You cannot modify not your own artist');
    }

    artist.header = header;

    await artist.save();

    return {
      status: HttpStatus.ACCEPTED,
      message: 'Header updated successfully'
    };
  }

  async findAlbums(artist: Artist): Promise<AlbumType[]> {
    const albums = await this.albumRepository.find({ artistId: artist.id });

    return albums
      .filter(album => album.released < new Date())
      .map(({ id, name, url, cover, released, artistId }) => ({
        id,
        name,
        url,
        cover,
        released: released.toISOString(),
        artistId
      }));
  }
}
