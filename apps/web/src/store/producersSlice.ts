import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiDelete, apiGet, apiPost, apiPut } from '../api/client';
import { Farm, HarvestCrop, PaginatedProducers, Producer } from '../types';

export type CreateProducerPayload = {
  document: string;
  name: string;
  farms?: Array<{
    name: string;
    city: string;
    state: string;
    totalArea: number;
    arableArea: number;
    vegetationArea: number;
    harvestCrops?: Array<{ harvest: string; crop: string }>;
  }>;
};

export type UpdateProducerPayload = {
  id: string;
  document: string;
  name: string;
};

export type CreateFarmPayload = {
  producerId: string;
  farm: {
    name: string;
    city: string;
    state: string;
    totalArea: number;
    arableArea: number;
    vegetationArea: number;
    harvestCrops?: Array<{ harvest: string; crop: string }>;
  };
};

export type UpdateFarmPayload = {
  id: string;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
};

export type CreateHarvestCropPayload = {
  farmId: string;
  harvest: string;
  crop: string;
};

export type UpdateHarvestCropPayload = {
  id: string;
  harvest: string;
  crop: string;
};

type ProducersState = {
  items: Producer[];
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: ProducersState = {
  items: [],
  total: 0,
  status: 'idle',
  error: null
};

export const fetchProducers = createAsyncThunk('producers/fetch', (search?: string) => {
  const params = new URLSearchParams({ page: '1', pageSize: '50' });
  if (search?.trim()) {
    params.set('search', search.trim());
  }

  return apiGet<PaginatedProducers>(`/producers?${params.toString()}`);
});

export const createProducer = createAsyncThunk('producers/create', (payload: CreateProducerPayload) =>
  apiPost<Producer, CreateProducerPayload>('/producers', payload)
);

export const updateProducer = createAsyncThunk('producers/update', ({ id, ...payload }: UpdateProducerPayload) =>
  apiPut<Producer, Omit<UpdateProducerPayload, 'id'>>(`/producers/${id}`, payload)
);

export const createFarm = createAsyncThunk('producers/createFarm', async ({ producerId, farm }: CreateFarmPayload) => {
  const createdFarm = await apiPost<Farm, CreateFarmPayload['farm']>(`/producers/${producerId}/farms`, farm);
  return { producerId, farm: createdFarm };
});

export const updateFarm = createAsyncThunk('producers/updateFarm', ({ id, ...payload }: UpdateFarmPayload) =>
  apiPut<Farm, Omit<UpdateFarmPayload, 'id'>>(`/farms/${id}`, payload)
);

export const createHarvestCrop = createAsyncThunk('producers/createHarvestCrop', (payload: CreateHarvestCropPayload) =>
  apiPost<HarvestCrop, Omit<CreateHarvestCropPayload, 'farmId'>>(`/farms/${payload.farmId}/harvest-crops`, {
    harvest: payload.harvest,
    crop: payload.crop
  })
);

export const updateHarvestCrop = createAsyncThunk(
  'producers/updateHarvestCrop',
  ({ id, ...payload }: UpdateHarvestCropPayload) =>
    apiPut<HarvestCrop, Omit<UpdateHarvestCropPayload, 'id'>>(`/harvest-crops/${id}`, payload)
);

export const deleteHarvestCrop = createAsyncThunk('producers/deleteHarvestCrop', async (harvestCropId: string) => {
  await apiDelete(`/harvest-crops/${harvestCropId}`);
  return harvestCropId;
});

export const deleteFarm = createAsyncThunk('producers/deleteFarm', async (farmId: string) => {
  await apiDelete(`/farms/${farmId}`);
  return farmId;
});

export const deleteProducer = createAsyncThunk('producers/delete', async (producerId: string) => {
  await apiDelete(`/producers/${producerId}`);
  return producerId;
});

const producersSlice = createSlice({
  name: 'producers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchProducers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Erro ao carregar produtores.';
      })
      .addCase(createProducer.pending, (state) => {
        state.error = null;
      })
      .addCase(createProducer.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createProducer.rejected, (state, action) => {
        state.error = action.error.message ?? 'Erro ao cadastrar produtor.';
      })
      .addCase(updateProducer.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProducer.fulfilled, (state, action) => {
        const index = state.items.findIndex((producer) => producer.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProducer.rejected, (state, action) => {
        state.error = action.error.message ?? 'Erro ao atualizar produtor.';
      })
      .addCase(createFarm.pending, (state) => {
        state.error = null;
      })
      .addCase(createFarm.fulfilled, (state, action) => {
        const producer = state.items.find((item) => item.id === action.payload.producerId);
        if (producer) {
          producer.farms.unshift(action.payload.farm);
        }
        state.error = null;
      })
      .addCase(createFarm.rejected, (state, action) => {
        state.error = action.error.message ?? 'Erro ao cadastrar fazenda.';
      })
      .addCase(updateFarm.pending, (state) => {
        state.error = null;
      })
      .addCase(updateFarm.fulfilled, (state, action) => {
        for (const producer of state.items) {
          const index = producer.farms.findIndex((farm) => farm.id === action.payload.id);
          if (index !== -1) {
            producer.farms[index] = action.payload;
            break;
          }
        }
        state.error = null;
      })
      .addCase(updateFarm.rejected, (state, action) => {
        state.error = action.error.message ?? 'Erro ao atualizar fazenda.';
      })
      .addCase(createHarvestCrop.pending, (state) => {
        state.error = null;
      })
      .addCase(createHarvestCrop.fulfilled, (state, action) => {
        for (const producer of state.items) {
          const farm = producer.farms.find((item) => item.id === action.payload.farmId);
          if (farm) {
            farm.harvestCrops.unshift(action.payload);
            break;
          }
        }
        state.error = null;
      })
      .addCase(createHarvestCrop.rejected, (state, action) => {
        state.error = action.error.message ?? 'Erro ao cadastrar cultura.';
      })
      .addCase(updateHarvestCrop.pending, (state) => {
        state.error = null;
      })
      .addCase(updateHarvestCrop.fulfilled, (state, action) => {
        for (const producer of state.items) {
          for (const farm of producer.farms) {
            const index = farm.harvestCrops.findIndex((item) => item.id === action.payload.id);
            if (index !== -1) {
              farm.harvestCrops[index] = action.payload;
              return;
            }
          }
        }
      })
      .addCase(updateHarvestCrop.rejected, (state, action) => {
        state.error = action.error.message ?? 'Erro ao atualizar cultura.';
      })
      .addCase(deleteHarvestCrop.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteHarvestCrop.fulfilled, (state, action) => {
        for (const producer of state.items) {
          for (const farm of producer.farms) {
            farm.harvestCrops = farm.harvestCrops.filter((item) => item.id !== action.payload);
          }
        }
        state.error = null;
      })
      .addCase(deleteHarvestCrop.rejected, (state, action) => {
        state.error = action.error.message ?? 'Erro ao excluir cultura.';
      })
      .addCase(deleteFarm.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteFarm.fulfilled, (state, action) => {
        for (const producer of state.items) {
          producer.farms = producer.farms.filter((farm) => farm.id !== action.payload);
        }
        state.error = null;
      })
      .addCase(deleteFarm.rejected, (state, action) => {
        state.error = action.error.message ?? 'Erro ao excluir fazenda.';
      })
      .addCase(deleteProducer.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteProducer.fulfilled, (state, action) => {
        state.items = state.items.filter((producer) => producer.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
        state.error = null;
      })
      .addCase(deleteProducer.rejected, (state, action) => {
        state.error = action.error.message ?? 'Erro ao excluir produtor.';
      });
  }
});

export const producersReducer = producersSlice.reducer;
