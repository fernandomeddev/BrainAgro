import type { Farm, HarvestCrop } from './types';

export type Page = 'dashboard' | 'producers' | 'farms' | 'cultures' | 'reports' | 'settings';
export type ActiveModal = 'producer' | 'producerCreated' | 'farm' | 'culture' | 'dashboardFilters' | null;
export type FarmWithProducer = Farm & { producerName: string; producerDocument: string };
export type CultureWithContext = HarvestCrop & { farmName: string; producerName: string; totalArea: number };
export type DashboardFilters = { state: string; crop: string };

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
  email: string;
  phone: string;
  stateRegistration: string;
  birthDate: string;
  zipCode: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  farmName: string;
  totalArea: string;
  arableArea: string;
  vegetationArea: string;
  harvest: string;
  crop: string;
};

export const emptyProducerFormData: ProducerFormData = {
  document: '',
  name: '',
  email: '',
  phone: '',
  stateRegistration: '',
  birthDate: '',
  zipCode: '',
  address: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  farmName: '',
  totalArea: '',
  arableArea: '',
  vegetationArea: '',
  harvest: '',
  crop: ''
};
