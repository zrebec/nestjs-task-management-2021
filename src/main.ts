import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Using global validation pipes for DTO's
  app.useGlobalPipes(new ValidationPipe({
    // If this is set to true, only DTO's props will be accepeted
    // in the request (e.g. in body).
    // But in course they are not using this yet.
    // After couse, we can change it to true and test all functions
    // of better create tests 
    whitelist: false,
  }));
  await app.listen(3000);
}
bootstrap();
