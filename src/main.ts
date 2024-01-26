import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ cors: true });
  // Добавим глобальный пайплайн валидации на следующей строке
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true}));
  app.use(helmet());
  await app.listen(3001);
}
bootstrap();
