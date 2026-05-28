import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { mapDomainError } from '../common/errors';
import { CreateProducerDto, UpdateProducerDto } from './dto/producer.dto';
import { ProducersService } from './producers.service';

@ApiTags('Producers')
@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @ApiOperation({ summary: 'Cadastra um produtor rural' })
  @Post()
  async create(@Body() dto: CreateProducerDto) {
    try {
      return await this.producersService.create(dto);
    } catch (error) {
      mapDomainError(error);
    }
  }

  @ApiOperation({ summary: 'Lista produtores rurais' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiQuery({ name: 'search', required: false })
  @Get()
  list(@Query('page') page = '1', @Query('pageSize') pageSize = '20', @Query('search') search?: string) {
    return this.producersService.list(Number(page), Number(pageSize), search);
  }

  @ApiOperation({ summary: 'Busca um produtor por ID' })
  @ApiParam({ name: 'producerId', format: 'uuid' })
  @Get(':producerId')
  async get(@Param('producerId') producerId: string) {
    try {
      return await this.producersService.get(producerId);
    } catch (error) {
      mapDomainError(error);
    }
  }

  @ApiOperation({ summary: 'Atualiza um produtor' })
  @ApiParam({ name: 'producerId', format: 'uuid' })
  @Put(':producerId')
  async update(@Param('producerId') producerId: string, @Body() dto: UpdateProducerDto) {
    try {
      return await this.producersService.update(producerId, dto);
    } catch (error) {
      mapDomainError(error);
    }
  }

  @ApiOperation({ summary: 'Remove um produtor' })
  @ApiParam({ name: 'producerId', format: 'uuid' })
  @Delete(':producerId')
  async remove(@Param('producerId') producerId: string) {
    try {
      await this.producersService.remove(producerId);
    } catch (error) {
      mapDomainError(error);
    }
  }
}
