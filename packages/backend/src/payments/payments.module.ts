import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, ConfigService, JwtService],
})
export class PaymentsModule {}
