import { Module } from '@nestjs/common';
import { FarmsModule } from '../farms/farms.module';
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';

@Module({
  imports: [FarmsModule],
  controllers: [ProducersController],
  providers: [ProducersService],
  exports: [ProducersService]
})
export class ProducersModule {}
