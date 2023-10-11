import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.enableCors({
    origin: (
      configService.get<string>('CORS_WHITELIST') || 'http://localhost:3000'
    ).split(','),
    methods: ['HEAD', 'GET', 'POST'],
    credentials: true,
  });
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.flushLogs();

  const config = new DocumentBuilder()
    .setTitle('AQA Backend')
    .setDescription('OpenAPI API spec for AQA BE')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app
    .useGlobalPipes(new ValidationPipe())
    .listen(configService.get<number>('PORT'));
}

bootstrap();
