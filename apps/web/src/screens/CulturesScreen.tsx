import { Check, Edit3, Sprout, Trash2, X } from 'lucide-react';
import type { CultureWithContext, HarvestCropDraft } from '../app-types';
import { Actions, DataTable, EmptyState, IconButton, InlineInput, PageContainer, Panel, PanelHeader } from '../components/ui';

export function CulturesScreen(props: {
  cultures: CultureWithContext[];
  cultureDraft: HarvestCropDraft | null;
  savingCultureId: string | null;
  deletingCultureId: string | null;
  onSetCultureDraft: (draft: HarvestCropDraft | null) => void;
  onSaveCulture: () => void;
  onDeleteCulture: (id: string) => void;
}) {
  return (
    <PageContainer>
      <Panel>
        <PanelHeader>
          <div>
            <h2>Culturas cadastradas</h2>
            <span>{props.cultures.length} culturas por safra</span>
          </div>
        </PanelHeader>
        <DataTable>
          <thead>
            <tr>
              <th>Cultura</th>
              <th>Safra</th>
              <th>Fazenda</th>
              <th>Produtor</th>
              <th>Area</th>
              <th aria-label="Acoes" />
            </tr>
          </thead>
          <tbody>
            {props.cultures.map((culture) => {
              const isEditing = props.cultureDraft?.id === culture.id;
              const isSaving = props.savingCultureId === culture.id;

              return (
                <tr key={culture.id}>
                  <td>
                    {isEditing && props.cultureDraft ? (
                      <InlineInput value={props.cultureDraft.crop} onChange={(event) => props.onSetCultureDraft({ ...props.cultureDraft!, crop: event.target.value })} />
                    ) : (
                      culture.crop
                    )}
                  </td>
                  <td>
                    {isEditing && props.cultureDraft ? (
                      <InlineInput value={props.cultureDraft.harvest} onChange={(event) => props.onSetCultureDraft({ ...props.cultureDraft!, harvest: event.target.value })} />
                    ) : (
                      culture.harvest
                    )}
                  </td>
                  <td>{culture.farmName}</td>
                  <td>{culture.producerName}</td>
                  <td>{Number(culture.totalArea).toLocaleString('pt-BR')}ha</td>
                  <td>
                    <Actions>
                      {isEditing ? (
                        <>
                          <IconButton type="button" title="Salvar cultura" disabled={isSaving} onClick={props.onSaveCulture}>
                            <Check size={16} />
                          </IconButton>
                          <IconButton type="button" title="Cancelar edicao" disabled={isSaving} onClick={() => props.onSetCultureDraft(null)}>
                            <X size={16} />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton type="button" title="Editar cultura" onClick={() => props.onSetCultureDraft({ id: culture.id, harvest: culture.harvest, crop: culture.crop })}>
                            <Edit3 size={16} />
                          </IconButton>
                          <IconButton type="button" title="Excluir cultura" disabled={props.deletingCultureId === culture.id} onClick={() => props.onDeleteCulture(culture.id)}>
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
        {props.cultures.length === 0 ? <EmptyState icon={<Sprout size={24} />} title="Nenhuma cultura cadastrada" description="Registre culturas nas fazendas para acompanhar safras." /> : null}
      </Panel>
    </PageContainer>
  );
}
