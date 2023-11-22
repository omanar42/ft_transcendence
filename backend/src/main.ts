import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaFilter } from './prisma/prisma.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(3000);
}
bootstrap();
