# Roteiro de decisoes tecnicas

Este documento registra as principais decisoes tomadas durante a implementacao e refatoracao do Brain Agriculture.

## 1. Manter o stack atual do frontend

Decisao: manter React, TypeScript, Redux Toolkit, Recharts, Lucide e styled-components.

Motivo: o projeto ja estava funcional nesse stack. Introduzir Tailwind, Shadcn/UI, React Query ou Framer Motion neste momento aumentaria o risco de regressao, exigiria migracao estrutural e instalacao de novas dependencias. A prioridade foi evoluir UX e manutencao sem quebrar integracao existente.

Impacto: a UI moderna foi implementada com styled-components e componentes locais reutilizaveis.

## 2. Refatorar `App.tsx` para papel de orquestrador

Decisao: separar telas, layout, modais, componentes compartilhados, tipos e formatadores.

Motivo: concentrar tudo em `App.tsx` deixava o arquivo dificil de revisar e manter. O `App.tsx` agora cuida de estado, chamadas Redux e composicao das telas; componentes visuais vivem em arquivos dedicados.

Arquivos criados:

- `apps/web/src/components/AppLayout.tsx`
- `apps/web/src/components/modals.tsx`
- `apps/web/src/components/ui.tsx`
- `apps/web/src/screens/DashboardScreen.tsx`
- `apps/web/src/screens/ProducersScreen.tsx`
- `apps/web/src/screens/FarmsScreen.tsx`
- `apps/web/src/screens/CulturesScreen.tsx`
- `apps/web/src/screens/PlaceholderScreen.tsx`
- `apps/web/src/app-types.ts`
- `apps/web/src/utils/formatters.ts`

## 3. Simplificar a pagina de produtores

Decisao: remover elementos nao funcionais, como filtros fake, menus extras e painel lateral permanente.

Motivo: elementos sem comportamento real aumentavam ruido visual e passavam sensacao de produto incompleto. A pagina passou a ter apenas lista, busca, cadastro e expansao de fazendas por clique.

Fluxo atual:

1. A pagina lista produtores existentes.
2. Se nao houver registros, mostra estado vazio.
3. `Adicionar produtor` abre modal de cadastro.
4. Ao salvar com sucesso, abre modal com `Adicionar Fazenda` ou `Pular`.
5. Clicar em um produtor expande suas fazendas e culturas vinculadas.

## 4. Dashboard com filtros funcionais

Decisao: os filtros do dashboard rodam no frontend sobre os dados ja carregados de produtores/fazendas/culturas.

Motivo: o backend ainda expoe `/dashboard` agregado sem parametros de filtro. Para entregar UX funcional sem alterar contrato, os filtros foram calculados em memoria no frontend.

Impacto: cards e graficos refletem filtro por UF e cultura. Futuramente, se houver grande volume de dados, essa logica deve migrar para endpoint dedicado com query params.

## 5. OpenAPI versionado e validavel por script

Decisao: adicionar `npm run openapi:validate`.

Motivo: validar sintaxe YAML e referencias `$ref` evita contrato quebrado no repositorio. A renderizacao interativa via Swagger UI/Redoc ainda nao esta publicada pela API.

## 6. Docker e portas

Decisao: manter scripts separados para banco e aplicacao.

Motivo: durante desenvolvimento local, a API em `3333` pode conflitar com container da API. O script `docker:db` permite manter somente o PostgreSQL e rodar API/Web localmente.
