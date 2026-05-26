import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { validateFarmArea } from '../domain/farm-area';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFarmDto, UpdateFarmDto } from './dto/farm.dto';

@Injectable()
export class FarmsService {
  private readonly logger = new Logger(FarmsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(producerId: string, dto: CreateFarmDto) {
    await this.ensureProducerExists(producerId);
    validateFarmArea(dto.totalArea, dto.arableArea, dto.vegetationArea);

    const farm = await this.prisma.farm.create({
      data: {
        producerId,
        name: dto.name,
        city: dto.city,
        state: dto.state.toUpperCase(),
        totalArea: dto.totalArea,
        arableArea: dto.arableArea,
        vegetationArea: dto.vegetationArea,
        harvestCrops: dto.harvestCrops?.length
          ? {
              create: dto.harvestCrops.map((item) => ({
                harvest: item.harvest,
                crop: item.crop
              }))
            }
          : undefined
      },
      include: { harvestCrops: true }
    });

    this.logger.log({ message: 'farm.created', farmId: farm.id, producerId });
    return farm;
  }

  async listByProducer(producerId: string) {
    await this.ensureProducerExists(producerId);
    return this.prisma.farm.findMany({
      where: { producerId, deletedAt: null },
      include: { harvestCrops: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async get(farmId: string) {
    const farm = await this.prisma.farm.findFirst({
      where: { id: farmId, deletedAt: null },
      include: { harvestCrops: true }
    });
    if (!farm) throw new Error('FARM_NOT_FOUND');
    return farm;
  }

  async update(farmId: string, dto: UpdateFarmDto) {
    await this.get(farmId);
    validateFarmArea(dto.totalArea, dto.arableArea, dto.vegetationArea);

    const farm = await this.prisma.farm.update({
      where: { id: farmId },
      data: {
        name: dto.name,
        city: dto.city,
        state: dto.state.toUpperCase(),
        totalArea: dto.totalArea,
        arableArea: dto.arableArea,
        vegetationArea: dto.vegetationArea
      },
      include: { harvestCrops: true }
    });

    this.logger.log({ message: 'farm.updated', farmId });
    return farm;
  }

  async remove(farmId: string) {
    await this.get(farmId);
    await this.prisma.farm.update({
      where: { id: farmId },
      data: { deletedAt: new Date() }
    });
    this.logger.log({ message: 'farm.deleted', farmId });
  }

  private async ensureProducerExists(producerId: string) {
    const count = await this.prisma.producer.count({ where: { id: producerId, deletedAt: null } });
    if (!count) throw new Error('PRODUCER_NOT_FOUND');
  }
}
