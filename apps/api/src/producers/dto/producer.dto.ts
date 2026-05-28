import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { CreateFarmDto } from '../../farms/dto/farm.dto';

export class CreateProducerDto {
  @ApiProperty({ example: '12345678909', description: 'CPF ou CNPJ sem pontuacao.' })
  @IsString()
  document!: string;

  @ApiProperty({ example: 'Maria Silva', minLength: 2 })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiPropertyOptional({ type: () => [CreateFarmDto], description: 'Fazendas iniciais do produtor.' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFarmDto)
  farms?: CreateFarmDto[];
}

export class UpdateProducerDto {
  @ApiProperty({ example: '11222333000181', description: 'CPF ou CNPJ sem pontuacao.' })
  @IsString()
  document!: string;

  @ApiProperty({ example: 'Agro Silva LTDA', minLength: 2 })
  @IsString()
  @MinLength(2)
  name!: string;
}
