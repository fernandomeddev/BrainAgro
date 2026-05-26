import { Module } from '@nestjs/common';
import { HarvestCropsController } from './harvest-crops.controller';
import { HarvestCropsService } from './harvest-crops.service';

@Module({
  controllers: [HarvestCropsController],
  providers: [HarvestCropsService]
})
export class HarvestCropsModule {}
