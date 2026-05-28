# Brain Agriculture

Aplicacao fullstack para gerenciamento de produtores rurais, fazendas, safras, culturas plantadas e indicadores operacionais.

## Escopo Entregue

- CRUD de produtores rurais com validacao de CPF/CNPJ.
- Cadastro e manutencao de fazendas vinculadas a produtores.
- Cadastro e manutencao de culturas por fazenda e safra.
- Validacao de area: `areaAgricultavel + areaVegetacao <= areaTotal`.
- Dashboard com cards e graficos de pizza por uso do solo, estado e cultura.
- Filtros funcionais no dashboard por UF e cultura.
- Frontend dark SaaS, responsivo e refatorado em componentes.
- Contrato OpenAPI versionado e validavel por script.
- Docker para PostgreSQL, API e Web.

## Documentacao

- [Especificacao funcional e tecnica](docs/SPEC.md)
- [Contrato OpenAPI](docs/openapi.yaml)
- [Roteiro de decisoes tecnicas](docs/DECISIONS.md)
- [Diagnostico e pontos de revisao](docs/DIAGNOSTICO.md)

## Stack

Backend:

- Node.js
- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Docker

Frontend:

- React
- TypeScript
- Redux Toolkit
- Styled Components
- Recharts
- Lucide Icons
- Vite

## Como Executar Localmente

1. Instale as dependencias:

```bash
npm install
```

2. Copie as variaveis de ambiente:

```bash
cp .env.example .env
```

3. Suba somente o PostgreSQL:

```bash
npm run docker:db
```

4. Gere o client Prisma e rode as migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Popule dados de exemplo:

```bash
npm run seed
```

6. Rode API e Web em terminais separados:

```bash
npm run dev --workspace @brain-agriculture/api
npm run dev --workspace @brain-agriculture/web
```

URLs locais:

- API: `http://localhost:3333`
- Swagger UI: `http://localhost:3333/docs`
- Swagger JSON: `http://localhost:3333/docs-json`
- Web: `http://localhost:5173`

Se a porta `3333` estiver em uso apos executar a pilha Docker completa, pare os containers de aplicacao e mantenha somente o banco:

```bash
npm run docker:stop-app
npm run docker:db
```

## Docker

Para executar a pilha completa em containers:

```bash
npm run docker:app
```

URLs em Docker:

- API: `http://localhost:3333`
- Swagger UI: `http://localhost:3333/docs`
- Web: `http://localhost:4173`

## Validacoes

Build completo:

```bash
npm run build
```

Testes:

```bash
npm run test
```

Validar contrato OpenAPI:

```bash
npm run openapi:validate
```

O script valida:

- sintaxe YAML;
- secoes principais (`openapi`, `paths`, `components`);
- referencias internas `$ref`.

O contrato versionado fica em `docs/openapi.yaml`. A API tambem publica uma documentacao interativa gerada em runtime em `http://localhost:3333/docs`.

## Frontend

Estrutura principal:

```text
apps/web/src
  app-types.ts
  App.tsx
  components/
    AppLayout.tsx
    modals.tsx
    ui.tsx
  screens/
    DashboardScreen.tsx
    ProducersScreen.tsx
    FarmsScreen.tsx
    CulturesScreen.tsx
    PlaceholderScreen.tsx
  store/
  styles/
  utils/
```

Decisao arquitetural: `App.tsx` fica responsavel por orquestrar estado, dispatches e exibicao das telas. Componentes visuais e telas ficam separados para facilitar manutencao.

## OpenAPI

Arquivo principal:

```text
docs/openapi.yaml
```

Resumo atual:

- OpenAPI: `3.0.3`
- API version: `1.0.0`
- Paths documentados: produtores, fazendas, culturas e dashboard.
- Renderizacao interativa: `http://localhost:3333/docs`.
- JSON gerado em runtime: `http://localhost:3333/docs-json`.

## Versionamento

O projeto usa SemVer no formato `MAJOR.MINOR.PATCH`, mantendo a mesma versao no pacote raiz, API, frontend e `package-lock.json`.

Regras:

- `dev`: incrementa prerelease de desenvolvimento.
- `fix`: incrementa patch.
- `feature`: incrementa minor.
- `release`: incrementa major.

Comandos:

```bash
npm run version:dev
npm run version:fix
npm run version:feature
npm run version:release
```

Simular sem alterar arquivos:

```bash
npm run version -- dev --dry-run
```

## Pontos Conhecidos

- `npm run lint` ainda depende de criar `eslint.config.js` para ESLint 9.
- Dashboard filtra em memoria no frontend; para grande volume, recomenda-se filtros no endpoint `/dashboard`.
- Relatorios e Configuracoes estao preparados na navegacao, mas sem regra de negocio implementada.
