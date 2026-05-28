import { BarChart3, Building2, Factory, FileBarChart, Leaf, Plus, RefreshCw, Settings, Sprout } from 'lucide-react';
import styled from 'styled-components';
import type { Page } from '../app-types';
import { IconButton, PrimaryButton } from './ui';

export function AppSidebar({ activePage, onNavigate }: { activePage: Page; onNavigate: (page: Page) => void }) {
  const items = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'producers' as const, label: 'Produtores', icon: Factory },
    { id: 'farms' as const, label: 'Fazendas', icon: Building2 },
    { id: 'cultures' as const, label: 'Culturas', icon: Sprout },
    { id: 'reports' as const, label: 'Relatorios', icon: FileBarChart },
    { id: 'settings' as const, label: 'Configuracoes', icon: Settings }
  ];

  return (
    <Sidebar>
      <Brand>
        <LogoMark>
          <Sprout size={22} />
        </LogoMark>
        <BrandText>
          <strong>Brain Agriculture</strong>
          <span>Operacao rural</span>
        </BrandText>
      </Brand>

      <NavGroup>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavItem key={item.id} type="button" $active={activePage === item.id} onClick={() => onNavigate(item.id)}>
              <Icon size={18} />
              <span>{item.label}</span>
            </NavItem>
          );
        })}
      </NavGroup>

      <SidebarCard>
        <Leaf size={22} />
        <strong>Agricultura inteligente</strong>
        <span>Dados rurais claros para decisoes sustentaveis.</span>
      </SidebarCard>
    </Sidebar>
  );
}

export function AppHeader({
  activePage,
  onRefresh,
  onAddProducer,
  onAddFarm,
  onAddCulture
}: {
  activePage: Page;
  onRefresh: () => void;
  onAddProducer: () => void;
  onAddFarm: () => void;
  onAddCulture: () => void;
}) {
  const copy: Record<Page, { title: string; description: string; action?: string; onAction?: () => void }> = {
    dashboard: { title: 'Dashboard operacional', description: 'Visao executiva dos indicadores de produtores, fazendas e culturas.' },
    producers: { title: 'Produtores Rurais', description: 'Gerencie produtores rurais e expanda suas fazendas vinculadas.' },
    farms: { title: 'Fazendas', description: 'Acompanhe propriedades rurais e composicao de area.', action: 'Adicionar fazenda', onAction: onAddFarm },
    cultures: { title: 'Culturas', description: 'Consulte culturas plantadas por fazenda e safra.', action: 'Adicionar cultura', onAction: onAddCulture },
    reports: { title: 'Relatorios', description: 'Relatorios operacionais e exportacoes da plataforma.' },
    settings: { title: 'Configuracoes', description: 'Preferencias, acessos e parametros do ambiente.' }
  };

  const page = copy[activePage];

  return (
    <Header>
      <HeaderCopy>
        <Breadcrumb>Brain Agriculture / {page.title}</Breadcrumb>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </HeaderCopy>
      <HeaderActions>
        <IconButton type="button" title="Atualizar dados" onClick={onRefresh}>
          <RefreshCw size={18} />
        </IconButton>
        {activePage === 'producers' ? (
          <PrimaryButton type="button" onClick={onAddProducer}>
            <Plus size={17} />
            Adicionar produtor
          </PrimaryButton>
        ) : null}
        {page.action ? (
          <PrimaryButton type="button" onClick={page.onAction}>
            <Plus size={17} />
            {page.action}
          </PrimaryButton>
        ) : null}
      </HeaderActions>
    </Header>
  );
}

export const Shell = styled.div`
  min-height: 100vh;
  padding-left: 280px;
  background:
    radial-gradient(circle at 18% 12%, rgba(34, 197, 94, 0.14), transparent 28%),
    radial-gradient(circle at 90% 6%, rgba(20, 184, 166, 0.1), transparent 24%),
    linear-gradient(135deg, #08110d 0%, #0d1511 48%, #08110d 100%);
  color: #f8fafc;

  @media (max-width: 900px) {
    padding-left: 80px;
  }

  @media (max-width: 720px) {
    padding-left: 0;
    padding-bottom: 74px;
  }
`;

export const Main = styled.main`
  min-width: 0;
  padding: 32px;

  @media (max-width: 720px) {
    padding: 18px;
  }
`;

const Sidebar = styled.aside`
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 10;
  width: 280px;
  display: flex;
  flex-direction: column;
  padding: 24px 18px;
  border-right: 1px solid rgba(90, 130, 100, 0.15);
  background: rgba(8, 17, 13, 0.86);
  backdrop-filter: blur(22px);
  box-shadow: 24px 0 80px rgba(0, 0, 0, 0.28);

  @media (max-width: 900px) {
    width: 80px;
    padding: 18px 12px;
  }

  @media (max-width: 720px) {
    inset: auto 0 0;
    width: auto;
    height: 74px;
    flex-direction: row;
    align-items: center;
    border-right: 0;
    border-top: 1px solid rgba(90, 130, 100, 0.15);
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;

  @media (max-width: 720px) {
    display: none;
  }
`;

const LogoMark = styled.div`
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 16px;
  color: #bbf7d0;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(34, 197, 94, 0.06));
  border: 1px solid rgba(34, 197, 94, 0.2);
`;

const BrandText = styled.div`
  display: grid;
  gap: 2px;

  strong {
    color: #f8fafc;
    font-size: 0.95rem;
  }

  span {
    color: #64748b;
    font-size: 0.75rem;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const NavGroup = styled.nav`
  display: grid;
  gap: 8px;

  @media (max-width: 720px) {
    grid-template-columns: repeat(6, 1fr);
    width: 100%;
  }
`;

const NavItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  min-height: 46px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(34, 197, 94, 0.22)' : 'transparent')};
  border-radius: 16px;
  padding: 0 12px;
  color: ${({ $active }) => ($active ? '#f8fafc' : '#94a3b8')};
  background: ${({ $active }) => ($active ? 'rgba(34, 197, 94, 0.15)' : 'transparent')};
  cursor: pointer;
  transition: 160ms ease;

  &:hover {
    color: #f8fafc;
    background: rgba(34, 197, 94, 0.1);
  }

  span {
    font-weight: 650;
  }

  @media (max-width: 900px) {
    justify-content: center;

    span {
      display: none;
    }
  }
`;

const SidebarCard = styled.div`
  margin-top: auto;
  padding: 16px;
  border: 1px solid rgba(90, 130, 100, 0.15);
  border-radius: 22px;
  background:
    radial-gradient(circle at 80% 0%, rgba(34, 197, 94, 0.16), transparent 40%),
    rgba(16, 26, 22, 0.72);
  color: #94a3b8;

  strong {
    display: block;
    margin: 12px 0 4px;
    color: #f8fafc;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 1100px) {
    flex-direction: column;
  }
`;

const HeaderCopy = styled.div`
  h1 {
    margin: 8px 0 8px;
    font-size: clamp(2rem, 4vw, 3.25rem);
    line-height: 1;
    letter-spacing: 0;
  }

  p {
    margin: 0;
    color: #94a3b8;
  }
`;

const Breadcrumb = styled.span`
  color: #22c55e;
  font-size: 0.78rem;
  font-weight: 750;
  text-transform: uppercase;
`;

const HeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
`;
