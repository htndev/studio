import { ChangeReleaseDate } from './inputs/change-release-date.input';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentUser, GraphQLJwtGuard, StatusType, UserJwtPayload } from '@xbeat/server-toolkit';

import { ArtistService } from '../artist/artist.service';
import { ArtistType } from '../artist/types/artist.type';
import { AlbumType } from '../common/types/album.type';
import { Album } from '../entities/album.entity';
import { SongType } from './../common/types/song.type';
import { SongService } from './../song/song.service';
import { AlbumService } from './album.service';
import { AlbumsSearchInput } from './inputs/albums-search.input';
import { NewAlbumInput } from './inputs/new-album.input';

@UseGuards(GraphQLJwtGuard)
@Resolver(() => AlbumType)
export class AlbumResolver {
  constructor(
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
    private readonly songService: SongService
  ) {}

  @Mutation(() => StatusType)
  async createAlbum(
    @Args('newAlbumInput') newAlbum: NewAlbumInput,
    @CurrentUser('graphql') user: UserJwtPayload
  ): Promise<StatusType> {
    return this.albumService.createAlbum(newAlbum, user);
  }

  @Mutation(() => StatusType)
  async releaseAlbumNow(
    @Args('albumUrl') albumUrl: string,
    @CurrentUser('graphql') user: UserJwtPayload
  ): Promise<StatusType> {
    return this.albumService.releaseAlbumNow(albumUrl, user.id);
  }

  @Mutation(() => StatusType)
  async changeReleaseDate(
    @Args('changeReleaseDateInput') changeReleaseDateInput: ChangeReleaseDate
  ): Promise<StatusType> {
    return this.albumService.changeReleaseDate(changeReleaseDateInput);
  }

  @Query(() => [AlbumType])
  async findAlbums(
    @Args('search', { nullable: true }) newAlbumSearchInput: AlbumsSearchInput = {},
    @CurrentUser('graphql') user: UserJwtPayload
  ): Promise<AlbumType[]> {
    return this.albumService.findAlbums(newAlbumSearchInput, user);
  }

  @ResolveField(() => ArtistType)
  async artist(@Parent() album: Album): Promise<ArtistType> {
    return this.artistService.findArtistById(album.artistId);
  }

  @ResolveField(() => [SongType])
  async songs(@Parent() album: Album): Promise<SongType[]> {
    return this.songService.findSongByAlbumId(album.id);
  }
}
