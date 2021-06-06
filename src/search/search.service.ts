import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserJwtPayload } from '@xbeat/server-toolkit';
import { PlaylistAvailability } from '@xbeat/toolkit';
import { LessThan, LessThanOrEqual, ILike } from 'typeorm';

import { PlaylistRepository } from '../repositories/playlist.repository';
import { SongRepository } from '../repositories/song.repository';
import { UserRepository } from '../repositories/user.repository';
import { AlbumRepository } from './../repositories/album.repository';
import { ArtistRepository } from './../repositories/artist.repository';
import { SearchType } from './types/search.type';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(PlaylistRepository) private readonly playlistRepository: PlaylistRepository,
    @InjectRepository(ArtistRepository) private readonly artistRepository: ArtistRepository,
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
    @InjectRepository(SongRepository) private readonly songRepository: SongRepository,
    @InjectRepository(AlbumRepository) private readonly albumRepository: AlbumRepository
  ) {}

  async search(query: string): Promise<SearchType> {
    if (!query) {
      throw new BadRequestException('Query should be provided');
    }

    const QUERY = { where: { name: ILike(`%${query}%`) } };

    const artists = await this.artistRepository.find(QUERY);
    const songs = await this.songRepository.find(QUERY);
    const albums = await this.albumRepository.find({
      where: { name: ILike(`%${query}%`), released: LessThanOrEqual(new Date()) }
    });
    const playlists = await this.playlistRepository.find({
      where: { title: ILike(`%${query}%`), availability: PlaylistAvailability.Public }
    });

    return {
      artists,
      albums: albums.map(album => ({
        id: album.id,
        name: album.name,
        cover: album.cover,
        released: album.released.toISOString(),
        url: album.url,
        artistId: album.artistId
      })),
      songs: songs.map(song => ({
        name: song.name,
        url: song.url,
        released: song.album.released < new Date(),
        file: song.file,
        albumId: song.albumId,
        artistId: song.album.artistId,
        songId: song.id
      })),
      playlists
    };
  }
}
