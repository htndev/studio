import { Field, ObjectType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';
import { PlaylistAvailability, Nullable } from '@xbeat/toolkit';

@ObjectType()
export class PlaylistType {
  @Field()
  title: string;

  @Field(() => Number)
  availability: PlaylistAvailability;

  @Field()
  url: string;

  @OptionalField(() => String)
  cover: Nullable<string>;
}
