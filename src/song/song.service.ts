import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserJwtPayload } from '@xbeat/server-toolkit';

import { SongType } from '../common/types/song.type';
import { Song } from '../entities/song.entity';
import { AlbumRepository } from '../repositories/album.repository';
import { SongRepository } from '../repositories/song.repository';
import { SongSearchInput } from './inputs/song-search.input';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(SongRepository) private readonly songRepository: SongRepository,
    @InjectRepository(AlbumRepository) private readonly albumRepository: AlbumRepository
  ) {}

  async findSongs({ name = '', url = '' }: SongSearchInput, { id: userId }: UserJwtPayload): Promise<SongType[]> {
    const queryOptions = {
      where: {}
    };

    if (name) {
      queryOptions.where = this.songRepository.buildWhereIlike('name', name);
    }

    if (url) {
      queryOptions.where = { ...queryOptions.where, ...this.songRepository.buildWhereIlike('url', url) };
    }

    const rawSongs = await this.songRepository.find(queryOptions);
    const filterNotArtistSongs = song =>
      song.album.artist.userId === userId ? true : song.album.released < new Date();

    const songs = rawSongs.filter(filterNotArtistSongs);

    return this.formatSongs(songs);
  }

  private formatSongs(songs: Song[]): SongType[] {
    return songs.map(({ id, name, file, albumId, url, album: { released, artistId } }) => ({
      id,
      name,
      file,
      url,
      albumId,
      artistId,
      released: released < new Date()
    }));
  }
}
