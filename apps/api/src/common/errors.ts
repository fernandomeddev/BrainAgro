import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

export function mapDomainError(error: unknown): never {
  if (!(error instanceof Error)) {
    throw error;
  }

  switch (error.message) {
    case 'INVALID_DOCUMENT':
      throw new BadRequestException({ code: 'INVALID_DOCUMENT', message: 'CPF ou CNPJ invalido.' });
    case 'INVALID_FARM_AREA':
      throw new BadRequestException({
        code: 'INVALID_FARM_AREA',
        message: 'A soma das areas agricultavel e vegetacao nao pode ultrapassar a area total.'
      });
    case 'DOCUMENT_ALREADY_EXISTS':
      throw new ConflictException({ code: 'DOCUMENT_ALREADY_EXISTS', message: 'Documento ja cadastrado.' });
    case 'PRODUCER_NOT_FOUND':
      throw new NotFoundException({ code: 'PRODUCER_NOT_FOUND', message: 'Produtor nao encontrado.' });
    case 'FARM_NOT_FOUND':
      throw new NotFoundException({ code: 'FARM_NOT_FOUND', message: 'Propriedade nao encontrada.' });
    case 'HARVEST_CROP_NOT_FOUND':
      throw new NotFoundException({ code: 'HARVEST_CROP_NOT_FOUND', message: 'Cultura por safra nao encontrada.' });
    case 'HARVEST_CROP_ALREADY_EXISTS':
      throw new ConflictException({
        code: 'HARVEST_CROP_ALREADY_EXISTS',
        message: 'Esta cultura ja esta registrada para a propriedade e safra.'
      });
    default:
      throw error;
  }
}
