import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from '@xbeat/server-toolkit';

import { UserRepository } from '../repositories/user.repository';
import { ConfigModule } from './providers/config/config.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [AppConfig],
      useFactory: ({ jwtSecret: secret }: AppConfig) => ({ secret })
    }),
    TypeOrmModule.forFeature([UserRepository]),
    ConfigModule
  ],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtModule, ConfigModule, JwtStrategy]
})
export class CommonModule {}
