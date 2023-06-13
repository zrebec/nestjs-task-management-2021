import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './tasks/tranform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Using global validation pipes for DTO's
  app.useGlobalPipes(new ValidationPipe({
    // If whitelist is set to true, only DTO's props will be accepeted
    // in the request (e.g. in body).
    // If forbidNonWhitelisted is set to true, any props which is out of
    // DTO's will be forbidden and we get bad request response.
    // This could be usesul for some injection protect
    // But in course they are not using this yet.
    // After couse, we can change it to true and test all functions
    // of better create tests 
    whitelist: false,
    forbidNonWhitelisted: false,
  }));
  // Using interceptor for hide senstitive informations. More in
  // transform.interceptor file
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(3000);
}
bootstrap();
