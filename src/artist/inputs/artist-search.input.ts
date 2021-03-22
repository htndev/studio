import { InputType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';
import { FIELD_LENGTH } from '@xbeat/toolkit';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import { MAX_ARTIST_URL_LENGTH } from '../../common/constants/common.constant';

@InputType()
export class ArtistSearchInput {
  @OptionalField()
  @IsOptional()
  @IsString()
  @MinLength(FIELD_LENGTH.ARTIST.MIN)
  @MaxLength(FIELD_LENGTH.ARTIST.MAX)
  name: string;

  @OptionalField()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MinLength(MAX_ARTIST_URL_LENGTH)
  url: string;
}
