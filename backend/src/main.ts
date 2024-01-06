import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaFilter } from './prisma/prisma.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://127.0.0.1:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const Config = new DocumentBuilder()
    .setTitle('ft_transcendence')
    .setDescription('The ft_transcendence API')
    .setVersion('1.0')
    .addTag('ft_transcendence')
    .build();

  const document = SwaggerModule.createDocument(app, Config);
  SwaggerModule.setup('api', app, document);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaFilter(httpAdapter));

  app.use(cookieParser());

  await app.listen(3000);
}

bootstrap();
