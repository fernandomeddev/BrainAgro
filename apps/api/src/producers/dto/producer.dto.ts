import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { CreateFarmDto } from '../../farms/dto/farm.dto';

export class CreateProducerDto {
  @IsString()
  document!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFarmDto)
  farms?: CreateFarmDto[];
}

export class UpdateProducerDto {
  @IsString()
  document!: string;

  @IsString()
  @MinLength(2)
  name!: string;
}
