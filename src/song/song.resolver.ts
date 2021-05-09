import { UseGuards } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentUser, GraphQLJwtGuard, UserJwtPayload } from '@xbeat/server-toolkit';

import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { ArtistType } from '../artist/types/artist.type';
import { FeaturingService } from '../common/services/featuring/featuring.service';
import { AlbumType } from '../common/types/album.type';
import { SongType } from '../common/types/song.type';
import { Album } from '../entities/album.entity';
import { Song } from '../entities/song.entity';
import { SongSearchInput } from './inputs/song-search.input';
import { SongService } from './song.service';

@UseGuards(GraphQLJwtGuard)
@Resolver(() => SongType)
export class SongResolver {
  constructor(
    private readonly songService: SongService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
    private readonly featuringService: FeaturingService
  ) {}

  @Query(() => [SongType])
  async findSongs(
    @Args('search', { nullable: true }) songSearchInput: SongSearchInput = {},
    @CurrentUser('graphql') user: UserJwtPayload
  ): Promise<SongType[]> {
    return this.songService.findSongs(songSearchInput, user);
  }

  @ResolveField(() => AlbumType)
  async album(@Parent() song: Song): Promise<Album> {
    return this.albumService.findAlbumById(song.albumId);
  }

  @ResolveField(() => ArtistType)
  async artist(@Parent() song: Song & { artistId: number }): Promise<ArtistType> {
    return this.artistService.findArtistById(song.artistId);
  }

  @ResolveField(() => [ArtistType])
  async feat(@Parent() { songId }: Song & { songId: number }): Promise<ArtistType[]> {
    return this.featuringService.findFeat({ songId });
  }
}
