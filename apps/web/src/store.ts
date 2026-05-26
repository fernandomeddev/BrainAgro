import { configureStore } from '@reduxjs/toolkit';
import { dashboardReducer } from './store/dashboardSlice';
import { producersReducer } from './store/producersSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    producers: producersReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
