import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './utils/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  })

  app.useGlobalPipes(new ValidationPipe);
  app.useGlobalInterceptors(new TransformInterceptor);

  await app.listen(process.env.PORT ?? 3000);

  // console.log(process.env.PORT);
}
void bootstrap();
