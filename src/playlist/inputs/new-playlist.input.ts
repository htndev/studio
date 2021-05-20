import { FIELD_LENGTH } from '@xbeat/toolkit';
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Length } from 'class-validator';

@InputType()
export class NewPlaylistInput {
  @Field()
  @IsNotEmpty()
  @Length(FIELD_LENGTH.PLAYLIST.MIN, FIELD_LENGTH.PLAYLIST.MAX)
  title: string;
}
