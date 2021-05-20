import { Field, ObjectType } from '@nestjs/graphql';
import { PlaylistAvailability } from '@xbeat/toolkit';

@ObjectType()
export class PlaylistType {
  @Field()
  title: string;

  @Field(() => Number)
  availability: PlaylistAvailability;

  @Field()
  url: string;
}
