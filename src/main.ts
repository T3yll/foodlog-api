import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Prefix pour l'API (optionnel)
  const globalPrefix = process.env.API_PREFIX || 'api';
  if (globalPrefix !== 'api') {
    app.setGlobalPrefix(globalPrefix);
  }

  // Port depuis les variables d'environnement
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT') || 4000;
  
  await app.listen(port);
  console.log(`🚀 FoodLog API is running on: http://localhost:${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 JWT Secret configured: ${process.env.JWT_SECRET ? '✅' : '❌'}`);
}

bootstrap();