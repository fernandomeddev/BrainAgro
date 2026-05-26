import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async get() {
    const [totalFarms, area, states, crops] = await Promise.all([
      this.prisma.farm.count({ where: { deletedAt: null } }),
      this.prisma.farm.aggregate({
        where: { deletedAt: null },
        _sum: {
          totalArea: true,
          arableArea: true,
          vegetationArea: true
        }
      }),
      this.prisma.farm.groupBy({
        by: ['state'],
        where: { deletedAt: null },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } }
      }),
      this.prisma.harvestCrop.groupBy({
        by: ['crop'],
        where: { farm: { deletedAt: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } }
      })
    ]);

    return {
      totalFarms,
      totalArea: Number(area._sum.totalArea ?? 0),
      byState: states.map((item) => ({
        state: item.state,
        total: item._count.id
      })),
      byCrop: crops.map((item) => ({
        crop: item.crop,
        total: item._count.id
      })),
      byLandUse: {
        arableArea: Number(area._sum.arableArea ?? 0),
        vegetationArea: Number(area._sum.vegetationArea ?? 0)
      }
    };
  }
}
