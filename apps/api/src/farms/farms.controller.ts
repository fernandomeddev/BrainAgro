import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { mapDomainError } from '../common/errors';
import { CreateFarmDto, UpdateFarmDto } from './dto/farm.dto';
import { FarmsService } from './farms.service';

@Controller()
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Post('producers/:producerId/farms')
  async create(@Param('producerId') producerId: string, @Body() dto: CreateFarmDto) {
    try {
      return await this.farmsService.create(producerId, dto);
    } catch (error) {
      mapDomainError(error);
    }
  }

  @Get('producers/:producerId/farms')
  async listByProducer(@Param('producerId') producerId: string) {
    try {
      return await this.farmsService.listByProducer(producerId);
    } catch (error) {
      mapDomainError(error);
    }
  }

  @Get('farms/:farmId')
  async get(@Param('farmId') farmId: string) {
    try {
      return await this.farmsService.get(farmId);
    } catch (error) {
      mapDomainError(error);
    }
  }

  @Put('farms/:farmId')
  async update(@Param('farmId') farmId: string, @Body() dto: UpdateFarmDto) {
    try {
      return await this.farmsService.update(farmId, dto);
    } catch (error) {
      mapDomainError(error);
    }
  }

  @Delete('farms/:farmId')
  async remove(@Param('farmId') farmId: string) {
    try {
      await this.farmsService.remove(farmId);
    } catch (error) {
      mapDomainError(error);
    }
  }
}
