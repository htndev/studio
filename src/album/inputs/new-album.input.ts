import { Field, InputType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';
import { FIELD_LENGTH } from '@xbeat/toolkit';
import { IsArray, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

import { NewSongInput } from '../../common/inputs/new-song.input';

@InputType()
export class NewAlbumInput {
  @Field()
  @IsNotEmpty()
  @Length(FIELD_LENGTH.ALBUM.MIN, FIELD_LENGTH.ALBUM.MAX)
  name: string;

  @Field()
  @IsNotEmpty()
  artistUrl: string;

  @OptionalField()
  @IsOptional()
  @IsString()
  cover?: string;

  @Field()
  @IsNotEmpty()
  release: string;

  @Field(() => [NewSongInput])
  @IsArray()
  songs: NewSongInput[];
}
