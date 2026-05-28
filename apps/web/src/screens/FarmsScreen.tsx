import { Building2, Check, Edit3, Trash2, X } from 'lucide-react';
import type { FarmDraft, FarmWithProducer } from '../app-types';
import { Actions, DataTable, EmptyState, IconButton, InlineInput, PageContainer, Panel, PanelHeader } from '../components/ui';

export function FarmsScreen(props: {
  farms: FarmWithProducer[];
  farmDraft: FarmDraft | null;
  savingFarmId: string | null;
  deletingFarmId: string | null;
  onSetFarmDraft: (draft: FarmDraft | null) => void;
  onSaveFarm: () => void;
  onDeleteFarm: (id: string) => void;
}) {
  return (
    <PageContainer>
      <Panel>
        <PanelHeader>
          <div>
            <h2>Fazendas cadastradas</h2>
            <span>{props.farms.length} propriedades vinculadas</span>
          </div>
        </PanelHeader>
        <DataTable>
          <thead>
            <tr>
              <th>Fazenda</th>
              <th>Produtor</th>
              <th>Cidade</th>
              <th>UF</th>
              <th>Area total</th>
              <th>Agricultavel</th>
              <th>Vegetacao</th>
              <th aria-label="Acoes" />
            </tr>
          </thead>
          <tbody>
            {props.farms.map((farm) => {
              const isEditing = props.farmDraft?.id === farm.id;
              const isSaving = props.savingFarmId === farm.id;

              return (
                <tr key={farm.id}>
                  <td>
                    {isEditing && props.farmDraft ? (
                      <InlineInput value={props.farmDraft.name} onChange={(event) => props.onSetFarmDraft({ ...props.farmDraft!, name: event.target.value })} />
                    ) : (
                      farm.name
                    )}
                  </td>
                  <td>{farm.producerName}</td>
                  <td>
                    {isEditing && props.farmDraft ? (
                      <InlineInput value={props.farmDraft.city} onChange={(event) => props.onSetFarmDraft({ ...props.farmDraft!, city: event.target.value })} />
                    ) : (
                      farm.city
                    )}
                  </td>
                  <td>
                    {isEditing && props.farmDraft ? (
                      <InlineInput value={props.farmDraft.state} maxLength={2} onChange={(event) => props.onSetFarmDraft({ ...props.farmDraft!, state: event.target.value.toUpperCase() })} />
                    ) : (
                      farm.state
                    )}
                  </td>
                  <td>
                    {isEditing && props.farmDraft ? (
                      <InlineInput type="number" step="0.01" value={props.farmDraft.totalArea} onChange={(event) => props.onSetFarmDraft({ ...props.farmDraft!, totalArea: Number(event.target.value) })} />
                    ) : (
                      `${Number(farm.totalArea).toLocaleString('pt-BR')}ha`
                    )}
                  </td>
                  <td>
                    {isEditing && props.farmDraft ? (
                      <InlineInput type="number" step="0.01" value={props.farmDraft.arableArea} onChange={(event) => props.onSetFarmDraft({ ...props.farmDraft!, arableArea: Number(event.target.value) })} />
                    ) : (
                      `${Number(farm.arableArea).toLocaleString('pt-BR')}ha`
                    )}
                  </td>
                  <td>
                    {isEditing && props.farmDraft ? (
                      <InlineInput type="number" step="0.01" value={props.farmDraft.vegetationArea} onChange={(event) => props.onSetFarmDraft({ ...props.farmDraft!, vegetationArea: Number(event.target.value) })} />
                    ) : (
                      `${Number(farm.vegetationArea).toLocaleString('pt-BR')}ha`
                    )}
                  </td>
                  <td>
                    <Actions>
                      {isEditing ? (
                        <>
                          <IconButton type="button" title="Salvar fazenda" disabled={isSaving} onClick={props.onSaveFarm}>
                            <Check size={16} />
                          </IconButton>
                          <IconButton type="button" title="Cancelar edicao" disabled={isSaving} onClick={() => props.onSetFarmDraft(null)}>
                            <X size={16} />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton type="button" title="Editar fazenda" onClick={() => props.onSetFarmDraft({ id: farm.id, name: farm.name, city: farm.city, state: farm.state, totalArea: Number(farm.totalArea), arableArea: Number(farm.arableArea), vegetationArea: Number(farm.vegetationArea) })}>
                            <Edit3 size={16} />
                          </IconButton>
                          <IconButton type="button" title="Excluir fazenda" disabled={props.deletingFarmId === farm.id} onClick={() => props.onDeleteFarm(farm.id)}>
                            <Trash2 size={16} />
                          </IconButton>
                        </>
                      )}
                    </Actions>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </DataTable>
        {props.farms.length === 0 ? <EmptyState icon={<Building2 size={24} />} title="Nenhuma fazenda cadastrada" description="As propriedades criadas aparecem nesta tela." /> : null}
      </Panel>
    </PageContainer>
  );
}
