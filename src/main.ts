import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Get EnvV
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('port');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // // docs
  const config = new DocumentBuilder()
    .setTitle('Bakery')
    .setDescription('Bakery REST API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // endpoint  /api

  await app.listen(PORT);
  logger.log(`App is running on port ${PORT}`);
}
bootstrap();
