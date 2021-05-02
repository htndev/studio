import { Field, ObjectType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';

@ObjectType()
export class AlbumType {
  @Field()
  name: string;

  @Field()
  url: string;

  @OptionalField()
  cover: string;

  @Field()
  released: string;
}
