import { EnhancedBaseEntity } from '@xbeat/server-toolkit';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Playlist } from './playlist.entity';
import { Song } from './song.entity';

@Entity('playlist_song')
export class PlaylistSong extends EnhancedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Song,
    song => song.songInPlaylist,
    { eager: true }
  )
  @JoinColumn()
  song: Song;

  @Column()
  songId: number;

  @ManyToOne(
    () => Playlist,
    playlist => playlist.playlistSongs,
    { eager: true }
  )
  @JoinColumn()
  playlist: Playlist;

  @Column()
  playlistId: number;

  @Column({
    type: 'timestamp',
    default: new Date()
  })
  dateAdded: Date;
}
