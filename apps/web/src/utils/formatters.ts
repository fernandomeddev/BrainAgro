export function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

export function maskDocument(value: string) {
  const digits = onlyDigits(value).slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function normalizeApiError(error: string) {
  if (error.includes('DOCUMENT_ALREADY_EXISTS')) return 'Ja existe um produtor cadastrado com este documento.';
  if (error.includes('INVALID_DOCUMENT')) return 'Informe um CPF ou CNPJ valido.';
  if (error.includes('INVALID_FARM_AREA')) return 'A soma das areas agricultavel e vegetacao nao pode ultrapassar a area total.';
  if (error.includes('PRODUCER_NOT_FOUND')) return 'Produtor nao encontrado.';
  if (error.includes('FARM_NOT_FOUND')) return 'Fazenda nao encontrada.';
  if (error.includes('HARVEST_CROP_ALREADY_EXISTS')) return 'Esta cultura ja esta registrada para a fazenda e safra.';
  if (error.includes('HARVEST_CROP_NOT_FOUND')) return 'Cultura nao encontrada.';
  return 'Nao foi possivel concluir a operacao. Verifique os dados e tente novamente.';
}
