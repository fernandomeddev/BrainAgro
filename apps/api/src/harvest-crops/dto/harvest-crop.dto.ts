import { IsString } from 'class-validator';

export class CreateHarvestCropDto {
  @IsString()
  harvest!: string;

  @IsString()
  crop!: string;
}

export class UpdateHarvestCropDto extends CreateHarvestCropDto {}
