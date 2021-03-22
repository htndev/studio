import { Module } from '@nestjs/common';
import { AppConfig, DatabaseConfig, MicroservicesConfig, RedisConfig } from '@xbeat/server-toolkit';

const CONFIGS = [AppConfig, DatabaseConfig, RedisConfig, MicroservicesConfig];

@Module({
  providers: CONFIGS,
  exports: CONFIGS
})
export class ConfigModule {}
