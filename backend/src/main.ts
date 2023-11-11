import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const Config = new DocumentBuilder()
  .setTitle('ft_transcendence')
  .setDescription('The ft_transcendence API')
  .setVersion('1.0')
  .addTag('ft_transcendence')
  .build();
  
  const document = SwaggerModule.createDocument(app, Config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
