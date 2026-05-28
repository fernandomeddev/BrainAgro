import { Check, ChevronLeft, ChevronRight, Edit3, Factory, Plus, Search, Trash2, X } from 'lucide-react';
import styled from 'styled-components';
import type { ProducerDraft } from '../app-types';
import { Actions, Avatar, Empty, EmptyState, IconButton, IdentityCell, InlineInput, LoadingSkeleton, PageContainer, Panel, PanelHeader, SecondaryButton } from '../components/ui';
import type { Producer } from '../types';
import { getInitials } from '../utils/formatters';

export function ProducersScreen(props: {
  producers: Producer[];
  allProducersCount: number;
  selectedProducer: Producer | null;
  search: string;
  status: string;
  pageIndex: number;
  totalPages: number;
  producerDraft: ProducerDraft | null;
  savingProducerId: string | null;
  deletingProducerId: string | null;
  onSearchChange: (value: string) => void;
  onSelectProducer: (id: string) => void;
  onSetPage: (page: number) => void;
  onAddFarm: () => void;
  onSetProducerDraft: (draft: ProducerDraft | null) => void;
  onSaveProducer: () => void;
  onDeleteProducer: (id: string) => void;
}) {
  return (
    <PageContainer>
      <Panel>
        <PanelHeader>
          <div>
            <h2>Produtores cadastrados</h2>
            <span>{props.allProducersCount} registros na base</span>
          </div>
        </PanelHeader>
        <Toolbar>
          <SearchInput>
            <Search size={16} />
            <input value={props.search} onChange={(event) => props.onSearchChange(event.target.value)} placeholder="Buscar por nome, CPF ou CNPJ" />
          </SearchInput>
        </Toolbar>

        {props.status === 'loading' ? (
          <LoadingSkeleton rows={5} />
        ) : props.producers.length === 0 ? (
          <EmptyState icon={<Factory size={24} />} title="Lista vazia" description="Nenhum produtor encontrado no banco de dados." />
        ) : (
          <ProducerList>
            {props.producers.map((producer) => {
              const totalArea = producer.farms.reduce((sum, farm) => sum + Number(farm.totalArea), 0);
              const isEditing = props.producerDraft?.id === producer.id;
              const isExpanded = props.selectedProducer?.id === producer.id;

              return (
                <ProducerListItem key={producer.id} $expanded={isExpanded}>
                  <ProducerListButton type="button" onClick={() => props.onSelectProducer(producer.id)}>
                    <IdentityCell>
                      <Avatar>{getInitials(producer.name)}</Avatar>
                      <div>
                        {isEditing && props.producerDraft ? (
                          <InlineInput value={props.producerDraft.name} onClick={(event) => event.stopPropagation()} onChange={(event) => props.onSetProducerDraft({ ...props.producerDraft!, name: event.target.value })} />
                        ) : (
                          <strong>{producer.name}</strong>
                        )}
                        <small>
                          {producer.documentType} {producer.document}
                        </small>
                      </div>
                    </IdentityCell>
                    <ProducerMeta>
                      <span>{producer.farms.length} fazendas</span>
                      <span>{totalArea.toLocaleString('pt-BR')}ha</span>
                    </ProducerMeta>
                    <Actions onClick={(event) => event.stopPropagation()}>
                      {isEditing ? (
                        <>
                          <IconButton type="button" title="Salvar" disabled={props.savingProducerId === producer.id} onClick={props.onSaveProducer}>
                            <Check size={16} />
                          </IconButton>
                          <IconButton type="button" title="Cancelar" onClick={() => props.onSetProducerDraft(null)}>
                            <X size={16} />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton type="button" title="Editar produtor" onClick={() => props.onSetProducerDraft({ id: producer.id, name: producer.name, document: producer.document })}>
                            <Edit3 size={16} />
                          </IconButton>
                          <IconButton type="button" title="Excluir produtor" disabled={props.deletingProducerId === producer.id} onClick={() => props.onDeleteProducer(producer.id)}>
                            <Trash2 size={16} />
                          </IconButton>
                        </>
                      )}
                    </Actions>
                  </ProducerListButton>

                  {isExpanded ? (
                    <ExpandedFarms>
                      <ExpandedHeader>
                        <strong>Fazendas vinculadas</strong>
                        <SecondaryButton type="button" onClick={props.onAddFarm}>
                          <Plus size={16} />
                          Adicionar Fazenda
                        </SecondaryButton>
                      </ExpandedHeader>
                      {producer.farms.length === 0 ? (
                        <Empty>Nenhuma fazenda cadastrada para este produtor.</Empty>
                      ) : (
                        producer.farms.map((farm) => (
                          <FarmSummary key={farm.id}>
                            <div>
                              <strong>{farm.name}</strong>
                              <span>
                                {farm.city} / {farm.state}
                              </span>
                            </div>
                            <FarmStats>
                              <span>Total: {Number(farm.totalArea).toLocaleString('pt-BR')}ha</span>
                              <span>Agricultavel: {Number(farm.arableArea).toLocaleString('pt-BR')}ha</span>
                              <span>Vegetacao: {Number(farm.vegetationArea).toLocaleString('pt-BR')}ha</span>
                            </FarmStats>
                            <CultureList>
                              {farm.harvestCrops.length === 0 ? (
                                <Empty>Nenhuma cultura registrada nesta fazenda.</Empty>
                              ) : (
                                farm.harvestCrops.map((culture) => (
                                  <CultureRow key={culture.id}>
                                    <div>
                                      <strong>{culture.crop}</strong>
                                      <span>{culture.harvest}</span>
                                    </div>
                                  </CultureRow>
                                ))
                              )}
                            </CultureList>
                          </FarmSummary>
                        ))
                      )}
                    </ExpandedFarms>
                  ) : null}
                </ProducerListItem>
              );
            })}
          </ProducerList>
        )}

        <Pagination>
          <span>
            Pagina {props.pageIndex} de {props.totalPages}
          </span>
          <div>
            <IconButton type="button" disabled={props.pageIndex === 1} onClick={() => props.onSetPage(Math.max(1, props.pageIndex - 1))}>
              <ChevronLeft size={16} />
            </IconButton>
            <IconButton type="button" disabled={props.pageIndex === props.totalPages} onClick={() => props.onSetPage(Math.min(props.totalPages, props.pageIndex + 1))}>
              <ChevronRight size={16} />
            </IconButton>
          </div>
        </Pagination>
      </Panel>
    </PageContainer>
  );
}

const Toolbar = styled.div`
  margin-bottom: 12px;
`;

const SearchInput = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  border: 1px solid rgba(90, 130, 100, 0.15);
  border-radius: 16px;
  padding: 0 14px;
  color: #64748b;
  background: rgba(8, 17, 13, 0.64);

  input {
    width: 100%;
    border: 0;
    outline: 0;
    color: #f8fafc;
    background: transparent;
  }
`;

const ProducerList = styled.div`
  display: grid;
  gap: 12px;
`;

const ProducerListItem = styled.article<{ $expanded?: boolean }>`
  border: 1px solid ${({ $expanded }) => ($expanded ? 'rgba(34, 197, 94, 0.28)' : 'rgba(90, 130, 100, 0.14)')};
  border-radius: 20px;
  background: ${({ $expanded }) => ($expanded ? 'rgba(34, 197, 94, 0.07)' : 'rgba(8, 17, 13, 0.46)')};
  overflow: hidden;
`;

const ProducerListButton = styled.button`
  display: grid;
  grid-template-columns: minmax(260px, 1fr) auto auto;
  align-items: center;
  gap: 16px;
  width: 100%;
  min-height: 74px;
  border: 0;
  padding: 14px;
  text-align: left;
  color: inherit;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: rgba(34, 197, 94, 0.06);
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
`;

const ProducerMeta = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  flex-wrap: wrap;

  span {
    border: 1px solid rgba(90, 130, 100, 0.14);
    border-radius: 999px;
    padding: 7px 10px;
    color: #cbd5e1;
    background: rgba(16, 26, 22, 0.7);
    white-space: nowrap;
  }
`;

const ExpandedFarms = styled.div`
  display: grid;
  gap: 12px;
  padding: 0 14px 14px 64px;

  @media (max-width: 760px) {
    padding-left: 14px;
  }
`;

const ExpandedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  color: #f8fafc;

  @media (max-width: 620px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FarmSummary = styled.div`
  display: grid;
  gap: 10px;
  border: 1px solid rgba(90, 130, 100, 0.14);
  border-radius: 18px;
  padding: 12px;
  background: rgba(16, 26, 22, 0.58);

  strong {
    color: #f8fafc;
  }

  span {
    color: #94a3b8;
  }
`;

const FarmStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  span {
    border: 1px solid rgba(90, 130, 100, 0.13);
    border-radius: 999px;
    padding: 7px 10px;
    color: #cbd5e1;
    background: rgba(16, 26, 22, 0.7);
  }
`;

const CultureList = styled.div`
  display: grid;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid rgba(90, 130, 100, 0.12);
`;

const CultureRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 50px;
  border-radius: 16px;
  padding: 8px 10px;
  background: rgba(16, 26, 22, 0.62);

  strong {
    display: block;
    color: #f8fafc;
  }

  span {
    color: #64748b;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
  color: #64748b;

  div {
    display: flex;
    gap: 8px;
  }
`;
