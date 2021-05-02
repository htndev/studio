import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentUser, GraphQLJwtGuard, StatusType, UserJwtPayload } from '@xbeat/server-toolkit';

import { AlbumType } from '../common/types/album.type';
import { ArtistService } from '../artist/artist.service';
import { ArtistType } from './../artist/types/artist.type';
import { Album } from '../entities/album.entity';
import { AlbumService } from './album.service';
import { AlbumsSearchInput } from './inputs/albums-search.input';
import { NewAlbumInput } from './inputs/new-album.input';

@UseGuards(GraphQLJwtGuard)
@Resolver(() => AlbumType)
export class AlbumResolver {
  constructor(private readonly albumService: AlbumService, private readonly artistService: ArtistService) {}

  @Mutation(() => StatusType)
  async createAlbum(
    @Args('newAlbumInput') newAlbum: NewAlbumInput,
    @CurrentUser('graphql') user: UserJwtPayload
  ): Promise<StatusType> {
    return this.albumService.createAlbum(newAlbum, user);
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

  // async featuring(@Parent() album: Album): Promise<Featuring>
}
