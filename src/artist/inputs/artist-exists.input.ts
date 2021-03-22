import { Field, InputType } from '@nestjs/graphql';
import { FIELD_LENGTH } from '@xbeat/toolkit';
import { IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class ArtistExistsInput {
  @Field()
  @IsString()
  @MinLength(FIELD_LENGTH.ARTIST.MIN)
  @MaxLength(FIELD_LENGTH.ARTIST.MAX)
  name: string;
}
