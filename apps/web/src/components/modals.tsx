import type { ReactNode } from 'react';
import { AlertTriangle, Check, Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import styled from 'styled-components';
import type { DashboardFilters, FarmDraft, HarvestCropDraft, ProducerFormData } from '../app-types';
import { Alert, Field, FormGrid, IconButton, IconHalo, Input, Kicker, ModalActions, ModalBackdrop, ModalCard, ModalHeader, ModalPanel, PrimaryButton, SecondaryButton, Select } from './ui';
import { maskDocument } from '../utils/formatters';

export function ProducerModal(props: {
  data: ProducerFormData;
  error: string | null;
  duplicateProducerName: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (field: keyof ProducerFormData, value: string) => void;
}) {
  return (
    <ModalBackdrop>
      <ModalCard onSubmit={props.onSubmit}>
        <ModalHeader>
          <div>
            <Kicker>Novo produtor</Kicker>
            <h2>Cadastrar produtor</h2>
          </div>
          <IconButton type="button" onClick={props.onClose}>
            <X size={16} />
          </IconButton>
        </ModalHeader>
        {props.error ? <Alert role="alert">{props.error}</Alert> : null}
        {props.duplicateProducerName ? (
          <Alert role="alert">Este documento ja esta cadastrado para {props.duplicateProducerName}.</Alert>
        ) : null}
        <FormGrid>
          <Field label="CPF ou CNPJ" required>
            <Input
              name="document"
              value={props.data.document}
              onChange={(event) => props.onChange('document', maskDocument(event.target.value))}
              placeholder="000.000.000-00"
              inputMode="numeric"
              autoComplete="off"
              maxLength={18}
              required
            />
            <FieldHint>Use um CPF/CNPJ real e valido. Sequencias repetidas, como 222.222.222-22, serao rejeitadas.</FieldHint>
          </Field>
          <Field label="Nome do produtor" required>
            <Input
              name="name"
              value={props.data.name}
              onChange={(event) => props.onChange('name', event.target.value)}
              placeholder="Nome completo"
              autoComplete="name"
              minLength={2}
              required
            />
          </Field>
        </FormGrid>
        <ModalActions>
          <SecondaryButton type="button" onClick={props.onClose}>
            Cancelar
          </SecondaryButton>
          <PrimaryButton disabled={props.isSubmitting || Boolean(props.duplicateProducerName)}>
            {props.isSubmitting ? <Loader2 size={16} /> : <Check size={16} />}
            Salvar
          </PrimaryButton>
        </ModalActions>
      </ModalCard>
    </ModalBackdrop>
  );
}

export function ProducerCreatedModal({ onAddFarm, onSkip }: { onAddFarm: () => void; onSkip: () => void }) {
  return (
    <BasicModal title="Produtor salvo com sucesso" onClose={onSkip}>
      <SuccessPrompt>
        <IconHalo>
          <Check size={22} />
        </IconHalo>
        <strong>Cadastro concluido.</strong>
        <span>Deseja adicionar uma fazenda para este produtor agora?</span>
      </SuccessPrompt>
      <ModalActions>
        <SecondaryButton type="button" onClick={onSkip}>
          Pular
        </SecondaryButton>
        <PrimaryButton type="button" onClick={onAddFarm}>
          <Plus size={16} />
          Adicionar Fazenda
        </PrimaryButton>
      </ModalActions>
    </BasicModal>
  );
}

export function DashboardFilterModal({
  filters,
  stateOptions,
  cropOptions,
  onChange,
  onClose
}: {
  filters: DashboardFilters;
  stateOptions: string[];
  cropOptions: string[];
  onChange: (filters: DashboardFilters) => void;
  onClose: () => void;
}) {
  return (
    <BasicModal title="Filtrar dashboard" onClose={onClose}>
      <FormGrid>
        <Field label="Estado">
          <Select value={filters.state} onChange={(event) => onChange({ ...filters, state: event.target.value })}>
            <option value="">Todos os estados</option>
            {stateOptions.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Cultura">
          <Select value={filters.crop} onChange={(event) => onChange({ ...filters, crop: event.target.value })}>
            <option value="">Todas as culturas</option>
            {cropOptions.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </Select>
        </Field>
      </FormGrid>
      <ModalActions>
        <SecondaryButton type="button" onClick={() => onChange({ state: '', crop: '' })}>
          Limpar filtros
        </SecondaryButton>
        <PrimaryButton type="button" onClick={onClose}>
          Aplicar
        </PrimaryButton>
      </ModalActions>
    </BasicModal>
  );
}

export function FarmModal(props: {
  producers: Array<{ id: string; name: string }>;
  selectedProducerId?: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <BasicModal title="Nova fazenda" onClose={props.onClose} asForm onSubmit={props.onSubmit}>
      <FormGrid>
        <Field label="Produtor" required>
          <Select name="producerId" defaultValue={props.selectedProducerId ?? ''} required>
            <option value="" disabled>
              Selecione
            </option>
            {props.producers.map((producer) => (
              <option key={producer.id} value={producer.id}>
                {producer.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Nome da fazenda" required>
          <Input name="farmName" required />
        </Field>
        <Field label="Cidade" required>
          <Input name="city" required />
        </Field>
        <Field label="UF" required>
          <Input name="state" maxLength={2} required />
        </Field>
        <Field label="Area total" required>
          <Input name="totalArea" type="number" step="0.01" required />
        </Field>
        <Field label="Area agricultavel" required>
          <Input name="arableArea" type="number" step="0.01" required />
        </Field>
        <Field label="Area vegetacao" required>
          <Input name="vegetationArea" type="number" step="0.01" required />
        </Field>
        <Field label="Safra">
          <Input name="harvest" />
        </Field>
        <Field label="Cultura">
          <Input name="crop" />
        </Field>
      </FormGrid>
      <ModalActions>
        <SecondaryButton type="button" onClick={props.onClose}>
          Cancelar
        </SecondaryButton>
        <PrimaryButton disabled={props.isSubmitting || props.producers.length === 0}>
          <Plus size={16} />
          Salvar fazenda
        </PrimaryButton>
      </ModalActions>
    </BasicModal>
  );
}

export function EditFarmModal(props: {
  draft: FarmDraft;
  isSubmitting: boolean;
  onClose: () => void;
  onSave: () => void;
  onChange: (draft: FarmDraft) => void;
}) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    props.onSave();
  }

  return (
    <BasicModal title="Editar fazenda" onClose={props.onClose} asForm onSubmit={handleSubmit}>
      <FormGrid>
        <Field label="Nome da fazenda" required>
          <Input value={props.draft.name} onChange={(event) => props.onChange({ ...props.draft, name: event.target.value })} minLength={2} required />
        </Field>
        <Field label="Cidade" required>
          <Input value={props.draft.city} onChange={(event) => props.onChange({ ...props.draft, city: event.target.value })} minLength={2} required />
        </Field>
        <Field label="UF" required>
          <Input value={props.draft.state} onChange={(event) => props.onChange({ ...props.draft, state: event.target.value.toUpperCase() })} minLength={2} maxLength={2} required />
        </Field>
        <Field label="Area total" required>
          <Input value={props.draft.totalArea} onChange={(event) => props.onChange({ ...props.draft, totalArea: Number(event.target.value) })} type="number" step="0.01" min="0.01" required />
        </Field>
        <Field label="Area agricultavel" required>
          <Input value={props.draft.arableArea} onChange={(event) => props.onChange({ ...props.draft, arableArea: Number(event.target.value) })} type="number" step="0.01" min="0" required />
        </Field>
        <Field label="Area vegetacao" required>
          <Input value={props.draft.vegetationArea} onChange={(event) => props.onChange({ ...props.draft, vegetationArea: Number(event.target.value) })} type="number" step="0.01" min="0" required />
        </Field>
      </FormGrid>
      <ModalActions>
        <SecondaryButton type="button" onClick={props.onClose} disabled={props.isSubmitting}>
          Cancelar
        </SecondaryButton>
        <PrimaryButton disabled={props.isSubmitting}>
          {props.isSubmitting ? <Loader2 size={16} /> : <Save size={16} />}
          Salvar alteracoes
        </PrimaryButton>
      </ModalActions>
    </BasicModal>
  );
}

export function CultureModal(props: {
  farms: Array<{ id: string; name: string; producerName: string }>;
  selectedFarmId?: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <BasicModal title="Nova cultura" onClose={props.onClose} asForm onSubmit={props.onSubmit}>
      <FormGrid>
        <Field label="Fazenda" required>
          <Select name="farmId" defaultValue={props.selectedFarmId ?? ''} required>
            <option value="" disabled>
              Selecione
            </option>
            {props.farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name} - {farm.producerName}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Safra" required>
          <Input name="harvest" placeholder="Safra 2026" required />
        </Field>
        <Field label="Cultura" required>
          <Input name="crop" placeholder="Soja, milho..." required />
        </Field>
      </FormGrid>
      <ModalActions>
        <SecondaryButton type="button" onClick={props.onClose}>
          Cancelar
        </SecondaryButton>
        <PrimaryButton disabled={props.isSubmitting || props.farms.length === 0}>
          <Plus size={16} />
          Salvar cultura
        </PrimaryButton>
      </ModalActions>
    </BasicModal>
  );
}

export function EditCultureModal(props: {
  draft: HarvestCropDraft;
  isSubmitting: boolean;
  onClose: () => void;
  onSave: () => void;
  onChange: (draft: HarvestCropDraft) => void;
}) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    props.onSave();
  }

  return (
    <BasicModal title="Editar cultura" onClose={props.onClose} asForm onSubmit={handleSubmit}>
      <FormGrid>
        <Field label="Safra" required>
          <Input value={props.draft.harvest} onChange={(event) => props.onChange({ ...props.draft, harvest: event.target.value })} placeholder="Safra 2026" minLength={2} required />
        </Field>
        <Field label="Cultura" required>
          <Input value={props.draft.crop} onChange={(event) => props.onChange({ ...props.draft, crop: event.target.value })} placeholder="Soja, milho..." minLength={2} required />
        </Field>
      </FormGrid>
      <ModalActions>
        <SecondaryButton type="button" onClick={props.onClose} disabled={props.isSubmitting}>
          Cancelar
        </SecondaryButton>
        <PrimaryButton disabled={props.isSubmitting}>
          {props.isSubmitting ? <Loader2 size={16} /> : <Save size={16} />}
          Salvar alteracoes
        </PrimaryButton>
      </ModalActions>
    </BasicModal>
  );
}

export function DeleteConfirmModal(props: {
  title: string;
  description: string;
  confirmLabel: string;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <BasicModal title={props.title} onClose={props.onClose}>
      <DeletePrompt>
        <DangerHalo>
          <AlertTriangle size={22} />
        </DangerHalo>
        <p>{props.description}</p>
      </DeletePrompt>
      <ModalActions>
        <SecondaryButton type="button" onClick={props.onClose} disabled={props.isSubmitting}>
          Cancelar
        </SecondaryButton>
        <DangerButton type="button" onClick={props.onConfirm} disabled={props.isSubmitting}>
          {props.isSubmitting ? <Loader2 size={16} /> : <Trash2 size={16} />}
          {props.confirmLabel}
        </DangerButton>
      </ModalActions>
    </BasicModal>
  );
}

function BasicModal({
  title,
  children,
  onClose,
  asForm,
  onSubmit
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  asForm?: boolean;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const content = (
    <>
      <ModalHeader>
        <div>
          <Kicker>Brain Agriculture</Kicker>
          <h2>{title}</h2>
        </div>
        <IconButton type="button" onClick={onClose}>
          <X size={16} />
        </IconButton>
      </ModalHeader>
      {children}
    </>
  );

  return <ModalBackdrop>{asForm ? <ModalCard onSubmit={onSubmit}>{content}</ModalCard> : <ModalPanel>{content}</ModalPanel>}</ModalBackdrop>;
}

const SuccessPrompt = styled.div`
  display: grid;
  place-items: center;
  gap: 8px;
  min-height: 150px;
  text-align: center;

  strong {
    color: #f8fafc;
    font-size: 1.1rem;
  }

  span {
    color: #94a3b8;
  }
`;

const FieldHint = styled.small`
  color: #64748b;
  line-height: 1.35;
`;

const DeletePrompt = styled.div`
  display: grid;
  justify-items: center;
  gap: 14px;
  min-height: 120px;
  text-align: center;

  p {
    max-width: 560px;
    margin: 0;
    color: #cbd5e1;
    line-height: 1.55;
  }
`;

const DangerHalo = styled(IconHalo)`
  color: #fecaca;
  background: rgba(248, 113, 113, 0.14);
`;

const DangerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  border: 1px solid rgba(248, 113, 113, 0.34);
  border-radius: 14px;
  padding: 0 16px;
  color: #fee2e2;
  background: rgba(127, 29, 29, 0.48);
  cursor: pointer;
  font-weight: 800;

  &:hover {
    background: rgba(153, 27, 27, 0.62);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
