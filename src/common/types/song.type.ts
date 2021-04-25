import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SongType {
  @Field()
  name: string;

  @Field()
  url: string;
}
