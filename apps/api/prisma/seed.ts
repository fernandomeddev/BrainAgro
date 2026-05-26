import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.harvestCrop.deleteMany();
  await prisma.farm.deleteMany();
  await prisma.producer.deleteMany();

  await prisma.producer.create({
    data: {
      document: '12345678909',
      documentType: 'CPF',
      name: 'Maria Silva',
      farms: {
        create: [
          {
            name: 'Fazenda Boa Esperanca',
            city: 'Sorriso',
            state: 'MT',
            totalArea: 1000,
            arableArea: 700,
            vegetationArea: 300,
            harvestCrops: {
              create: [
                { harvest: 'Safra 2021', crop: 'Soja' },
                { harvest: 'Safra 2021', crop: 'Milho' },
                { harvest: 'Safra 2022', crop: 'Cafe' }
              ]
            }
          }
        ]
      }
    }
  });

  await prisma.producer.create({
    data: {
      document: '11222333000181',
      documentType: 'CNPJ',
      name: 'Agro Vale LTDA',
      farms: {
        create: [
          {
            name: 'Fazenda Rio Claro',
            city: 'Rio Verde',
            state: 'GO',
            totalArea: 650,
            arableArea: 500,
            vegetationArea: 120,
            harvestCrops: {
              create: [{ harvest: 'Safra 2022', crop: 'Soja' }]
            }
          }
        ]
      }
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
