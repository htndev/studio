import { SongSearchInput } from './inputs/song-search.input';
import { SongService } from './song.service';
import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, GraphQLJwtGuard, UserJwtPayload } from '@xbeat/server-toolkit';

import { SongType } from '../common/types/song.type';

@UseGuards(GraphQLJwtGuard)
@Resolver(() => SongType)
export class SongResolver {
  constructor(private readonly songService: SongService) {}

  @Query(() => [SongType])
  async findSongs(
    @Args('search', { nullable: true }) songSearchInput: SongSearchInput = {},
    @CurrentUser('graphql') user: UserJwtPayload
  ): Promise<SongType[]> {
    return this.songService.findSongs(songSearchInput, user);
  }
}
