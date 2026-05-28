import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHarvestCropDto, UpdateHarvestCropDto } from './dto/harvest-crop.dto';

@Injectable()
export class HarvestCropsService {
  private readonly logger = new Logger(HarvestCropsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(farmId: string, dto: CreateHarvestCropDto) {
    await this.ensureFarmExists(farmId);

    try {
      const harvestCrop = await this.prisma.harvestCrop.create({
        data: {
          farmId,
          harvest: dto.harvest,
          crop: dto.crop
        }
      });
      this.logger.log({ message: 'harvest_crop.created', harvestCropId: harvestCrop.id, farmId });
      return harvestCrop;
    } catch (error) {
      if (this.isUniqueConstraint(error)) throw new Error('HARVEST_CROP_ALREADY_EXISTS');
      throw error;
    }
  }

  async listByFarm(farmId: string) {
    await this.ensureFarmExists(farmId);

    return this.prisma.harvestCrop.findMany({
      where: { farmId },
      orderBy: [{ harvest: 'desc' }, { crop: 'asc' }]
    });
  }

  async update(harvestCropId: string, dto: UpdateHarvestCropDto) {
    await this.get(harvestCropId);

    try {
      const harvestCrop = await this.prisma.harvestCrop.update({
        where: { id: harvestCropId },
        data: {
          harvest: dto.harvest,
          crop: dto.crop
        }
      });
      this.logger.log({ message: 'harvest_crop.updated', harvestCropId });
      return harvestCrop;
    } catch (error) {
      if (this.isUniqueConstraint(error)) throw new Error('HARVEST_CROP_ALREADY_EXISTS');
      throw error;
    }
  }

  async remove(harvestCropId: string) {
    await this.get(harvestCropId);
    await this.prisma.harvestCrop.delete({ where: { id: harvestCropId } });
    this.logger.log({ message: 'harvest_crop.deleted', harvestCropId });
  }

  private async get(harvestCropId: string) {
    const harvestCrop = await this.prisma.harvestCrop.findUnique({ where: { id: harvestCropId } });
    if (!harvestCrop) throw new Error('HARVEST_CROP_NOT_FOUND');
    return harvestCrop;
  }

  private async ensureFarmExists(farmId: string) {
    const count = await this.prisma.farm.count({ where: { id: farmId, deletedAt: null } });
    if (!count) throw new Error('FARM_NOT_FOUND');
  }

  private isUniqueConstraint(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
  }
}
