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

export function isValidCpf(value: string) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  const calculateDigit = (base: string, factor: number) => {
    const total = base.split('').reduce((sum, digit) => sum + Number(digit) * factor--, 0);
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  return calculateDigit(cpf.slice(0, 9), 10) === Number(cpf[9]) && calculateDigit(cpf.slice(0, 10), 11) === Number(cpf[10]);
}

export function isValidCnpj(value: string) {
  const cnpj = onlyDigits(value);
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  const calculateDigit = (base: string, factors: number[]) => {
    const total = base.split('').reduce((sum, digit, index) => sum + Number(digit) * factors[index], 0);
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const firstDigit = calculateDigit(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const secondDigit = calculateDigit(cnpj.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return firstDigit === Number(cnpj[12]) && secondDigit === Number(cnpj[13]);
}

export function isValidDocument(value: string) {
  const document = onlyDigits(value);
  if (document.length === 11) return isValidCpf(document);
  if (document.length === 14) return isValidCnpj(document);
  return false;
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
  try {
    const parsed = JSON.parse(error) as { code?: string; message?: string | string[] };
    if (parsed.code) return normalizeApiError(parsed.code);
    if (Array.isArray(parsed.message)) return parsed.message.join(' ');
    if (parsed.message) return normalizeApiError(parsed.message);
  } catch {
    // Falls back to known domain-code matching below.
  }

  if (error.includes('DOCUMENT_ALREADY_EXISTS')) return 'Ja existe um produtor cadastrado com este documento.';
  if (error.includes('INVALID_DOCUMENT')) return 'CPF/CNPJ invalido. Confira os digitos verificadores ou use um documento valido para teste.';
  if (error.includes('INVALID_FARM_AREA')) return 'A soma das areas agricultavel e vegetacao nao pode ultrapassar a area total.';
  if (error.includes('PRODUCER_NOT_FOUND')) return 'Produtor nao encontrado.';
  if (error.includes('FARM_NOT_FOUND')) return 'Fazenda nao encontrada.';
  if (error.includes('HARVEST_CROP_ALREADY_EXISTS')) return 'Esta cultura ja esta registrada para a fazenda e safra.';
  if (error.includes('HARVEST_CROP_NOT_FOUND')) return 'Cultura nao encontrada.';
  return 'Nao foi possivel concluir a operacao. Verifique os dados e tente novamente.';
}
