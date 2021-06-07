import { UpdatePlaylistAvailabilityInput } from './inputs/update-playlist-availability.input';
import { PlaylistCoverUpload } from './inputs/playlist-cover-upload.input';
import { HttpStatus, Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
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
import { PlaylistSongInput } from './inputs/playlist-song.input';
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
    { song: songUrl, playlist: playlistUrl }: PlaylistSongInput,
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

  async removeSongFromPlaylist(
    { song: songUrl, playlist: playlistUrl }: PlaylistSongInput,
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

    if (!isPairExist) {
      throw new ConflictException('Pair do not exist');
    }

    await this.playlistSongRepository.delete({ songId: song.id, playlistId: playlist.id });

    return {
      status: HttpStatus.OK
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

  async updatePlaylistCover(
    { cover, playlist: url }: PlaylistCoverUpload,
    { username }: UserJwtPayload
  ): Promise<StatusType> {
    const playlist = await this.playlistRepository.findOne({ url });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    if (playlist.owner.username !== username) {
      throw new ConflictException('You can not edit not your own playlist');
    }

    if (playlist.cover === cover) {
      return {
        status: HttpStatus.ACCEPTED
      };
    }

    playlist.cover = cover;

    await playlist.save();

    return {
      status: HttpStatus.ACCEPTED
    };
  }

  async updatePlaylistAvailability(
    { availability, playlist: url }: UpdatePlaylistAvailabilityInput,
    { id }: UserJwtPayload
  ): Promise<StatusType> {
    const playlist = await this.playlistRepository.findOne({ url });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    if (playlist.owner.id !== id) {
      throw new NotFoundException('Playlist not found');
    }

    const isValidAvailability = [PlaylistAvailability.Private, PlaylistAvailability.Public].includes(availability);

    if (!isValidAvailability) {
      throw new BadRequestException('Wrong availability status type');
    }

    if (playlist.availability === availability) {
      return {
        status: HttpStatus.ACCEPTED
      };
    }

    playlist.availability = availability;

    await playlist.save();

    return {
      status: HttpStatus.OK
    };
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
