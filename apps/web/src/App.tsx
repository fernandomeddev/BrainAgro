import { useEffect, useMemo, useState } from 'react';
import type { ActiveModal, DashboardFilters, FarmDraft, HarvestCropDraft, Page, ProducerDraft, ProducerFormData } from './app-types';
import { emptyProducerFormData } from './app-types';
import { AppHeader, AppSidebar, Main, Shell } from './components/AppLayout';
import { CultureModal, DashboardFilterModal, FarmModal, ProducerCreatedModal, ProducerModal } from './components/modals';
import { Toast } from './components/ui';
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
import { isValidDocument, normalizeApiError, onlyDigits } from './utils/formatters';

const PAGE_SIZE = 5;
type ToastMessage = { type: 'success' | 'error'; message: string };

export function App() {
  const dispatch = useAppDispatch();
  const dashboardStatus = useAppSelector((state) => state.dashboard.status);
  const producers = useAppSelector((state) => state.producers.items);
  const producersStatus = useAppSelector((state) => state.producers.status);

  const [activePage, setActivePage] = useState<Page>('producers');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [selectedProducerId, setSelectedProducerId] = useState<string | null>(null);
  const [dashboardFilters, setDashboardFilters] = useState<DashboardFilters>({ state: '', crop: '' });
  const [producerSearch, setProducerSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [producerForm, setProducerForm] = useState<ProducerFormData>(emptyProducerFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
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
  const producerDocumentConflict = useMemo(() => {
    const normalizedDocument = onlyDigits(producerForm.document);
    if (![11, 14].includes(normalizedDocument.length)) return null;
    return producers.find((producer) => producer.document === normalizedDocument) ?? null;
  }, [producerForm.document, producers]);
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

  function showSuccess(message: string) {
    setToast({ type: 'success', message });
  }

  function showError(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    setToast({ type: 'error', message: normalizeApiError(message) });
  }

  function showValidationError(message: string) {
    setToast({ type: 'error', message });
  }

  function isValidFarmData(farm: Omit<CreateFarmPayload['farm'], 'harvestCrops'>) {
    return (
      farm.name.length >= 2 &&
      farm.city.length >= 2 &&
      farm.state.length === 2 &&
      farm.totalArea > 0 &&
      farm.arableArea >= 0 &&
      farm.vegetationArea >= 0 &&
      farm.arableArea + farm.vegetationArea <= farm.totalArea
    );
  }

  async function submitProducer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedDocument = onlyDigits(producerForm.document);
    const producerName = producerForm.name.trim();

    if (!isValidDocument(normalizedDocument) || producerName.length < 3) {
      setFormError(null);
      setToast({ type: 'error', message: 'Informe um CPF ou CNPJ valido e um nome com pelo menos 3 caracteres.' });
      return;
    }

    const producerWithSameDocument = producers.find((producer) => producer.document === normalizedDocument);
    if (producerWithSameDocument) {
      setFormError(null);
      setToast({
        type: 'error',
        message: `Este documento ja esta cadastrado para ${producerWithSameDocument.name}.`
      });
      return;
    }

    setSubmitting(true);
    try {
      const producer = await dispatch(createProducer({ document: normalizedDocument, name: producerName })).unwrap();
      await Promise.all([dispatch(fetchDashboard()), dispatch(fetchProducers(debouncedSearch))]);
      setSelectedProducerId(producer.id);
      setActiveModal('producerCreated');
      showSuccess('Produtor cadastrado com sucesso.');
    } catch (error) {
      showError(error);
    } finally {
      setSubmitting(false);
    }
  }

  async function submitFarm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const harvest = String(form.get('harvest') ?? '').trim();
    const crop = String(form.get('crop') ?? '').trim();
    const payload: CreateFarmPayload = {
      producerId: String(form.get('producerId') ?? ''),
      farm: {
        name: String(form.get('farmName') ?? '').trim(),
        city: String(form.get('city') ?? '').trim(),
        state: String(form.get('state') ?? '').trim().toUpperCase(),
        totalArea: Number(form.get('totalArea')),
        arableArea: Number(form.get('arableArea')),
        vegetationArea: Number(form.get('vegetationArea')),
        harvestCrops: harvest && crop ? [{ harvest, crop }] : undefined
      }
    };

    if (!payload.producerId) {
      showValidationError('Selecione um produtor para vincular a fazenda.');
      return;
    }

    if (!isValidFarmData(payload.farm)) {
      showValidationError('Revise os dados da fazenda. A area total deve ser maior que zero e agricultavel + vegetacao nao pode ultrapassar a area total.');
      return;
    }

    if ((harvest && !crop) || (!harvest && crop)) {
      showValidationError('Informe safra e cultura juntas ou deixe os dois campos vazios.');
      return;
    }

    setFarmSubmitting(true);
    try {
      await dispatch(createFarm(payload)).unwrap();
      await Promise.all([dispatch(fetchDashboard()), dispatch(fetchProducers(debouncedSearch))]);
      setSelectedProducerId(payload.producerId);
      setActiveModal(null);
      showSuccess('Fazenda vinculada com sucesso.');
    } catch (error) {
      showError(error);
    } finally {
      setFarmSubmitting(false);
    }
  }

  async function submitCulture(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload: CreateHarvestCropPayload = {
      farmId: String(form.get('farmId') ?? ''),
      harvest: String(form.get('harvest') ?? '').trim(),
      crop: String(form.get('crop') ?? '').trim()
    };

    if (!payload.farmId || payload.harvest.length < 2 || payload.crop.length < 2) {
      showValidationError('Selecione uma fazenda e informe safra e cultura com pelo menos 2 caracteres.');
      return;
    }

    const alreadyExists = cultures.some(
      (culture) =>
        culture.farmId === payload.farmId &&
        culture.harvest.trim().toLowerCase() === payload.harvest.toLowerCase() &&
        culture.crop.trim().toLowerCase() === payload.crop.toLowerCase()
    );
    if (alreadyExists) {
      showValidationError('Esta cultura ja esta registrada para a fazenda e safra selecionadas.');
      return;
    }

    setCultureSubmitting(true);
    try {
      await dispatch(createHarvestCrop(payload)).unwrap();
      await Promise.all([dispatch(fetchDashboard()), dispatch(fetchProducers(debouncedSearch))]);
      setActiveModal(null);
      showSuccess('Cultura registrada com sucesso.');
    } catch (error) {
      showError(error);
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
      showSuccess('Produtor atualizado.');
    } catch (error) {
      showError(error);
    } finally {
      setSavingProducerId(null);
    }
  }

  async function saveFarmDraft() {
    if (!farmDraft) return;
    const normalizedDraft: FarmDraft = {
      ...farmDraft,
      name: farmDraft.name.trim(),
      city: farmDraft.city.trim(),
      state: farmDraft.state.trim().toUpperCase()
    };

    if (!isValidFarmData(normalizedDraft)) {
      showValidationError('Revise os dados da fazenda. A area total deve ser maior que zero e agricultavel + vegetacao nao pode ultrapassar a area total.');
      return;
    }

    setSavingFarmId(farmDraft.id);
    try {
      await dispatch(updateFarm(normalizedDraft)).unwrap();
      await dispatch(fetchDashboard());
      setFarmDraft(null);
      showSuccess('Fazenda atualizada.');
    } catch (error) {
      showError(error);
    } finally {
      setSavingFarmId(null);
    }
  }

  async function saveCultureDraft() {
    if (!cultureDraft) return;
    const normalizedDraft: HarvestCropDraft = {
      ...cultureDraft,
      harvest: cultureDraft.harvest.trim(),
      crop: cultureDraft.crop.trim()
    };

    if (normalizedDraft.harvest.length < 2 || normalizedDraft.crop.length < 2) {
      showValidationError('Informe safra e cultura com pelo menos 2 caracteres.');
      return;
    }

    const originalCulture = cultures.find((culture) => culture.id === normalizedDraft.id);
    const alreadyExists = Boolean(
      originalCulture &&
        cultures.some(
          (culture) =>
            culture.id !== normalizedDraft.id &&
            culture.farmId === originalCulture.farmId &&
            culture.harvest.trim().toLowerCase() === normalizedDraft.harvest.toLowerCase() &&
            culture.crop.trim().toLowerCase() === normalizedDraft.crop.toLowerCase()
        )
    );
    if (alreadyExists) {
      showValidationError('Esta cultura ja esta registrada para a mesma fazenda e safra.');
      return;
    }

    setSavingCultureId(cultureDraft.id);
    try {
      await dispatch(updateHarvestCrop(normalizedDraft)).unwrap();
      await dispatch(fetchDashboard());
      setCultureDraft(null);
      showSuccess('Cultura atualizada.');
    } catch (error) {
      showError(error);
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
      showSuccess('Produtor excluido.');
    } catch (error) {
      showError(error);
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
      showSuccess('Fazenda excluida.');
    } catch (error) {
      showError(error);
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
      showSuccess('Cultura excluida.');
    } catch (error) {
      showError(error);
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

        {toast ? (
          <Toast role={toast.type === 'error' ? 'alert' : 'status'} $type={toast.type}>
            {toast.message}
          </Toast>
        ) : null}

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
        <ProducerModal
          data={producerForm}
          error={formError}
          duplicateProducerName={producerDocumentConflict?.name ?? null}
          isSubmitting={isSubmitting}
          onClose={() => setActiveModal(null)}
          onSubmit={submitProducer}
          onChange={updateProducerForm}
        />
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
