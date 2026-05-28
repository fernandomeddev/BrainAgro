import { FileBarChart, Settings } from 'lucide-react';
import type { Page } from '../app-types';
import { EmptyState, PageContainer, Panel } from '../components/ui';

export function PlaceholderScreen({ page }: { page: Page }) {
  return (
    <PageContainer>
      <Panel>
        <EmptyState
          icon={page === 'reports' ? <FileBarChart size={24} /> : <Settings size={24} />}
          title={page === 'reports' ? 'Relatorios em construcao' : 'Configuracoes em construcao'}
          description="A navegacao ja esta preparada para o modulo. O proximo incremento conecta os fluxos especificos."
        />
      </Panel>
    </PageContainer>
  );
}
