import { InputType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';

@InputType()
export class PlaylistSearch {
  @OptionalField()
  url?: string;

  @OptionalField()
  title?: string;

  @OptionalField()
  username?: string;
}
