import { Edit3, Sprout, Trash2 } from 'lucide-react';
import styled from 'styled-components';
import type { CultureWithContext, HarvestCropDraft } from '../app-types';
import { Actions, DataTable, EmptyState, IconButton, PageContainer, Panel, PanelHeader } from '../components/ui';

export function CulturesScreen(props: {
  cultures: CultureWithContext[];
  savingCultureId: string | null;
  deletingCultureId: string | null;
  onSetCultureDraft: (draft: HarvestCropDraft) => void;
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
        <FilterStrip>
          <StatusBadge>Safra</StatusBadge>
          <StatusBadge>Produtor</StatusBadge>
          <StatusBadge>Cultura</StatusBadge>
        </FilterStrip>
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
            {props.cultures.map((culture) => (
              <tr key={culture.id}>
                <td>{culture.crop}</td>
                <td>{culture.harvest}</td>
                <td>{culture.farmName}</td>
                <td>{culture.producerName}</td>
                <td>{Number(culture.totalArea).toLocaleString('pt-BR')}ha</td>
                <td>
                  <Actions>
                    <IconButton type="button" title="Editar cultura" disabled={props.savingCultureId === culture.id} onClick={() => props.onSetCultureDraft({ id: culture.id, harvest: culture.harvest, crop: culture.crop })}>
                      <Edit3 size={16} />
                    </IconButton>
                    <IconButton type="button" title="Excluir cultura" disabled={props.deletingCultureId === culture.id} onClick={() => props.onDeleteCulture(culture.id)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Actions>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
        {props.cultures.length === 0 ? <EmptyState icon={<Sprout size={24} />} title="Nenhuma cultura cadastrada" description="Registre culturas nas fazendas para acompanhar safras." /> : null}
      </Panel>
    </PageContainer>
  );
}

const FilterStrip = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const StatusBadge = styled.span`
  border: 1px solid rgba(34, 197, 94, 0.18);
  border-radius: 999px;
  padding: 7px 10px;
  color: #86efac;
  background: rgba(34, 197, 94, 0.09);
  font-size: 0.8rem;
`;
