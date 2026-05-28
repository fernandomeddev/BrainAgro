import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { mapDomainError } from '../common/errors';
import { CreateFarmDto, UpdateFarmDto } from './dto/farm.dto';
import { FarmsService } from './farms.service';

@ApiTags('Farms')
@Controller()
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @ApiOperation({ summary: 'Cadastra uma propriedade para o produtor' })
  @ApiParam({ name: 'producerId', format: 'uuid' })
  @Post('producers/:producerId/farms')
  async create(@Param('producerId') producerId: string, @Body() dto: CreateFarmDto) {
    try {
      return await this.farmsService.create(producerId, dto);
    } catch (error) {
      mapDomainError(error);
    }
  }

  @ApiOperation({ summary: 'Lista propriedades de um produtor' })
  @ApiParam({ name: 'producerId', format: 'uuid' })
  @Get('producers/:producerId/farms')
  async listByProducer(@Param('producerId') producerId: string) {
    try {
      return await this.farmsService.listByProducer(producerId);
    } catch (error) {
      mapDomainError(error);
    }
  }

  @ApiOperation({ summary: 'Busca uma propriedade por ID' })
  @ApiParam({ name: 'farmId', format: 'uuid' })
  @Get('farms/:farmId')
  async get(@Param('farmId') farmId: string) {
    try {
      return await this.farmsService.get(farmId);
    } catch (error) {
      mapDomainError(error);
    }
  }

  @ApiOperation({ summary: 'Atualiza uma propriedade' })
  @ApiParam({ name: 'farmId', format: 'uuid' })
  @Put('farms/:farmId')
  async update(@Param('farmId') farmId: string, @Body() dto: UpdateFarmDto) {
    try {
      return await this.farmsService.update(farmId, dto);
    } catch (error) {
      mapDomainError(error);
    }
  }

  @ApiOperation({ summary: 'Remove uma propriedade' })
  @ApiParam({ name: 'farmId', format: 'uuid' })
  @Delete('farms/:farmId')
  async remove(@Param('farmId') farmId: string) {
    try {
      await this.farmsService.remove(farmId);
    } catch (error) {
      mapDomainError(error);
    }
  }
}
