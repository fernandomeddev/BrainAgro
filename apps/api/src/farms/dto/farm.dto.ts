import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, Length, Min, ValidateNested } from 'class-validator';
import { CreateHarvestCropDto } from '../../harvest-crops/dto/harvest-crop.dto';

export class CreateFarmDto {
  @ApiProperty({ example: 'Fazenda Boa Esperanca' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Sorriso' })
  @IsString()
  city!: string;

  @ApiProperty({ example: 'MT', minLength: 2, maxLength: 2 })
  @IsString()
  @Length(2, 2)
  state!: string;

  @ApiProperty({ example: 1000, minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  totalArea!: number;

  @ApiProperty({ example: 700, minimum: 0 })
  @IsNumber()
  @Min(0)
  arableArea!: number;

  @ApiProperty({ example: 300, minimum: 0 })
  @IsNumber()
  @Min(0)
  vegetationArea!: number;

  @ApiPropertyOptional({ type: () => [CreateHarvestCropDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateHarvestCropDto)
  harvestCrops?: CreateHarvestCropDto[];
}

export class UpdateFarmDto extends CreateFarmDto {}
