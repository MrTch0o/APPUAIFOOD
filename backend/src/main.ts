import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Servir arquivos estáticos da pasta uploads
  // Em desenvolvimento: src/main.ts → dist/main.js, então uploads fica em ../../uploads
  // Em produção: dist/main.js, então uploads fica em ../uploads
  const uploadsPath = join(process.cwd(), 'uploads');
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:5173'],
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

  // Exception Filters (ordem importante: mais específico primeiro)
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new PrismaExceptionFilter(),
    new HttpExceptionFilter(),
  );

  // Transform Interceptor (padroniza respostas de sucesso)
  app.useGlobalInterceptors(new TransformInterceptor());

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
    .addTag('Carrinho', 'Gerenciamento do carrinho de compras')
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

bootstrap().catch((error) => {
  console.error('❌ Erro ao iniciar o servidor:', error);
  process.exit(1);
});
