import { describe, expect, it } from 'vitest';
import { producersReducer } from './producersSlice';

describe('producers reducer', () => {
  it('returns initial state', () => {
    const state = producersReducer(undefined, { type: 'unknown' });

    expect(state.items).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.status).toBe('idle');
  });
});
