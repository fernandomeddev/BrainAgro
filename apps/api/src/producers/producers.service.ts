import { Injectable, Logger } from '@nestjs/common';
import { Prisma, DocumentType as PrismaDocumentType } from '@prisma/client';
import { validateDocument } from '../domain/document';
import { validateFarmArea } from '../domain/farm-area';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProducerDto, UpdateProducerDto } from './dto/producer.dto';

@Injectable()
export class ProducersService {
  private readonly logger = new Logger(ProducersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProducerDto) {
    const document = validateDocument(dto.document);
    dto.farms?.forEach((farm) => validateFarmArea(farm.totalArea, farm.arableArea, farm.vegetationArea));

    try {
      const producer = await this.prisma.producer.create({
        data: {
          document: document.document,
          documentType: document.documentType as PrismaDocumentType,
          name: dto.name,
          farms: dto.farms?.length
            ? {
                create: dto.farms.map((farm) => ({
                  name: farm.name,
                  city: farm.city,
                  state: farm.state.toUpperCase(),
                  totalArea: farm.totalArea,
                  arableArea: farm.arableArea,
                  vegetationArea: farm.vegetationArea,
                  harvestCrops: farm.harvestCrops?.length
                    ? {
                        create: farm.harvestCrops.map((item) => ({
                          harvest: item.harvest,
                          crop: item.crop
                        }))
                      }
                    : undefined
                }))
              }
            : undefined
        },
        include: { farms: { include: { harvestCrops: true } } }
      });

      this.logger.log({ message: 'producer.created', producerId: producer.id });
      return producer;
    } catch (error) {
      if (this.isUniqueConstraint(error)) throw new Error('DOCUMENT_ALREADY_EXISTS');
      throw error;
    }
  }

  async list(page: number, pageSize: number, search?: string) {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.min(pageSize, 100) : 20;
    const where: Prisma.ProducerWhereInput = {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { document: { contains: search.replace(/\D/g, '') } }
            ]
          }
        : {})
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.producer.findMany({
        where,
        include: { farms: { where: { deletedAt: null }, include: { harvestCrops: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (safePage - 1) * safePageSize,
        take: safePageSize
      }),
      this.prisma.producer.count({ where })
    ]);

    return { items, page: safePage, pageSize: safePageSize, total };
  }

  async get(producerId: string) {
    const producer = await this.prisma.producer.findFirst({
      where: { id: producerId, deletedAt: null },
      include: { farms: { where: { deletedAt: null }, include: { harvestCrops: true } } }
    });

    if (!producer) throw new Error('PRODUCER_NOT_FOUND');
    return producer;
  }

  async update(producerId: string, dto: UpdateProducerDto) {
    await this.ensureExists(producerId);
    const document = validateDocument(dto.document);

    try {
      const producer = await this.prisma.producer.update({
        where: { id: producerId },
        data: {
          document: document.document,
          documentType: document.documentType as PrismaDocumentType,
          name: dto.name
        },
        include: { farms: { include: { harvestCrops: true } } }
      });

      this.logger.log({ message: 'producer.updated', producerId });
      return producer;
    } catch (error) {
      if (this.isUniqueConstraint(error)) throw new Error('DOCUMENT_ALREADY_EXISTS');
      throw error;
    }
  }

  async remove(producerId: string) {
    await this.ensureExists(producerId);
    await this.prisma.producer.update({
      where: { id: producerId },
      data: {
        deletedAt: new Date(),
        farms: {
          updateMany: {
            where: { deletedAt: null },
            data: { deletedAt: new Date() }
          }
        }
      }
    });
    this.logger.log({ message: 'producer.deleted', producerId });
  }

  private async ensureExists(producerId: string) {
    const count = await this.prisma.producer.count({ where: { id: producerId, deletedAt: null } });
    if (!count) throw new Error('PRODUCER_NOT_FOUND');
  }

  private isUniqueConstraint(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
  }
}
