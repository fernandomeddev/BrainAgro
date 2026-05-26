import { describe, expect, it } from 'vitest';
import { deleteProducer, producersReducer, updateProducer } from './producersSlice';

describe('producers reducer', () => {
  it('returns initial state', () => {
    const state = producersReducer(undefined, { type: 'unknown' });

    expect(state.items).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.status).toBe('idle');
  });

  it('removes producer after delete succeeds', () => {
    const state = producersReducer(
      {
        items: [
          {
            id: 'producer-1',
            document: '12345678909',
            documentType: 'CPF',
            name: 'Produtor teste',
            farms: []
          }
        ],
        total: 1,
        status: 'succeeded',
        error: null
      },
      deleteProducer.fulfilled('producer-1', 'request-1', 'producer-1')
    );

    expect(state.items).toEqual([]);
    expect(state.total).toBe(0);
  });

  it('updates producer after update succeeds', () => {
    const state = producersReducer(
      {
        items: [
          {
            id: 'producer-1',
            document: '12345678909',
            documentType: 'CPF',
            name: 'Produtor teste',
            farms: []
          }
        ],
        total: 1,
        status: 'succeeded',
        error: null
      },
      updateProducer.fulfilled(
        {
          id: 'producer-1',
          document: '11222333000181',
          documentType: 'CNPJ',
          name: 'Produtor atualizado',
          farms: []
        },
        'request-1',
        {
          id: 'producer-1',
          document: '11222333000181',
          name: 'Produtor atualizado'
        }
      )
    );

    expect(state.items[0].name).toBe('Produtor atualizado');
    expect(state.items[0].documentType).toBe('CNPJ');
  });
});
