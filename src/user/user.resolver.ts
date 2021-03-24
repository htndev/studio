import { UseGuards } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentUser, GraphQLJwtGuard, UserJwtPayload } from '@xbeat/server-toolkit';

import { ArtistService } from '../artist/artist.service';
import { ArtistType } from '../artist/types/artist.type';
import { Artist } from '../entities/artist.entity';
import { User } from '../entities/user.entity';
import { UserSearchInput } from './types/user-search.input';
import { UserType } from './types/user.type';
import { UserService } from './user.service';

@UseGuards(GraphQLJwtGuard)
@Resolver(UserType)
export class UserResolver {
  constructor(private readonly userService: UserService, private readonly artistService: ArtistService) {}

  @Query(() => UserType)
  async getUsers(@Args('userSearchInput') userSearchInput: UserSearchInput) {
    return this.userService.findUsersLike(userSearchInput);
  }

  @Query(() => Boolean)
  async hasUserArtists(@CurrentUser('graphql') { id }: UserJwtPayload) {
    return this.userService.hasUserArtist(id);
  }

  @ResolveField(() => [ArtistType])
  async artists(@Parent() { id }: User): Promise<Artist[]> {
    return this.artistService.findUserArtists(id);
  }
}
