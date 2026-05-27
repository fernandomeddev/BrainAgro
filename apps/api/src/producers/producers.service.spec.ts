import { Prisma } from '@prisma/client';
import { ProducersService } from './producers.service';

describe('producers service', () => {
  it('creates producer without farms', async () => {
    const prisma = {
      producer: {
        create: jest.fn().mockResolvedValue({
          id: 'producer-1',
          document: '12345678909',
          documentType: 'CPF',
          name: 'Produtor teste',
          farms: []
        })
      }
    };
    const service = new ProducersService(prisma as never);

    const producer = await service.create({ document: '123.456.789-09', name: 'Produtor teste' });

    expect(prisma.producer.create).toHaveBeenCalledWith({
      data: {
        document: '12345678909',
        documentType: 'CPF',
        name: 'Produtor teste',
        farms: undefined
      },
      include: { farms: { include: { harvestCrops: true } } }
    });
    expect(producer.farms).toEqual([]);
  });

  it('rejects duplicated document', async () => {
    const prisma = {
      producer: {
        create: jest.fn().mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
            code: 'P2002',
            clientVersion: 'test'
          })
        )
      }
    };
    const service = new ProducersService(prisma as never);

    await expect(service.create({ document: '12345678909', name: 'Produtor teste' })).rejects.toThrow(
      'DOCUMENT_ALREADY_EXISTS'
    );
  });

  it('lists producers with search and ignores deleted rows', async () => {
    const prisma = {
      producer: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0)
      },
      $transaction: jest.fn((operations) => Promise.all(operations))
    };
    const service = new ProducersService(prisma as never);

    await service.list(1, 50, 'Maria 123');

    const expectedWhere = {
      deletedAt: null,
      OR: [{ name: { contains: 'Maria 123', mode: 'insensitive' } }, { document: { contains: '123' } }]
    };
    expect(prisma.producer.findMany).toHaveBeenCalledWith({
      where: expectedWhere,
      include: { farms: { where: { deletedAt: null }, include: { harvestCrops: true } } },
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: 50
    });
    expect(prisma.producer.count).toHaveBeenCalledWith({ where: expectedWhere });
  });
});
