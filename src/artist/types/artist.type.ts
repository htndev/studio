import { Field, ObjectType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';

@ObjectType()
export class ArtistType {
  @Field()
  name: string;

  @Field()
  url: string;

  @OptionalField()
  avatar: string;

  @OptionalField()
  header: string;
}
