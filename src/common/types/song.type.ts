import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SongType {
  @Field()
  name: string;

  @Field()
  url: string;

  @Field()
  file: string;

  @Field(() => Boolean)
  released: boolean;
}
