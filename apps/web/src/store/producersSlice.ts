import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiGet, apiPost } from '../api/client';
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

const producersSlice = createSlice({
  name: 'producers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchProducers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Erro ao carregar produtores.';
      })
      .addCase(createProducer.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.total += 1;
      });
  }
});

export const producersReducer = producersSlice.reducer;
