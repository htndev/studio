import { Featuring } from './featuring.entity';
import { Album } from './album.entity';
import { EnhancedBaseEntity } from '@xbeat/server-toolkit';
import { FIELD_LENGTH, Nullable } from '@xbeat/toolkit';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { MAX_ARTIST_URL_LENGTH } from '../common/constants/common.constant';
import { User } from './user.entity';

@Entity('artists')
export class Artist extends EnhancedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: FIELD_LENGTH.ARTIST.MAX,
    unique: true
  })
  name: string;

  @Column({
    type: 'varchar',
    length: MAX_ARTIST_URL_LENGTH,
    unique: true
  })
  url: string;

  @Column({
    nullable: true,
    type: 'varchar'
  })
  avatar: Nullable<string>;

  @Column({
    nullable: true,
    type: 'varchar'
  })
  header: Nullable<string>;

  @ManyToOne(
    () => User,
    user => user.artists
  )
  @JoinColumn()
  user: User;

  @Column()
  userId: number;

  @OneToMany(
    () => Album,
    album => album.artist,
    { eager: false }
  )
  albums: Album[];

  @ManyToOne(
    () => Featuring,
    feat => feat.artist,
    { eager: false }
  )
  featuring: Featuring[];
}
