import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiDelete, apiGet, apiPost } from '../api/client';
import { PaginatedProducers, Producer } from '../types';

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

export const fetchProducers = createAsyncThunk('producers/fetch', () =>
  apiGet<PaginatedProducers>('/producers?page=1&pageSize=50')
);

export const createProducer = createAsyncThunk('producers/create', (payload: CreateProducerPayload) =>
  apiPost<Producer, CreateProducerPayload>('/producers', payload)
);

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
