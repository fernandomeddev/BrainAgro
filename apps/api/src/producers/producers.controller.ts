import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { mapDomainError } from '../common/errors';
import { CreateProducerDto, UpdateProducerDto } from './dto/producer.dto';
import { ProducersService } from './producers.service';

@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Post()
  async create(@Body() dto: CreateProducerDto) {
    try {
      return await this.producersService.create(dto);
    } catch (error) {
      mapDomainError(error);
    }
  }

  @Get()
  list(@Query('page') page = '1', @Query('pageSize') pageSize = '20', @Query('search') search?: string) {
    return this.producersService.list(Number(page), Number(pageSize), search);
  }

  @Get(':producerId')
  async get(@Param('producerId') producerId: string) {
    try {
      return await this.producersService.get(producerId);
    } catch (error) {
      mapDomainError(error);
    }
  }

  @Put(':producerId')
  async update(@Param('producerId') producerId: string, @Body() dto: UpdateProducerDto) {
    try {
      return await this.producersService.update(producerId, dto);
    } catch (error) {
      mapDomainError(error);
    }
  }

  @Delete(':producerId')
  async remove(@Param('producerId') producerId: string) {
    try {
      await this.producersService.remove(producerId);
    } catch (error) {
      mapDomainError(error);
    }
  }
}
