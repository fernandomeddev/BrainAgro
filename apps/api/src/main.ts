import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.enableCors({
    origin: process.env.WEB_ORIGIN ?? 'http://localhost:5173'
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Brain Agriculture API')
    .setDescription('API REST para gerenciamento de produtores rurais, propriedades, safras, culturas e dashboard.')
    .setVersion('1.0.0')
    .addServer(`http://localhost:${process.env.API_PORT ?? 3333}`, 'Local')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, {
    jsonDocumentUrl: 'docs-json',
    swaggerOptions: {
      persistAuthorization: true
    }
  });

  const port = Number(process.env.API_PORT ?? 3333);
  await app.listen(port);
}

void bootstrap();
