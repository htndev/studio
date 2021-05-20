import { BaseRepository, buildFieldLabels } from '@xbeat/server-toolkit';
import { EntityRepository } from 'typeorm';

import { PlaylistSong } from '../entities/playlist-song.entity';

@EntityRepository(PlaylistSong)
export class PlaylistSongRepository extends BaseRepository<PlaylistSong> {
  private readonly label = 'playlistSong';

  async isPairExist({ songId, playlistId }: { songId: number; playlistId: number }): Promise<boolean> {
    const query = this.createQueryBuilder(this.label)
      .select(buildFieldLabels(this.label, ['id']))
      .where(`${this.label}.songId = :songId`, { songId })
      .andWhere(`${this.label}.playlistId = :playlistId`, { playlistId });

    try {
      await query.getOneOrFail();
      return true;
    } catch {
      return false;
    }
  }
}
