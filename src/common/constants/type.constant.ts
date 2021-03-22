import { Maybe } from '@xbeat/toolkit';

import { Artist } from '../../entities/artist.entity';
import { User } from '../../entities/user.entity';

export type AllowedUserFields = keyof Pick<User, 'id' | 'username' | 'email' | 'avatar'>;

export type AllowedArtistFields = keyof Pick<Artist, 'id' | 'name' | 'avatar' | 'header' | 'url'>;

export type QueryResult<T, F extends keyof T> = Maybe<Pick<T, F>>;
