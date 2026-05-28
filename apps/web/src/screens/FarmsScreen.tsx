import { Building2, Edit3, Trash2 } from 'lucide-react';
import type { FarmDraft, FarmWithProducer } from '../app-types';
import { Actions, DataTable, EmptyState, IconButton, PageContainer, Panel, PanelHeader } from '../components/ui';

export function FarmsScreen(props: {
  farms: FarmWithProducer[];
  farmDraft: FarmDraft | null;
  savingFarmId: string | null;
  deletingFarmId: string | null;
  onSetFarmDraft: (draft: FarmDraft) => void;
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
            {props.farms.map((farm) => (
              <tr key={farm.id}>
                <td>{farm.name}</td>
                <td>{farm.producerName}</td>
                <td>{farm.city}</td>
                <td>{farm.state}</td>
                <td>{Number(farm.totalArea).toLocaleString('pt-BR')}ha</td>
                <td>{Number(farm.arableArea).toLocaleString('pt-BR')}ha</td>
                <td>{Number(farm.vegetationArea).toLocaleString('pt-BR')}ha</td>
                <td>
                  <Actions>
                    <IconButton type="button" onClick={() => props.onSetFarmDraft({ id: farm.id, name: farm.name, city: farm.city, state: farm.state, totalArea: Number(farm.totalArea), arableArea: Number(farm.arableArea), vegetationArea: Number(farm.vegetationArea) })}>
                      <Edit3 size={16} />
                    </IconButton>
                    <IconButton type="button" disabled={props.deletingFarmId === farm.id} onClick={() => props.onDeleteFarm(farm.id)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Actions>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
        {props.farms.length === 0 ? <EmptyState icon={<Building2 size={24} />} title="Nenhuma fazenda cadastrada" description="As propriedades criadas aparecem nesta tela." /> : null}
      </Panel>
    </PageContainer>
  );
}
