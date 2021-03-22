import { Field, InputType } from '@nestjs/graphql';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { FIELD_LENGTH } from '@xbeat/toolkit';

@InputType()
export class NewArtistInput {
  @Field()
  @IsString()
  @MinLength(FIELD_LENGTH.ARTIST.MIN)
  @MaxLength(FIELD_LENGTH.ARTIST.MAX)
  name: string;
}
