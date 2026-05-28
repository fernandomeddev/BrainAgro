import type { Farm, HarvestCrop } from './types';

export type Page = 'dashboard' | 'producers' | 'farms' | 'cultures' | 'reports' | 'settings';
export type ActiveModal = 'producer' | 'producerCreated' | 'farm' | 'editFarm' | 'culture' | 'editCulture' | 'dashboardFilters' | 'deleteConfirm' | null;
export type FarmWithProducer = Farm & { producerName: string; producerDocument: string };
export type CultureWithContext = HarvestCrop & { farmName: string; producerName: string; totalArea: number };
export type DashboardFilters = { state: string; crop: string };
export type DeleteTarget = { type: 'producer' | 'farm' | 'culture'; id: string; name: string } | null;

export type ProducerDraft = { id: string; name: string; document: string };
export type FarmDraft = {
  id: string;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
};
export type HarvestCropDraft = { id: string; harvest: string; crop: string };

export type ProducerFormData = {
  document: string;
  name: string;
};

export const emptyProducerFormData: ProducerFormData = {
  document: '',
  name: ''
};
