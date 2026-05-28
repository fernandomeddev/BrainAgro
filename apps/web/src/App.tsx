import { useEffect, useMemo, useState } from 'react';
import type { ActiveModal, DashboardFilters, FarmDraft, HarvestCropDraft, Page, ProducerDraft, ProducerFormData } from './app-types';
import { emptyProducerFormData } from './app-types';
import { AppHeader, AppSidebar, Main, Shell } from './components/AppLayout';
import { CultureModal, DashboardFilterModal, FarmModal, ProducerCreatedModal, ProducerModal } from './components/modals';
import { Alert, Toast } from './components/ui';
import { fetchDashboard } from './store/dashboardSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  CreateFarmPayload,
  CreateHarvestCropPayload,
  CreateProducerPayload,
  createFarm,
  createHarvestCrop,
  createProducer,
  deleteFarm,
  deleteHarvestCrop,
  deleteProducer,
  fetchProducers,
  updateFarm,
  updateHarvestCrop,
  updateProducer
} from './store/producersSlice';
import { CulturesScreen } from './screens/CulturesScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { FarmsScreen } from './screens/FarmsScreen';
import { PlaceholderScreen } from './screens/PlaceholderScreen';
import { ProducersScreen } from './screens/ProducersScreen';
import { normalizeApiError, onlyDigits } from './utils/formatters';

const PAGE_SIZE = 5;

export function App() {
  const dispatch = useAppDispatch();
  const dashboardStatus = useAppSelector((state) => state.dashboard.status);
  const producers = useAppSelector((state) => state.producers.items);
  const producersStatus = useAppSelector((state) => state.producers.status);
  const producersError = useAppSelector((state) => state.producers.error);

  const [activePage, setActivePage] = useState<Page>('producers');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [selectedProducerId, setSelectedProducerId] = useState<string | null>(null);
  const [dashboardFilters, setDashboardFilters] = useState<DashboardFilters>({ state: '', crop: '' });
  const [producerSearch, setProducerSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [producerForm, setProducerForm] = useState<ProducerFormData>(emptyProducerFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isFarmSubmitting, setFarmSubmitting] = useState(false);
  const [isCultureSubmitting, setCultureSubmitting] = useState(false);
  const [deletingProducerId, setDeletingProducerId] = useState<string | null>(null);
  const [deletingFarmId, setDeletingFarmId] = useState<string | null>(null);
  const [deletingCultureId, setDeletingCultureId] = useState<string | null>(null);
  const [savingProducerId, setSavingProducerId] = useState<string | null>(null);
  const [savingFarmId, setSavingFarmId] = useState<string | null>(null);
  const [savingCultureId, setSavingCultureId] = useState<string | null>(null);
  const [producerDraft, setProducerDraft] = useState<ProducerDraft | null>(null);
  const [farmDraft, setFarmDraft] = useState<FarmDraft | null>(null);
  const [cultureDraft, setCultureDraft] = useState<HarvestCropDraft | null>(null);

  useEffect(() => {
    void dispatch(fetchDashboard());
    void dispatch(fetchProducers());
  }, [dispatch]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(producerSearch), 350);
    return () => window.clearTimeout(timer);
  }, [producerSearch]);

  useEffect(() => {
    void dispatch(fetchProducers(debouncedSearch));
    setPageIndex(1);
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    if (selectedProducerId && !producers.some((producer) => producer.id === selectedProducerId)) {
      setSelectedProducerId(null);
    }
  }, [producers, selectedProducerId]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const farms = useMemo(
    () =>
      producers.flatMap((producer) =>
        producer.farms.map((farm) => ({
          ...farm,
          producerName: producer.name,
          producerDocument: producer.document
        }))
      ),
    [producers]
  );

  const cultures = useMemo(
    () =>
      farms.flatMap((farm) =>
        farm.harvestCrops.map((culture) => ({
          ...culture,
          farmName: farm.name,
          producerName: farm.producerName,
          totalArea: farm.totalArea
        }))
      ),
    [farms]
  );

  const selectedProducer = useMemo(
    () => producers.find((producer) => producer.id === selectedProducerId) ?? null,
    [producers, selectedProducerId]
  );
  const totalPages = Math.max(1, Math.ceil(producers.length / PAGE_SIZE));
  const paginatedProducers = producers.slice((pageIndex - 1) * PAGE_SIZE, pageIndex * PAGE_SIZE);
  const dashboardStateOptions = useMemo(() => Array.from(new Set(farms.map((farm) => farm.state))).sort(), [farms]);
  const dashboardCropOptions = useMemo(() => Array.from(new Set(cultures.map((culture) => culture.crop))).sort(), [cultures]);
  const dashboardView = useMemo(() => {
    const filteredProducers = producers
      .map((producer) => ({
        ...producer,
        farms: producer.farms.filter((farm) => {
          const matchesState = !dashboardFilters.state || farm.state === dashboardFilters.state;
          const matchesCrop = !dashboardFilters.crop || farm.harvestCrops.some((culture) => culture.crop === dashboardFilters.crop);
          return matchesState && matchesCrop;
        })
      }))
      .filter((producer) => producer.farms.length > 0 || (!dashboardFilters.state && !dashboardFilters.crop));

    const filteredFarms = filteredProducers.flatMap((producer) => producer.farms);
    const filteredCultures = filteredFarms.flatMap((farm) =>
      farm.harvestCrops.filter((culture) => !dashboardFilters.crop || culture.crop === dashboardFilters.crop)
    );
    const byState = Array.from(
      filteredFarms.reduce((acc, farm) => acc.set(farm.state, (acc.get(farm.state) ?? 0) + 1), new Map<string, number>())
    ).map(([name, value]) => ({ name, value }));
    const byCrop = Array.from(
      filteredCultures.reduce((acc, culture) => acc.set(culture.crop, (acc.get(culture.crop) ?? 0) + 1), new Map<string, number>())
    ).map(([name, value]) => ({ name, value }));
    const arableArea = filteredFarms.reduce((sum, farm) => sum + Number(farm.arableArea), 0);
    const vegetationArea = filteredFarms.reduce((sum, farm) => sum + Number(farm.vegetationArea), 0);

    return {
      producersCount: filteredProducers.length,
      farmsCount: filteredFarms.length,
      culturesCount: filteredCultures.length,
      totalArea: filteredFarms.reduce((sum, farm) => sum + Number(farm.totalArea), 0),
      landUseData: [
        { name: 'Agricultavel', value: arableArea },
        { name: 'Vegetacao', value: vegetationArea }
      ],
      byState,
      byCrop
    };
  }, [dashboardFilters, producers]);

  function updateProducerForm(field: keyof ProducerFormData, value: string) {
    setProducerForm((current) => ({ ...current, [field]: value }));
    setFormError(null);
  }

  function openProducerModal() {
    setProducerForm(emptyProducerFormData);
    setFormError(null);
    setActiveModal('producer');
  }

  async function submitProducer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (onlyDigits(producerForm.document).length < 11 || producerForm.name.trim().length < 3) {
      setFormError('Informe um CPF/CNPJ e um nome valido para salvar.');
      return;
    }

    setSubmitting(true);
    try {
      const producer = await dispatch(
        createProducer({ document: onlyDigits(producerForm.document), name: producerForm.name.trim() })
      ).unwrap();
      await Promise.all([dispatch(fetchDashboard()), dispatch(fetchProducers(debouncedSearch))]);
      setSelectedProducerId(producer.id);
      setActiveModal('producerCreated');
      setToast('Produtor cadastrado com sucesso.');
    } finally {
      setSubmitting(false);
    }
  }

  async function submitFarm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFarmSubmitting(true);
    const form = new FormData(event.currentTarget);
    const payload: CreateFarmPayload = {
      producerId: String(form.get('producerId')),
      farm: {
        name: String(form.get('farmName')),
        city: String(form.get('city')),
        state: String(form.get('state')).toUpperCase(),
        totalArea: Number(form.get('totalArea')),
        arableArea: Number(form.get('arableArea')),
        vegetationArea: Number(form.get('vegetationArea')),
        harvestCrops: [{ harvest: String(form.get('harvest')), crop: String(form.get('crop')) }].filter((item) => item.harvest && item.crop)
      }
    };

    try {
      await dispatch(createFarm(payload)).unwrap();
      await Promise.all([dispatch(fetchDashboard()), dispatch(fetchProducers(debouncedSearch))]);
      setSelectedProducerId(payload.producerId);
      setActiveModal(null);
      setToast('Fazenda vinculada com sucesso.');
    } finally {
      setFarmSubmitting(false);
    }
  }

  async function submitCulture(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCultureSubmitting(true);
    const form = new FormData(event.currentTarget);
    const payload: CreateHarvestCropPayload = {
      farmId: String(form.get('farmId')),
      harvest: String(form.get('harvest')),
      crop: String(form.get('crop'))
    };

    try {
      await dispatch(createHarvestCrop(payload)).unwrap();
      await Promise.all([dispatch(fetchDashboard()), dispatch(fetchProducers(debouncedSearch))]);
      setActiveModal(null);
      setToast('Cultura registrada com sucesso.');
    } finally {
      setCultureSubmitting(false);
    }
  }

  async function saveProducerDraft() {
    if (!producerDraft) return;
    setSavingProducerId(producerDraft.id);
    try {
      await dispatch(updateProducer(producerDraft)).unwrap();
      setProducerDraft(null);
      setToast('Produtor atualizado.');
    } finally {
      setSavingProducerId(null);
    }
  }

  async function saveFarmDraft() {
    if (!farmDraft) return;
    setSavingFarmId(farmDraft.id);
    try {
      await dispatch(updateFarm(farmDraft)).unwrap();
      await dispatch(fetchDashboard());
      setFarmDraft(null);
      setToast('Fazenda atualizada.');
    } finally {
      setSavingFarmId(null);
    }
  }

  async function saveCultureDraft() {
    if (!cultureDraft) return;
    setSavingCultureId(cultureDraft.id);
    try {
      await dispatch(updateHarvestCrop(cultureDraft)).unwrap();
      await dispatch(fetchDashboard());
      setCultureDraft(null);
      setToast('Cultura atualizada.');
    } finally {
      setSavingCultureId(null);
    }
  }

  async function removeProducer(producerId: string) {
    if (!window.confirm('Excluir este produtor e inativar suas fazendas?')) return;
    setDeletingProducerId(producerId);
    try {
      await dispatch(deleteProducer(producerId)).unwrap();
      await Promise.all([dispatch(fetchDashboard()), dispatch(fetchProducers(debouncedSearch))]);
      setToast('Produtor excluido.');
    } finally {
      setDeletingProducerId(null);
    }
  }

  async function removeFarm(farmId: string) {
    if (!window.confirm('Excluir esta fazenda?')) return;
    setDeletingFarmId(farmId);
    try {
      await dispatch(deleteFarm(farmId)).unwrap();
      await Promise.all([dispatch(fetchDashboard()), dispatch(fetchProducers(debouncedSearch))]);
      setToast('Fazenda excluida.');
    } finally {
      setDeletingFarmId(null);
    }
  }

  async function removeCulture(cultureId: string) {
    if (!window.confirm('Excluir esta cultura?')) return;
    setDeletingCultureId(cultureId);
    try {
      await dispatch(deleteHarvestCrop(cultureId)).unwrap();
      await Promise.all([dispatch(fetchDashboard()), dispatch(fetchProducers(debouncedSearch))]);
      setToast('Cultura excluida.');
    } finally {
      setDeletingCultureId(null);
    }
  }

  function refreshAll() {
    void dispatch(fetchDashboard());
    void dispatch(fetchProducers(debouncedSearch));
  }

  return (
    <Shell>
      <AppSidebar activePage={activePage} onNavigate={setActivePage} />
      <Main>
        <AppHeader
          activePage={activePage}
          onRefresh={refreshAll}
          onAddProducer={openProducerModal}
          onAddFarm={() => setActiveModal('farm')}
          onAddCulture={() => setActiveModal('culture')}
        />

        {toast ? <Toast role="status">{toast}</Toast> : null}
        {producersError ? <Alert role="alert">{normalizeApiError(producersError)}</Alert> : null}

        {activePage === 'dashboard' ? (
          <DashboardScreen view={dashboardView} filters={dashboardFilters} onOpenFilters={() => setActiveModal('dashboardFilters')} status={dashboardStatus} />
        ) : null}

        {activePage === 'producers' ? (
          <ProducersScreen
            producers={paginatedProducers}
            allProducersCount={producers.length}
            selectedProducer={selectedProducer}
            search={producerSearch}
            status={producersStatus}
            pageIndex={pageIndex}
            totalPages={totalPages}
            producerDraft={producerDraft}
            savingProducerId={savingProducerId}
            deletingProducerId={deletingProducerId}
            onSearchChange={setProducerSearch}
            onSelectProducer={(producerId) => setSelectedProducerId((current) => (current === producerId ? null : producerId))}
            onSetPage={setPageIndex}
            onAddFarm={() => setActiveModal('farm')}
            onSetProducerDraft={setProducerDraft}
            onSaveProducer={saveProducerDraft}
            onDeleteProducer={removeProducer}
          />
        ) : null}

        {activePage === 'farms' ? (
          <FarmsScreen
            farms={farms}
            farmDraft={farmDraft}
            savingFarmId={savingFarmId}
            deletingFarmId={deletingFarmId}
            onSetFarmDraft={setFarmDraft}
            onSaveFarm={saveFarmDraft}
            onDeleteFarm={removeFarm}
          />
        ) : null}

        {activePage === 'cultures' ? (
          <CulturesScreen
            cultures={cultures}
            cultureDraft={cultureDraft}
            savingCultureId={savingCultureId}
            deletingCultureId={deletingCultureId}
            onSetCultureDraft={setCultureDraft}
            onSaveCulture={saveCultureDraft}
            onDeleteCulture={removeCulture}
          />
        ) : null}

        {activePage === 'reports' || activePage === 'settings' ? <PlaceholderScreen page={activePage} /> : null}
      </Main>

      {activeModal === 'producer' ? (
        <ProducerModal data={producerForm} error={formError} isSubmitting={isSubmitting} onClose={() => setActiveModal(null)} onSubmit={submitProducer} onChange={updateProducerForm} />
      ) : null}
      {activeModal === 'producerCreated' ? <ProducerCreatedModal onAddFarm={() => setActiveModal('farm')} onSkip={() => setActiveModal(null)} /> : null}
      {activeModal === 'farm' ? (
        <FarmModal producers={producers} selectedProducerId={selectedProducer?.id} isSubmitting={isFarmSubmitting} onClose={() => setActiveModal(null)} onSubmit={submitFarm} />
      ) : null}
      {activeModal === 'culture' ? (
        <CultureModal farms={farms} selectedFarmId={selectedProducer?.farms[0]?.id} isSubmitting={isCultureSubmitting} onClose={() => setActiveModal(null)} onSubmit={submitCulture} />
      ) : null}
      {activeModal === 'dashboardFilters' ? (
        <DashboardFilterModal filters={dashboardFilters} stateOptions={dashboardStateOptions} cropOptions={dashboardCropOptions} onChange={setDashboardFilters} onClose={() => setActiveModal(null)} />
      ) : null}
    </Shell>
  );
}
