import { HarvestCropsService } from './harvest-crops.service';
import { Prisma } from '@prisma/client';

describe('harvest crops service', () => {
  it('lists harvest crops by farm', async () => {
    const prisma = {
      farm: {
        count: jest.fn().mockResolvedValue(1)
      },
      harvestCrop: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'harvest-crop-1',
            farmId: 'farm-1',
            harvest: 'Safra 2024',
            crop: 'Soja'
          }
        ])
      }
    };
    const service = new HarvestCropsService(prisma as never);

    const result = await service.listByFarm('farm-1');

    expect(prisma.farm.count).toHaveBeenCalledWith({ where: { id: 'farm-1', deletedAt: null } });
    expect(prisma.harvestCrop.findMany).toHaveBeenCalledWith({
      where: { farmId: 'farm-1' },
      orderBy: [{ harvest: 'desc' }, { crop: 'asc' }]
    });
    expect(result).toHaveLength(1);
  });

  it('rejects listing when farm does not exist', async () => {
    const prisma = {
      farm: {
        count: jest.fn().mockResolvedValue(0)
      },
      harvestCrop: {
        findMany: jest.fn()
      }
    };
    const service = new HarvestCropsService(prisma as never);

    await expect(service.listByFarm('missing-farm')).rejects.toThrow('FARM_NOT_FOUND');
    expect(prisma.harvestCrop.findMany).not.toHaveBeenCalled();
  });

  it('rejects duplicated harvest crop for the same farm and harvest', async () => {
    const prisma = {
      farm: {
        count: jest.fn().mockResolvedValue(1)
      },
      harvestCrop: {
        create: jest.fn().mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
            code: 'P2002',
            clientVersion: 'test'
          })
        )
      }
    };
    const service = new HarvestCropsService(prisma as never);

    await expect(service.create('farm-1', { harvest: 'Safra 2024', crop: 'Soja' })).rejects.toThrow(
      'HARVEST_CROP_ALREADY_EXISTS'
    );
  });
});
