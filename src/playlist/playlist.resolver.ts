import { UpdatePlaylistAvailabilityInput } from './inputs/update-playlist-availability.input';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentUser, GraphQLJwtGuard, StatusType, UserJwtPayload } from '@xbeat/server-toolkit';

import { SongType } from '../common/types/song.type';
import { Playlist } from '../entities/playlist.entity';
import { UserType } from '../user/types/user.type';
import { NewPlaylistInput } from './inputs/new-playlist.input';
import { PlaylistCoverUpload } from './inputs/playlist-cover-upload.input';
import { PlaylistSearch } from './inputs/playlist-search.input';
import { PlaylistSongInput } from './inputs/playlist-song.input';
import { PlaylistService } from './playlist.service';
import { PlaylistType } from './types/playlist.type';

@UseGuards(GraphQLJwtGuard)
@Resolver(() => PlaylistType)
export class PlaylistResolver {
  constructor(private readonly playlistService: PlaylistService) {}

  @Mutation(() => StatusType)
  async createPlaylist(
    @Args('newPlaylistInput') newPlaylistInput: NewPlaylistInput,
    @CurrentUser('graphql') { id }: UserJwtPayload
  ): Promise<StatusType> {
    return this.playlistService.createPlaylist({ ...newPlaylistInput, userId: id });
  }

  @Mutation(() => StatusType)
  async addSongToPlaylist(
    @Args('newSongPlaylistInput') playlistSongInput: PlaylistSongInput,
    @CurrentUser('graphql') user: UserJwtPayload
  ): Promise<StatusType> {
    return this.playlistService.addSongToPlaylist(playlistSongInput, user);
  }

  @Mutation(() => StatusType)
  async removeSongFromPlaylist(
    @Args('playlistSongInput') playlistSongInput: PlaylistSongInput,
    @CurrentUser('graphql') user: UserJwtPayload
  ): Promise<StatusType> {
    return this.playlistService.removeSongFromPlaylist(playlistSongInput, user);
  }

  @Mutation(() => StatusType)
  async updatePlaylistCover(
    @Args('input') playlistCoverUploadInput: PlaylistCoverUpload,
    @CurrentUser('graphql') user: UserJwtPayload
  ): Promise<StatusType> {
    return this.playlistService.updatePlaylistCover(playlistCoverUploadInput, user);
  }

  @Mutation(() => StatusType)
  async updatePlaylistAvailability(
    @Args('input') updatePlaylistAvailabilityInput: UpdatePlaylistAvailabilityInput,
    @CurrentUser('graphql') user: UserJwtPayload
  ): Promise<StatusType> {
    return this.playlistService.updatePlaylistAvailability(updatePlaylistAvailabilityInput, user);
  }

  @Query(() => [PlaylistType])
  async findPlaylists(
    @Args('search', { nullable: true }) search: PlaylistSearch = {},
    @CurrentUser('graphql') user: UserJwtPayload
  ): Promise<PlaylistType[]> {
    return this.playlistService.findPlaylists(search, user);
  }

  @ResolveField(() => [SongType])
  async songs(@Parent() playlist: Playlist): Promise<SongType[]> {
    return this.playlistService.findSongs(playlist);
  }

  @ResolveField(() => UserType)
  async owner(@Parent() playlist: Playlist): Promise<UserType> {
    return playlist.owner;
  }
}
