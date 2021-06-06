import { Field, ObjectType } from '@nestjs/graphql';

import { ArtistType } from '../../artist/types/artist.type';
import { AlbumType } from '../../common/types/album.type';
import { SongType } from '../../common/types/song.type';
import { PlaylistType } from '../../playlist/types/playlist.type';

@ObjectType()
export class SearchType {
  @Field(() => [ArtistType])
  artists: ArtistType[];

  @Field(() => [AlbumType])
  albums: AlbumType[];

  @Field(() => [SongType])
  songs: SongType[];

  @Field(() => [PlaylistType])
  playlists: PlaylistType[];
}
