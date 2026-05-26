-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('CPF', 'CNPJ');

-- CreateTable
CREATE TABLE "Producer" (
    "id" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Producer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farm" (
    "id" TEXT NOT NULL,
    "producerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "totalArea" DECIMAL(12,2) NOT NULL,
    "arableArea" DECIMAL(12,2) NOT NULL,
    "vegetationArea" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Farm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HarvestCrop" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "harvest" TEXT NOT NULL,
    "crop" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HarvestCrop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Producer_document_key" ON "Producer"("document");

-- CreateIndex
CREATE INDEX "Producer_name_idx" ON "Producer"("name");

-- CreateIndex
CREATE INDEX "Farm_producerId_idx" ON "Farm"("producerId");

-- CreateIndex
CREATE INDEX "Farm_state_idx" ON "Farm"("state");

-- CreateIndex
CREATE INDEX "HarvestCrop_crop_idx" ON "HarvestCrop"("crop");

-- CreateIndex
CREATE UNIQUE INDEX "HarvestCrop_farmId_harvest_crop_key" ON "HarvestCrop"("farmId", "harvest", "crop");

-- AddForeignKey
ALTER TABLE "Farm" ADD CONSTRAINT "Farm_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Producer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestCrop" ADD CONSTRAINT "HarvestCrop_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
