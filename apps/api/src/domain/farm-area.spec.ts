import { validateFarmArea } from './farm-area';

describe('farm area validation', () => {
  it('accepts valid areas', () => {
    expect(() => validateFarmArea(100, 60, 40)).not.toThrow();
  });

  it('rejects invalid sum', () => {
    expect(() => validateFarmArea(100, 70, 40)).toThrow('INVALID_FARM_AREA');
  });

  it('rejects negative values', () => {
    expect(() => validateFarmArea(100, -1, 40)).toThrow('INVALID_FARM_AREA');
  });
});
