export function validateFarmArea(totalArea: number, arableArea: number, vegetationArea: number): void {
  if (totalArea <= 0 || arableArea < 0 || vegetationArea < 0) {
    throw new Error('INVALID_FARM_AREA');
  }

  if (arableArea + vegetationArea > totalArea) {
    throw new Error('INVALID_FARM_AREA');
  }
}
