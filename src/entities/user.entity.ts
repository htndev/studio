import { Playlist } from './playlist.entity';
import { Artist } from './artist.entity';
import { EnhancedBaseEntity } from '@xbeat/server-toolkit';
import { Nullable } from '@xbeat/toolkit';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users', synchronize: false })
export class User extends EnhancedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true
  })
  @Index()
  email: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: 26
  })
  @Index()
  username: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  avatar: Nullable<string>;

  @OneToMany(
    () => Artist,
    artist => artist.user,
    { eager: true }
  )
  artists: Artist[];

  @OneToMany(
    () => Playlist,
    playlist => playlist.owner,
    { eager: false }
  )
  playlists: Playlist[];
}
