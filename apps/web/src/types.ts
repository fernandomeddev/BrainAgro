export type Dashboard = {
  totalFarms: number;
  totalArea: number;
  byState: Array<{ state: string; total: number }>;
  byCrop: Array<{ crop: string; total: number }>;
  byLandUse: {
    arableArea: number;
    vegetationArea: number;
  };
};

export type HarvestCrop = {
  id: string;
  farmId: string;
  harvest: string;
  crop: string;
};

export type Farm = {
  id: string;
  producerId: string;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  harvestCrops: HarvestCrop[];
};

export type Producer = {
  id: string;
  document: string;
  documentType: 'CPF' | 'CNPJ';
  name: string;
  farms: Farm[];
};

export type PaginatedProducers = {
  items: Producer[];
  page: number;
  pageSize: number;
  total: number;
};
