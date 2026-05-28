import type { ReactNode } from 'react';
import { Check, Loader2, Plus, X } from 'lucide-react';
import styled from 'styled-components';
import type { DashboardFilters, ProducerFormData } from '../app-types';
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
          <Input name="farmName" minLength={2} required />
        </Field>
        <Field label="Cidade" required>
          <Input name="city" minLength={2} required />
        </Field>
        <Field label="UF" required>
          <Input name="state" minLength={2} maxLength={2} autoCapitalize="characters" required />
        </Field>
        <Field label="Area total" required>
          <Input name="totalArea" type="number" step="0.01" min="0.01" required />
        </Field>
        <Field label="Area agricultavel" required>
          <Input name="arableArea" type="number" step="0.01" min="0" required />
        </Field>
        <Field label="Area vegetacao" required>
          <Input name="vegetationArea" type="number" step="0.01" min="0" required />
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
          <Input name="harvest" placeholder="Safra 2026" minLength={2} required />
        </Field>
        <Field label="Cultura" required>
          <Input name="crop" placeholder="Soja, milho..." minLength={2} required />
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
