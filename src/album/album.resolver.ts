import { StatusType } from '@xbeat/server-toolkit';
import { Mutation, Resolver } from '@nestjs/graphql';

@Resolver(() => StatusType)
export class AlbumResolver {
  @Mutation(() => StatusType)
  async createAlbum(): Promise<StatusType> {
    return {
      status: 1
    };
  }
}
