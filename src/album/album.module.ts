import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumResolver } from './album.resolver';

@Module({
  providers: [AlbumService, AlbumResolver]
})
export class AlbumModule {}
