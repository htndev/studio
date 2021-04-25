import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongResolver } from './song.resolver';

@Module({
  providers: [SongService, SongResolver]
})
export class SongModule {}
