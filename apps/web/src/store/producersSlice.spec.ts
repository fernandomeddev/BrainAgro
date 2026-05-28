import { describe, expect, it } from 'vitest';
import {
  createFarm,
  createHarvestCrop,
  deleteFarm,
  deleteHarvestCrop,
  deleteProducer,
  producersReducer,
  updateFarm,
  updateHarvestCrop,
  updateProducer
} from './producersSlice';

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

  it('adds farm to producer after farm creation succeeds', () => {
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
      createFarm.fulfilled(
        {
          producerId: 'producer-1',
          farm: {
            id: 'farm-1',
            producerId: 'producer-1',
            name: 'Fazenda teste',
            city: 'Sorriso',
            state: 'MT',
            totalArea: 100,
            arableArea: 70,
            vegetationArea: 30,
            harvestCrops: []
          }
        },
        'request-1',
        {
          producerId: 'producer-1',
          farm: {
            name: 'Fazenda teste',
            city: 'Sorriso',
            state: 'MT',
            totalArea: 100,
            arableArea: 70,
            vegetationArea: 30
          }
        }
      )
    );

    expect(state.items[0].farms).toHaveLength(1);
    expect(state.items[0].farms[0].name).toBe('Fazenda teste');
  });

  it('adds harvest crop to farm after creation succeeds', () => {
    const state = producersReducer(
      {
        items: [
          {
            id: 'producer-1',
            document: '12345678909',
            documentType: 'CPF',
            name: 'Produtor teste',
            farms: [
              {
                id: 'farm-1',
                producerId: 'producer-1',
                name: 'Fazenda teste',
                city: 'Sorriso',
                state: 'MT',
                totalArea: 100,
                arableArea: 70,
                vegetationArea: 30,
                harvestCrops: []
              }
            ]
          }
        ],
        total: 1,
        status: 'succeeded',
        error: null
      },
      createHarvestCrop.fulfilled(
        {
          id: 'harvest-crop-1',
          farmId: 'farm-1',
          harvest: 'Safra 2024',
          crop: 'Soja'
        },
        'request-1',
        {
          farmId: 'farm-1',
          harvest: 'Safra 2024',
          crop: 'Soja'
        }
      )
    );

    expect(state.items[0].farms[0].harvestCrops).toHaveLength(1);
    expect(state.items[0].farms[0].harvestCrops[0].crop).toBe('Soja');
  });

  it('removes farm after delete succeeds', () => {
    const state = producersReducer(
      {
        items: [
          {
            id: 'producer-1',
            document: '12345678909',
            documentType: 'CPF',
            name: 'Produtor teste',
            farms: [
              {
                id: 'farm-1',
                producerId: 'producer-1',
                name: 'Fazenda teste',
                city: 'Sorriso',
                state: 'MT',
                totalArea: 100,
                arableArea: 70,
                vegetationArea: 30,
                harvestCrops: []
              }
            ]
          }
        ],
        total: 1,
        status: 'succeeded',
        error: null
      },
      deleteFarm.fulfilled('farm-1', 'request-1', 'farm-1')
    );

    expect(state.items[0].farms).toEqual([]);
  });

  it('updates farm after update succeeds', () => {
    const state = producersReducer(
      {
        items: [
          {
            id: 'producer-1',
            document: '12345678909',
            documentType: 'CPF',
            name: 'Produtor teste',
            farms: [
              {
                id: 'farm-1',
                producerId: 'producer-1',
                name: 'Fazenda teste',
                city: 'Sorriso',
                state: 'MT',
                totalArea: 100,
                arableArea: 70,
                vegetationArea: 30,
                harvestCrops: []
              }
            ]
          }
        ],
        total: 1,
        status: 'succeeded',
        error: null
      },
      updateFarm.fulfilled(
        {
          id: 'farm-1',
          producerId: 'producer-1',
          name: 'Fazenda atualizada',
          city: 'Lucas do Rio Verde',
          state: 'MT',
          totalArea: 120,
          arableArea: 80,
          vegetationArea: 40,
          harvestCrops: []
        },
        'request-1',
        {
          id: 'farm-1',
          name: 'Fazenda atualizada',
          city: 'Lucas do Rio Verde',
          state: 'MT',
          totalArea: 120,
          arableArea: 80,
          vegetationArea: 40
        }
      )
    );

    expect(state.items[0].farms[0].name).toBe('Fazenda atualizada');
    expect(state.items[0].farms[0].totalArea).toBe(120);
  });

  it('updates and removes harvest crop', () => {
    const initialState = {
      items: [
        {
          id: 'producer-1',
          document: '12345678909',
          documentType: 'CPF' as const,
          name: 'Produtor teste',
          farms: [
            {
              id: 'farm-1',
              producerId: 'producer-1',
              name: 'Fazenda teste',
              city: 'Sorriso',
              state: 'MT',
              totalArea: 100,
              arableArea: 70,
              vegetationArea: 30,
              harvestCrops: [
                {
                  id: 'harvest-crop-1',
                  farmId: 'farm-1',
                  harvest: 'Safra 2024',
                  crop: 'Soja'
                }
              ]
            }
          ]
        }
      ],
      total: 1,
      status: 'succeeded' as const,
      error: null
    };

    const updated = producersReducer(
      initialState,
      updateHarvestCrop.fulfilled(
        {
          id: 'harvest-crop-1',
          farmId: 'farm-1',
          harvest: 'Safra 2025',
          crop: 'Milho'
        },
        'request-1',
        {
          id: 'harvest-crop-1',
          harvest: 'Safra 2025',
          crop: 'Milho'
        }
      )
    );

    expect(updated.items[0].farms[0].harvestCrops[0].crop).toBe('Milho');

    const removed = producersReducer(updated, deleteHarvestCrop.fulfilled('harvest-crop-1', 'request-2', 'harvest-crop-1'));

    expect(removed.items[0].farms[0].harvestCrops).toEqual([]);
  });
});
