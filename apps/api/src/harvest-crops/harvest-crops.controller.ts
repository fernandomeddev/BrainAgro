import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { mapDomainError } from '../common/errors';
import { CreateHarvestCropDto, UpdateHarvestCropDto } from './dto/harvest-crop.dto';
import { HarvestCropsService } from './harvest-crops.service';

@Controller()
export class HarvestCropsController {
  constructor(private readonly harvestCropsService: HarvestCropsService) {}

  @Post('farms/:farmId/harvest-crops')
  async create(@Param('farmId') farmId: string, @Body() dto: CreateHarvestCropDto) {
    try {
      return await this.harvestCropsService.create(farmId, dto);
    } catch (error) {
      mapDomainError(error);
    }
  }

  @Get('farms/:farmId/harvest-crops')
  async listByFarm(@Param('farmId') farmId: string) {
    try {
      return await this.harvestCropsService.listByFarm(farmId);
    } catch (error) {
      mapDomainError(error);
    }
  }

  @Put('harvest-crops/:harvestCropId')
  async update(@Param('harvestCropId') harvestCropId: string, @Body() dto: UpdateHarvestCropDto) {
    try {
      return await this.harvestCropsService.update(harvestCropId, dto);
    } catch (error) {
      mapDomainError(error);
    }
  }

  @Delete('harvest-crops/:harvestCropId')
  async remove(@Param('harvestCropId') harvestCropId: string) {
    try {
      await this.harvestCropsService.remove(harvestCropId);
    } catch (error) {
      mapDomainError(error);
    }
  }
}
