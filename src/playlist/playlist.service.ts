import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusType, UserJwtPayload } from '@xbeat/server-toolkit';
import { PlaylistAvailability } from '@xbeat/toolkit';

import { SongType } from '../common/types/song.type';
import { PlaylistSong } from '../entities/playlist-song.entity';
import { Playlist } from '../entities/playlist.entity';
import { PlaylistSongRepository } from '../repositories/playlist-song.repository';
import { PlaylistRepository } from '../repositories/playlist.repository';
import { SongRepository } from '../repositories/song.repository';
import { UserRepository } from '../repositories/user.repository';
import { NewPlaylistInput } from './inputs/new-playlist.input';
import { NewSongPlaylistInput } from './inputs/new-song-playlist.input';
import { PlaylistSearch } from './inputs/playlist-search.input';
import { PlaylistType } from './types/playlist.type';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(PlaylistRepository) private readonly playlistRepository: PlaylistRepository,
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
    @InjectRepository(PlaylistSongRepository) private readonly playlistSongRepository: PlaylistSongRepository,
    @InjectRepository(SongRepository) private readonly songRepository: SongRepository
  ) {}

  async createPlaylist(newPlaylistInput: NewPlaylistInput & { userId: number }): Promise<StatusType> {
    const user = await this.userRepository.findOne({ id: newPlaylistInput.userId });
    await this.playlistRepository.createPlaylist({ ...newPlaylistInput, user });

    return {
      status: HttpStatus.CREATED
    };
  }

  async addSongToPlaylist(
    { song: songUrl, playlist: playlistUrl }: NewSongPlaylistInput,
    { id }: UserJwtPayload
  ): Promise<StatusType> {
    const playlist = await this.playlistRepository.findOne({ url: playlistUrl, ownerId: id });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    const song = await this.songRepository.findOne({ url: songUrl });

    if (!song) {
      throw new NotFoundException('Song not found');
    }

    const isPairExist = await this.playlistSongRepository.isPairExist({ songId: song.id, playlistId: playlist.id });

    if (isPairExist) {
      return {
        status: HttpStatus.ACCEPTED,
        message: 'Song is already in playlist'
      };
    }

    const newPlaylistSong = new PlaylistSong();

    newPlaylistSong.song = song;
    newPlaylistSong.playlist = playlist;

    await newPlaylistSong.save();

    return {
      status: HttpStatus.CREATED,
      message: 'Song added to playlist'
    };
  }

  async findPlaylists(
    { username, title, url }: PlaylistSearch,
    { id: currentUserId }: UserJwtPayload
  ): Promise<PlaylistType[]> {
    const options: { where: { title?: string; url?: string; ownerId?: number } } = {
      where: {}
    };

    if (title) {
      options.where.title = title;
    }

    if (url) {
      options.where.url = url;
    }

    if (username) {
      const { id: ownerId } = (await this.userRepository.findOne({ where: { username }, select: ['id'] })) || {};

      if (ownerId) {
        options.where.ownerId = ownerId;
      }
    }

    const playlists = await this.playlistRepository.find(options);
    const excludeOtherPrivatePlaylists = (playlist: Playlist) =>
      playlist.availability === PlaylistAvailability.Public || playlist.ownerId === currentUserId;
    const filteredPlaylist = playlists.filter(excludeOtherPrivatePlaylists);

    return filteredPlaylist;
  }

  async findSongs(playlist: Playlist): Promise<SongType[]> {
    const songs = await this.playlistSongRepository.find({ playlistId: playlist.id });

    return songs.map(({ song }) => ({
      ...song,
      released: song.album.released < new Date(),
      artistId: song.album.artistId,
      songId: song.id
    }));
  }
}
