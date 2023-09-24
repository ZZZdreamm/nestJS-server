import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(express.static(join(__dirname, '..', 'public')));
  const config = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('REST API')
    .setVersion('1.0')
    .addTag('KMultan')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  document.servers = [
    {
      url: `http://localhost:${PORT}`,
    },
  ];
  fs.writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });
  await app.listen(PORT);
}
bootstrap();
