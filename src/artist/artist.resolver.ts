import { AlbumType } from './../common/types/album.type';
import { UpdateArtistHeaderInput } from './inputs/update-artist-header.input';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentUser, ExistsType, GraphQLJwtGuard, StatusType, UserJwtPayload } from '@xbeat/server-toolkit';
import { Maybe } from '@xbeat/toolkit';

import { Artist } from '../entities/artist.entity';
import { User } from '../entities/user.entity';
import { UserType } from '../user/types/user.type';
import { UserService } from '../user/user.service';
import { ArtistService } from './artist.service';
import { ArtistExistsInput } from './inputs/artist-exists.input';
import { ArtistSearchInput } from './inputs/artist-search.input';
import { NewArtistInput } from './inputs/new-artist.input';
import { UpdateArtistAvatarInput } from './inputs/update-artist-avatar.input';
import { ArtistType } from './types/artist.type';

@UseGuards(GraphQLJwtGuard)
@Resolver(ArtistType)
export class ArtistResolver {
  constructor(private readonly artistService: ArtistService, private readonly userService: UserService) {}

  @Mutation(() => StatusType)
  async createArtist(
    @Args('newArtistInput') newArtistInput: NewArtistInput,
    @CurrentUser('graphql') user: UserJwtPayload
  ): Promise<StatusType> {
    return this.artistService.createArtists(newArtistInput, user);
  }

  @Mutation(() => StatusType)
  async updateArtistAvatar(
    @Args('updateArtistAvatarInput') updateArtistAvatarInput: UpdateArtistAvatarInput,
    @CurrentUser('graphql') user: UserJwtPayload
  ): Promise<StatusType> {
    return this.artistService.updateArtistAvatar(updateArtistAvatarInput, user);
  }

  @Mutation(() => StatusType)
  async updateArtistHeader(
    @Args('updateArtistHeaderInput') updateArtistHeaderInput: UpdateArtistHeaderInput,
    @CurrentUser('graphql') user: UserJwtPayload
  ): Promise<StatusType> {
    return this.artistService.updateArtistHeader(updateArtistHeaderInput, user);
  }

  @Query(() => ExistsType)
  async isArtistExists(@Args('isArtistExistsInput') isArtistExistsInput: ArtistExistsInput) {
    return this.artistService.isArtistExists(isArtistExistsInput);
  }

  @Query(() => [ArtistType])
  async getArtists(@Args('artistSearchInput') artistSearchInput: ArtistSearchInput): Promise<Artist[]> {
    return this.artistService.findArtistsLike(artistSearchInput);
  }

  @Query(() => [ArtistType])
  async myArtists(@CurrentUser('graphql') { id }: UserJwtPayload): Promise<Artist[]> {
    return this.artistService.findUserArtists(id);
  }

  @ResolveField(() => UserType)
  async user(@Parent() artist: Artist): Promise<Maybe<Pick<User, 'id' | 'username' | 'email'>>> {
    return this.userService.findUserById(artist.userId);
  }

  @ResolveField(() => [AlbumType])
  async albums(@Parent() artist: Artist): Promise<AlbumType[]> {
    return this.artistService.findAlbums(artist);
  }
}
