16
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // Define CORS options
  // Define CORS options
  const corsOptions: CorsOptions = {
    origin: ['https://finale-frontend.vercel.app'],
    methods:  ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
  };
  // Enable CORS with options
  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3002);
}
bootstrap();
