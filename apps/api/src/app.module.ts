import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RequestLoggerMiddleware } from './common/request-logger.middleware';
import { DashboardModule } from './dashboard/dashboard.module';
import { FarmsModule } from './farms/farms.module';
import { HarvestCropsModule } from './harvest-crops/harvest-crops.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProducersModule } from './producers/producers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env', '../../.env'], isGlobal: true }),
    PrismaModule,
    ProducersModule,
    FarmsModule,
    HarvestCropsModule,
    DashboardModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
