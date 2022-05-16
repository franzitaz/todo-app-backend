import { Header, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('TODOApp API')
    .setDescription('ToDo APP - API NestJS e React TypeScript.')
    .setVersion('0.0.1')
    //.addTag('cats')
    /*.addBearerAuth({
      type: 'apiKey',
      in: 'header',
      name: 'Authorization'
    })*/
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
