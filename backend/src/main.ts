import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('UAIFOOD API')
    .setDescription('API completa do aplicativo de delivery UAIFOOD')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Autenticação', 'Endpoints de autenticação e registro')
    .addTag('Usuários', 'Gerenciamento de usuários')
    .addTag('Restaurantes', 'Gerenciamento de restaurantes')
    .addTag('Produtos', 'Gerenciamento de produtos')
    .addTag('Pedidos', 'Gerenciamento de pedidos')
    .addTag('Endereços', 'Gerenciamento de endereços')
    .addTag('Avaliações', 'Sistema de avaliações')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Servidor rodando em: http://localhost:${port}`);
  console.log(`📚 Documentação Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();
