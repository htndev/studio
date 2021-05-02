import { InputType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

import { MAX_SONG_URL_LENGTH } from '../../common/constants/common.constant';

@InputType()
export class SongSearchInput {
  @OptionalField()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @OptionalField()
  @IsOptional()
  @IsNotEmpty()
  @Length(1, MAX_SONG_URL_LENGTH)
  url?: string;
}
