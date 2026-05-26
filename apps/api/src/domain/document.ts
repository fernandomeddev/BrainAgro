export type DocumentType = 'CPF' | 'CNPJ';

export function normalizeDocument(document: string): string {
  return document.replace(/\D/g, '');
}

export function getDocumentType(document: string): DocumentType | null {
  const normalized = normalizeDocument(document);
  if (normalized.length === 11) return 'CPF';
  if (normalized.length === 14) return 'CNPJ';
  return null;
}

export function isValidCpf(document: string): boolean {
  const cpf = normalizeDocument(document);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  const calculateDigit = (base: string, factor: number) => {
    const total = base
      .split('')
      .reduce((sum, digit) => sum + Number(digit) * factor--, 0);
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const firstDigit = calculateDigit(cpf.slice(0, 9), 10);
  const secondDigit = calculateDigit(cpf.slice(0, 10), 11);

  return firstDigit === Number(cpf[9]) && secondDigit === Number(cpf[10]);
}

export function isValidCnpj(document: string): boolean {
  const cnpj = normalizeDocument(document);
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  const calculateDigit = (base: string, factors: number[]) => {
    const total = base
      .split('')
      .reduce((sum, digit, index) => sum + Number(digit) * factors[index], 0);
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const firstDigit = calculateDigit(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const secondDigit = calculateDigit(cnpj.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return firstDigit === Number(cnpj[12]) && secondDigit === Number(cnpj[13]);
}

export function validateDocument(document: string): { document: string; documentType: DocumentType } {
  const normalized = normalizeDocument(document);
  const type = getDocumentType(normalized);
  const isValid = type === 'CPF' ? isValidCpf(normalized) : type === 'CNPJ' ? isValidCnpj(normalized) : false;

  if (!type || !isValid) {
    throw new Error('INVALID_DOCUMENT');
  }

  return { document: normalized, documentType: type };
}
