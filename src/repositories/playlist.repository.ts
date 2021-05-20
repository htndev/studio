import { BaseRepository } from '@xbeat/server-toolkit';
import { EntityRepository } from 'typeorm';

import { MAX_PLAYLIST_URL_LENGTH } from '../common/constants/common.constant';
import RandomProvider from '../common/providers/random/random.provider';
import { Playlist } from '../entities/playlist.entity';
import { User } from '../entities/user.entity';
import { NewPlaylistInput } from '../playlist/inputs/new-playlist.input';

@EntityRepository(Playlist)
export class PlaylistRepository extends BaseRepository<Playlist> {
  async createPlaylist({ title, user }: NewPlaylistInput & { user: User }): Promise<Playlist> {
    const newPlaylist = new Playlist();
    newPlaylist.title = title;
    newPlaylist.owner = user;
    newPlaylist.url = await this.generateUrl();

    return newPlaylist.save();
  }

  private async generateUrl(): Promise<string> {
    const url = RandomProvider.getRandomString(MAX_PLAYLIST_URL_LENGTH);
    const isUrlExist = await this.isExists({ url });

    return isUrlExist ? this.generateUrl() : url;
  }
}
