import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfig, setupSwagger } from '@xbeat/server-toolkit';
import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  const config = app.get(AppConfig);

  app.setGlobalPrefix(config.apiVersion);
  app.enableCors({
    origin: config.allowedDomains,
    allowedHeaders: config.allowedHeaders,
    credentials: true
  });
  app.disable('x-powered-by');
  app.use(helmet({ contentSecurityPolicy: !config.isDevMode ? undefined : false }));
  app.use(compression());
  if (config.isDevMode) {
    setupSwagger(app, await import('../package.json'));
  }

  await app.listen(config.port);
  logger.verbose(`Server launched on port ${config.port}`);
}
bootstrap();
