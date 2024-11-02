import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { ActualService } from './app/common/actual/actual.service';
import { PaginationMetaDto } from './app/common/dto/pagination-meta.dto';

const DEFAULT_PORT = 3000;

function setupSwagger(app: INestApplication<unknown>, serverUrl: string): void {
  const config = new DocumentBuilder()
    .setTitle('Unofficial Actual Dashboard API')
    .setVersion('1.0')
    .addServer(serverUrl)
    .addBearerAuth({
      type: 'http',
      description: 'JWT Auth token',
      bearerFormat: 'JWT',
    })
    .build();

  const documentFactory: () => OpenAPIObject = () =>
    SwaggerModule.createDocument(app, config, { extraModels: [PaginationMetaDto] });

  SwaggerModule.setup('docs', app, documentFactory);
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = await app.resolve(ConfigService);
  const actualService = await app.resolve(ActualService);

  const port = configService.get<number>('APP_PORT', DEFAULT_PORT);
  const basePath = configService.get<string>('APP_BASE_PATH', '');

  // TODO: handle when remote budget cant be loaded
  await actualService.init();

  app.enableCors();
  app.setGlobalPrefix(basePath);

  const serverUrl = `http://localhost:${port}${basePath}`;

  setupSwagger(app, serverUrl);

  await app.listen(port);

  Logger.log(`🚀 Application is running on: ${serverUrl}`);

  // TODO: destroy actual service when shutting down
}

bootstrap();
