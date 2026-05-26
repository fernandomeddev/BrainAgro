import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, Length, Min, ValidateNested } from 'class-validator';
import { CreateHarvestCropDto } from '../../harvest-crops/dto/harvest-crop.dto';

export class CreateFarmDto {
  @IsString()
  name!: string;

  @IsString()
  city!: string;

  @IsString()
  @Length(2, 2)
  state!: string;

  @IsNumber()
  @Min(0.01)
  totalArea!: number;

  @IsNumber()
  @Min(0)
  arableArea!: number;

  @IsNumber()
  @Min(0)
  vegetationArea!: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateHarvestCropDto)
  harvestCrops?: CreateHarvestCropDto[];
}

export class UpdateFarmDto extends CreateFarmDto {}
