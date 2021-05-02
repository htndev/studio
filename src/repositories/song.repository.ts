import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@xbeat/server-toolkit';
import { EntityRepository } from 'typeorm';

import { MAX_SONG_URL_LENGTH } from '../common/constants/common.constant';
import { NewSongInput } from '../common/inputs/new-song.input';
import RandomProvider from '../common/providers/random/random.provider';
import { Album } from '../entities/album.entity';
import { Featuring } from '../entities/featuring.entity';
import { Song } from '../entities/song.entity';

@Injectable()
@EntityRepository(Song)
export class SongRepository extends BaseRepository<Song> {
  async createNewSong({
    name,
    file,
    album,
    featuring
  }: NewSongInput & { album: Album; featuring?: Featuring; url: string; }): Promise<Song> {
    const song = new Song();

    song.name = name;
    song.url = await this.generateUrl();
    song.file = file;
    song.album = album;
    if (featuring) {
      song.featuring = featuring;
    }

    return song.save();
  }

  private async generateUrl(): Promise<string> {
    const url = RandomProvider.getRandomString(MAX_SONG_URL_LENGTH);
    const isUrlExist = await this.isExists({ url });

    return isUrlExist ? this.generateUrl() : url;
  }
}
