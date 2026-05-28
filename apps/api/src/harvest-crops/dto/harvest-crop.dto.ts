import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateHarvestCropDto {
  @ApiProperty({ example: 'Safra 2026' })
  @IsString()
  harvest!: string;

  @ApiProperty({ example: 'Soja' })
  @IsString()
  crop!: string;
}

export class UpdateHarvestCropDto extends CreateHarvestCropDto {}
