import { UserSearchInput } from './types/user-search.input';
import { Parent, ResolveField, Resolver, Query, Args } from '@nestjs/graphql';

import { ArtistService } from '../artist/artist.service';
import { ArtistType } from '../artist/types/artist.type';
import { Artist } from '../entities/artist.entity';
import { User } from './../entities/user.entity';
import { UserType } from './types/user.type';
import { UserService } from './user.service';

@Resolver(UserType)
export class UserResolver {
  constructor(private readonly userService: UserService, private readonly artistService: ArtistService) {}

  @Query(() => UserType)
  async getUsers(@Args('userSearchInput') userSearchInput: UserSearchInput) {
    return this.userService.findUsersLike(userSearchInput);
  }

  @ResolveField(() => [ArtistType])
  async artists(@Parent() user: User): Promise<Artist[]> {
    return this.artistService.findUserArtists(user.id);
  }
}
