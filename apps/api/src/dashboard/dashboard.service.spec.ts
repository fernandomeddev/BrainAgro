import { DashboardService } from './dashboard.service';

describe('dashboard service', () => {
  it('returns consolidated dashboard metrics', async () => {
    const prisma = {
      farm: {
        count: jest.fn().mockResolvedValue(2),
        aggregate: jest.fn().mockResolvedValue({
          _sum: {
            totalArea: 300,
            arableArea: 220,
            vegetationArea: 80
          }
        }),
        groupBy: jest.fn().mockResolvedValue([
          {
            state: 'MT',
            _count: { id: 2 }
          }
        ])
      },
      harvestCrop: {
        groupBy: jest.fn().mockResolvedValue([
          {
            crop: 'Soja',
            _count: { id: 3 }
          }
        ])
      }
    };
    const service = new DashboardService(prisma as never);

    const dashboard = await service.get();

    expect(dashboard).toEqual({
      totalFarms: 2,
      totalArea: 300,
      byState: [{ state: 'MT', total: 2 }],
      byCrop: [{ crop: 'Soja', total: 3 }],
      byLandUse: {
        arableArea: 220,
        vegetationArea: 80
      }
    });
    expect(prisma.farm.count).toHaveBeenCalledWith({ where: { deletedAt: null } });
    expect(prisma.harvestCrop.groupBy).toHaveBeenCalledWith({
      by: ['crop'],
      where: { farm: { deletedAt: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    });
  });
});
