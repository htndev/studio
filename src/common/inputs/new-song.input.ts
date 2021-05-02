import { Field, InputType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';
import { FIELD_LENGTH } from '@xbeat/toolkit';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

@InputType()
export class NewSongInput {
  @Field()
  @IsNotEmpty()
  @Length(FIELD_LENGTH.SONG.MIN, FIELD_LENGTH.SONG.MAX)
  name: string;

  @Field()
  @IsNotEmpty()
  file: string;

  @OptionalField(() => [String])
  @IsOptional()
  featuring?: string[];
}
