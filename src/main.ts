import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   // Define CORS options
   const corsOptions: CorsOptions = {
    origin: ['https://u-evaluation-frontend.vercel.app'], 
    methods:  ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
  };
  // Enable CORS with options
  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();
