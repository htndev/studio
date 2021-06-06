import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLJwtGuard } from '@xbeat/server-toolkit';

import { SearchService } from './search.service';
import { SearchType } from './types/search.type';

@UseGuards(GraphQLJwtGuard)
@Resolver(() => SearchType)
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Mutation(() => SearchType)
  async search(@Args('query') title: string): Promise<SearchType> {
    return this.searchService.search(title);
  }
}
