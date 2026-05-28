import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { mapDomainError } from '../common/errors';
import { CreateHarvestCropDto, UpdateHarvestCropDto } from './dto/harvest-crop.dto';
import { HarvestCropsService } from './harvest-crops.service';

@ApiTags('HarvestCrops')
@Controller()
export class HarvestCropsController {
  constructor(private readonly harvestCropsService: HarvestCropsService) {}

  @ApiOperation({ summary: 'Registra uma cultura por safra em uma propriedade' })
  @ApiParam({ name: 'farmId', format: 'uuid' })
  @Post('farms/:farmId/harvest-crops')
  async create(@Param('farmId') farmId: string, @Body() dto: CreateHarvestCropDto) {
    try {
      return await this.harvestCropsService.create(farmId, dto);
    } catch (error) {
      mapDomainError(error);
    }
  }

  @ApiOperation({ summary: 'Lista culturas por safra de uma propriedade' })
  @ApiParam({ name: 'farmId', format: 'uuid' })
  @Get('farms/:farmId/harvest-crops')
  async listByFarm(@Param('farmId') farmId: string) {
    try {
      return await this.harvestCropsService.listByFarm(farmId);
    } catch (error) {
      mapDomainError(error);
    }
  }

  @ApiOperation({ summary: 'Atualiza uma cultura por safra' })
  @ApiParam({ name: 'harvestCropId', format: 'uuid' })
  @Put('harvest-crops/:harvestCropId')
  async update(@Param('harvestCropId') harvestCropId: string, @Body() dto: UpdateHarvestCropDto) {
    try {
      return await this.harvestCropsService.update(harvestCropId, dto);
    } catch (error) {
      mapDomainError(error);
    }
  }

  @ApiOperation({ summary: 'Remove uma cultura por safra' })
  @ApiParam({ name: 'harvestCropId', format: 'uuid' })
  @Delete('harvest-crops/:harvestCropId')
  async remove(@Param('harvestCropId') harvestCropId: string) {
    try {
      await this.harvestCropsService.remove(harvestCropId);
    } catch (error) {
      mapDomainError(error);
    }
  }
}
