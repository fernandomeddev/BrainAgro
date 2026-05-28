import { BarChart3, Filter, Leaf, MapPinned, Sprout, UserRound } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import styled from 'styled-components';
import type { DashboardFilters } from '../app-types';
import { Alert, EmptyState, Panel, PanelHeader, PageContainer, SecondaryButton, StatsCard } from '../components/ui';

const CHART_COLORS = ['#22C55E', '#38BDF8', '#F59E0B', '#A78BFA', '#F97316'];

type DashboardView = {
  producersCount: number;
  farmsCount: number;
  culturesCount: number;
  totalArea: number;
  landUseData: Array<{ name: string; value: number }>;
  byState: Array<{ name: string; value: number }>;
  byCrop: Array<{ name: string; value: number }>;
};

export function DashboardScreen({
  view,
  filters,
  onOpenFilters,
  status
}: {
  view: DashboardView;
  filters: DashboardFilters;
  onOpenFilters: () => void;
  status: string;
}) {
  const hasFilters = Boolean(filters.state || filters.crop);

  return (
    <PageContainer>
      <DashboardToolbar>
        <div>
          <h2>Indicadores consolidados</h2>
          <span>{hasFilters ? `Filtros ativos${filters.state ? `: UF ${filters.state}` : ''}${filters.crop ? ` / ${filters.crop}` : ''}` : 'Sem filtros aplicados'}</span>
        </div>
        <SecondaryButton type="button" onClick={onOpenFilters}>
          <Filter size={16} />
          Filtros
        </SecondaryButton>
      </DashboardToolbar>

      <StatsGrid>
        <StatsCard icon={<UserRound size={20} />} label="Produtores" value={view.producersCount.toString()} />
        <StatsCard icon={<MapPinned size={20} />} label="Fazendas" value={view.farmsCount.toString()} />
        <StatsCard icon={<Sprout size={20} />} label="Culturas" value={view.culturesCount.toString()} />
        <StatsCard icon={<Leaf size={20} />} label="Area registrada" value={`${view.totalArea.toLocaleString('pt-BR')}ha`} />
      </StatsGrid>

      <DashboardGrid>
        <PiePanel title="Uso do solo" subtitle="Area agricultavel e vegetacao" data={view.landUseData} emptyText="Nenhuma area cadastrada." />
        <PiePanel title="Fazendas por estado" subtitle="Quantidade de fazendas por UF" data={view.byState} emptyText="Nenhuma fazenda para os filtros." />
        <PiePanel title="Culturas por safra" subtitle="Culturas registradas nas fazendas" data={view.byCrop} emptyText="Nenhuma cultura para os filtros." />
      </DashboardGrid>
      {status === 'failed' ? <Alert role="alert">Nao foi possivel atualizar os indicadores do dashboard.</Alert> : null}
    </PageContainer>
  );
}

function PiePanel({ title, subtitle, data, emptyText }: { title: string; subtitle: string; data: Array<{ name: string; value: number }>; emptyText: string }) {
  const visibleData = data.filter((item) => Number(item.value) > 0);

  return (
    <Panel>
      <PanelHeader>
        <div>
          <h2>{title}</h2>
          <span>{subtitle}</span>
        </div>
      </PanelHeader>
      {visibleData.length === 0 ? (
        <EmptyState icon={<BarChart3 size={24} />} title="Sem dados" description={emptyText} />
      ) : (
        <>
          <ChartSlot>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie dataKey="value" data={visibleData} innerRadius={58} outerRadius={96} paddingAngle={4}>
                  {visibleData.map((_, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#101A16', border: '1px solid rgba(90,130,100,.2)', color: '#F8FAFC' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartSlot>
          <ChartLegend>
            {visibleData.map((item, index) => (
              <LegendItem key={item.name}>
                <span style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                <strong>{item.name}</strong>
                <em>{item.value.toLocaleString('pt-BR')}</em>
              </LegendItem>
            ))}
          </ChartLegend>
        </>
      )}
    </Panel>
  );
}

const DashboardToolbar = styled(Panel)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;

  h2 {
    margin: 0 0 4px;
    color: #f8fafc;
  }

  span {
    color: #94a3b8;
  }

  @media (max-width: 680px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.9fr 0.9fr;
  gap: 14px;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

const ChartSlot = styled.div`
  height: 260px;
`;

const ChartLegend = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 10px;
`;

const LegendItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 9px;
  min-height: 34px;
  color: #cbd5e1;

  span {
    width: 10px;
    height: 10px;
    border-radius: 999px;
  }

  strong {
    font-weight: 650;
  }

  em {
    color: #94a3b8;
    font-style: normal;
  }
`;
