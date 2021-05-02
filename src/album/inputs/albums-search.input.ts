import { InputType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

import { MAX_ALBUM_URL_LENGTH } from '../../common/constants/common.constant';

@InputType({ description: 'Flexible search for albums' })
export class AlbumsSearchInput {
  @OptionalField()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, MAX_ALBUM_URL_LENGTH)
  artist?: string;

  @OptionalField()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @OptionalField()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  url?: string;
}
