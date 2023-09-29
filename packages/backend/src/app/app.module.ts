import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentsModule } from '../payments/payments.module';
import { LoggerModule } from 'nestjs-pino';
import { PaymentsController } from '../payments/payments.controller';
import { ProductsController } from '../products/products.controller';
import { ProductsModule } from '../products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { AuthController } from '../auth/auth.controller';
import { UsersController } from '../users/users.controller';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true),
        logging: configService.get<boolean>('DB_LOGGING', true),
        password: configService.get<string>('DB_PASSWORD'),
        username: configService.get<string>('DB_USERNAME'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            crlf: false,
          },
        },
      },
      forRoutes: [
        PaymentsController,
        ProductsController,
        AuthController,
        UsersController,
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PaymentsModule,
    ProductsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
