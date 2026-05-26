import { isValidCnpj, isValidCpf, normalizeDocument, validateDocument } from './document';

describe('document validation', () => {
  it('normalizes punctuation', () => {
    expect(normalizeDocument('123.456.789-09')).toBe('12345678909');
  });

  it('validates CPF', () => {
    expect(isValidCpf('12345678909')).toBe(true);
    expect(isValidCpf('11111111111')).toBe(false);
  });

  it('validates CNPJ', () => {
    expect(isValidCnpj('11222333000181')).toBe(true);
    expect(isValidCnpj('00000000000000')).toBe(false);
  });

  it('returns normalized document and type', () => {
    expect(validateDocument('123.456.789-09')).toEqual({
      document: '12345678909',
      documentType: 'CPF'
    });
  });
});
