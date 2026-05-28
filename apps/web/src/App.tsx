import { useEffect, useMemo, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import type { ActiveModal, DashboardFilters, DeleteTarget, FarmDraft, HarvestCropDraft, Page, ProducerDraft, ProducerFormData } from './app-types';
import { emptyProducerFormData } from './app-types';
import { AppHeader, AppSidebar, Main, Shell } from './components/AppLayout';
import { CultureModal, DashboardFilterModal, DeleteConfirmModal, EditCultureModal, EditFarmModal, FarmModal, ProducerCreatedModal, ProducerModal } from './components/modals';
import { fetchDashboard } from './store/dashboardSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  CreateFarmPayload,
  CreateHarvestCropPayload,
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

  const [activePage, setActivePage] = useState<Page>('producers');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [selectedProducerId, setSelectedProducerId] = useState<string | null>(null);
  const [dashboardFilters, setDashboardFilters] = useState<DashboardFilters>({ state: '', crop: '' });
  const [producerSearch, setProducerSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [producerForm, setProducerForm] = useState<ProducerFormData>(emptyProducerFormData);
  const [formError, setFormError] = useState<string | null>(null);
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
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

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

  function openEditFarmModal(draft: FarmDraft) {
    setFarmDraft(draft);
    setActiveModal('editFarm');
  }

  function openEditCultureModal(draft: HarvestCropDraft) {
    setCultureDraft(draft);
    setActiveModal('editCulture');
  }

  function openDeleteModal(target: NonNullable<DeleteTarget>) {
    setDeleteTarget(target);
    setActiveModal('deleteConfirm');
  }

  function closeModal() {
    setActiveModal(null);
    setFarmDraft(null);
    setCultureDraft(null);
    setDeleteTarget(null);
  }

  function showSuccess(message: string) {
    toast.success(message);
  }

  function getErrorMessage(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return normalizeApiError(message);
  }

  function showError(error: unknown) {
    toast.error(getErrorMessage(error));
  }

  async function submitProducer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedDocument = onlyDigits(producerForm.document);
    const producerName = producerForm.name.trim();

    if (![11, 14].includes(normalizedDocument.length) || producerName.length < 2) {
      setFormError('Informe um CPF com 11 digitos ou CNPJ com 14 digitos e um nome com pelo menos 2 caracteres.');
      return;
    }

    const producerWithSameDocument = producers.find((producer) => producer.document === normalizedDocument);
    if (producerWithSameDocument) {
      setFormError(`Este documento ja esta cadastrado para ${producerWithSameDocument.name}.`);
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
      setFormError(getErrorMessage(error));
      showError(error);
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
      showSuccess('Fazenda vinculada com sucesso.');
    } catch (error) {
      showError(error);
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
    setSavingFarmId(farmDraft.id);
    try {
      await dispatch(updateFarm(farmDraft)).unwrap();
      await dispatch(fetchDashboard());
      setFarmDraft(null);
      setActiveModal(null);
      showSuccess('Fazenda atualizada.');
    } catch (error) {
      showError(error);
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
      setActiveModal(null);
      showSuccess('Cultura atualizada.');
    } catch (error) {
      showError(error);
    } finally {
      setSavingCultureId(null);
    }
  }

  async function removeProducer(producerId: string) {
    setDeletingProducerId(producerId);
    try {
      await dispatch(deleteProducer(producerId)).unwrap();
      await Promise.all([dispatch(fetchDashboard()), dispatch(fetchProducers(debouncedSearch))]);
      showSuccess('Produtor excluido.');
      return true;
    } catch (error) {
      showError(error);
      return false;
    } finally {
      setDeletingProducerId(null);
    }
  }

  async function removeFarm(farmId: string) {
    setDeletingFarmId(farmId);
    try {
      await dispatch(deleteFarm(farmId)).unwrap();
      await Promise.all([dispatch(fetchDashboard()), dispatch(fetchProducers(debouncedSearch))]);
      showSuccess('Fazenda excluida.');
      return true;
    } catch (error) {
      showError(error);
      return false;
    } finally {
      setDeletingFarmId(null);
    }
  }

  async function removeCulture(cultureId: string) {
    setDeletingCultureId(cultureId);
    try {
      await dispatch(deleteHarvestCrop(cultureId)).unwrap();
      await Promise.all([dispatch(fetchDashboard()), dispatch(fetchProducers(debouncedSearch))]);
      showSuccess('Cultura excluida.');
      return true;
    } catch (error) {
      showError(error);
      return false;
    } finally {
      setDeletingCultureId(null);
    }
  }

  function refreshAll() {
    void dispatch(fetchDashboard());
    void dispatch(fetchProducers(debouncedSearch));
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    let removed = false;

    if (deleteTarget.type === 'producer') {
      removed = await removeProducer(deleteTarget.id);
    }
    if (deleteTarget.type === 'farm') {
      removed = await removeFarm(deleteTarget.id);
    }
    if (deleteTarget.type === 'culture') {
      removed = await removeCulture(deleteTarget.id);
    }

    if (removed) {
      setActiveModal(null);
      setDeleteTarget(null);
    }
  }

  const isDeletingTarget =
    (deleteTarget?.type === 'producer' && deletingProducerId === deleteTarget.id) ||
    (deleteTarget?.type === 'farm' && deletingFarmId === deleteTarget.id) ||
    (deleteTarget?.type === 'culture' && deletingCultureId === deleteTarget.id);

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

        <ToastContainer
          position="bottom-right"
          autoClose={3200}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnFocusLoss={false}
          pauseOnHover
          theme="dark"
        />

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
            onDeleteProducer={(producerId) => {
              const producer = producers.find((item) => item.id === producerId);
              openDeleteModal({ type: 'producer', id: producerId, name: producer?.name ?? 'este produtor' });
            }}
          />
        ) : null}

        {activePage === 'farms' ? (
          <FarmsScreen
            farms={farms}
            farmDraft={farmDraft}
            savingFarmId={savingFarmId}
            deletingFarmId={deletingFarmId}
            onSetFarmDraft={openEditFarmModal}
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
            onSetCultureDraft={openEditCultureModal}
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
          onClose={closeModal}
          onSubmit={submitProducer}
          onChange={updateProducerForm}
        />
      ) : null}
      {activeModal === 'producerCreated' ? <ProducerCreatedModal onAddFarm={() => setActiveModal('farm')} onSkip={closeModal} /> : null}
      {activeModal === 'farm' ? (
        <FarmModal producers={producers} selectedProducerId={selectedProducer?.id} isSubmitting={isFarmSubmitting} onClose={closeModal} onSubmit={submitFarm} />
      ) : null}
      {activeModal === 'editFarm' && farmDraft ? (
        <EditFarmModal draft={farmDraft} isSubmitting={savingFarmId === farmDraft.id} onClose={closeModal} onSave={saveFarmDraft} onChange={setFarmDraft} />
      ) : null}
      {activeModal === 'culture' ? (
        <CultureModal farms={farms} selectedFarmId={selectedProducer?.farms[0]?.id} isSubmitting={isCultureSubmitting} onClose={closeModal} onSubmit={submitCulture} />
      ) : null}
      {activeModal === 'editCulture' && cultureDraft ? (
        <EditCultureModal draft={cultureDraft} isSubmitting={savingCultureId === cultureDraft.id} onClose={closeModal} onSave={saveCultureDraft} onChange={setCultureDraft} />
      ) : null}
      {activeModal === 'dashboardFilters' ? (
        <DashboardFilterModal filters={dashboardFilters} stateOptions={dashboardStateOptions} cropOptions={dashboardCropOptions} onChange={setDashboardFilters} onClose={closeModal} />
      ) : null}
      {activeModal === 'deleteConfirm' && deleteTarget ? (
        <DeleteConfirmModal
          title={`Excluir ${deleteTarget.type === 'producer' ? 'produtor' : deleteTarget.type === 'farm' ? 'fazenda' : 'cultura'}`}
          description={`Tem certeza que deseja excluir ${deleteTarget.name}? Esta acao atualizara os dados exibidos no dashboard e nas listagens.`}
          confirmLabel="Excluir"
          isSubmitting={Boolean(isDeletingTarget)}
          onClose={closeModal}
          onConfirm={confirmDelete}
        />
      ) : null}
    </Shell>
  );
}
