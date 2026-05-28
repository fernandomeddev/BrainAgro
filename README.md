# Brain Agriculture

Brain Agriculture e uma plataforma fullstack para gestao de produtores rurais, propriedades, safras, culturas plantadas e indicadores executivos de operacao agricola.

O projeto foi estruturado para demonstrar dominio tecnico ponta a ponta: modelagem de dominio, API REST com regras de negocio, persistencia relacional, frontend responsivo, dashboard operacional, contrato OpenAPI, testes automatizados e distribuicao com Docker.

## Visao Executiva

A solucao atende um cenario real de agritech: manter uma base confiavel de produtores, controlar suas fazendas, registrar culturas por safra e consolidar dados para tomada de decisao.

Principais capacidades:

- Cadastro e manutencao de produtores rurais com CPF/CNPJ.
- Cadastro e manutencao de fazendas vinculadas a produtores.
- Registro de culturas por fazenda e safra.
- Validacao de documento e regras de area agricola.
- Dashboard com indicadores consolidados e graficos por estado, cultura e uso do solo.
- Interface dark SaaS com navegacao por modais, feedbacks por toast e experiencia responsiva.
- API documentada com Swagger e contrato OpenAPI versionado.
- Banco PostgreSQL com Prisma ORM e migrations.
- Execucao local com ou sem Docker.
- Testes automatizados para regras criticas e fluxos de estado.

## Stack Tecnica

Backend:

- Node.js 20
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Swagger / OpenAPI
- Jest

Frontend:

- React
- TypeScript
- Vite
- Redux Toolkit
- Styled Components
- Recharts
- React Toastify
- Lucide Icons
- Vitest

Infraestrutura:

- Docker
- Docker Compose
- Workspaces npm
- Scripts de build, teste, versionamento e validacao OpenAPI

## Arquitetura

```text
apps/
  api/                  API NestJS
    prisma/             Schema, migrations e seed
    src/                Controllers, services, dominio e infraestrutura
  web/                  Aplicacao React
    src/components/     Layout, modais e componentes reutilizaveis
    src/screens/        Telas de dashboard, produtores, fazendas e culturas
    src/store/          Estado global com Redux Toolkit
    src/utils/          Formatadores e normalizacao
docs/
  SPEC.md               Especificacao funcional e tecnica
  openapi.yaml          Contrato OpenAPI versionado
scripts/
  bump-version.cjs      Versionamento SemVer
  validate-openapi.cjs  Validacao do contrato OpenAPI
```

## Requisitos

- Node.js `>= 20`
- npm
- Docker e Docker Compose, caso opte por executar com containers

## Variaveis de Ambiente

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Conteudo esperado para execucao local padrao:

```env
DATABASE_URL="postgresql://brain:brain@localhost:5432/brain_agriculture?schema=public"
API_PORT=3333
WEB_API_URL="http://localhost:3333"
```

Observacao: o frontend usa `VITE_API_URL` quando informado. Sem configuracao adicional, ele assume `http://localhost:3333`, que e o endpoint padrao da API local.

## Execucao Local com Docker

Use este caminho para uma demonstracao rapida da aplicacao completa.

1. Instale as dependencias:

```bash
npm install
```

2. Suba API, Web e PostgreSQL:

```bash
npm run docker:app
```

3. Acesse:

- Web: `http://localhost:4173`
- API: `http://localhost:3333`
- Swagger UI: `http://localhost:3333/docs`
- Swagger JSON: `http://localhost:3333/docs-json`

No modo Docker, a API executa as migrations automaticamente no startup usando `prisma migrate deploy`.

Comandos uteis:

```bash
docker compose ps
docker compose logs -f api
docker compose logs -f web
docker compose down
```

## Execucao Local sem Docker

Use este caminho para desenvolvimento ativo, com hot reload na API e no frontend.

1. Instale as dependencias:

```bash
npm install
```

2. Crie o `.env`:

```bash
cp .env.example .env
```

3. Suba somente o PostgreSQL via Docker:

```bash
npm run docker:db
```

4. Gere o Prisma Client:

```bash
npm run prisma:generate
```

5. Execute as migrations:

```bash
npm run prisma:migrate
```

6. Carregue dados de exemplo:

```bash
npm run seed
```

7. Inicie a API:

```bash
npm run dev --workspace @brain-agriculture/api
```

8. Em outro terminal, inicie o frontend:

```bash
npm run dev --workspace @brain-agriculture/web
```

URLs locais:

- Web: `http://localhost:5173`
- API: `http://localhost:3333`
- Swagger UI: `http://localhost:3333/docs`

## Scripts Principais

Instalar dependencias:

```bash
npm install
```

Build completo:

```bash
npm run build
```

Testes automatizados:

```bash
npm run test
```

Validar OpenAPI:

```bash
npm run openapi:validate
```

Executar banco:

```bash
npm run docker:db
```

Executar stack completa:

```bash
npm run docker:app
```

Parar apenas API e Web em Docker, mantendo PostgreSQL ativo:

```bash
npm run docker:stop-app
```

## API

Endpoints principais:

```text
POST   /producers
GET    /producers
GET    /producers/:producerId
PUT    /producers/:producerId
DELETE /producers/:producerId

POST   /producers/:producerId/farms
GET    /producers/:producerId/farms
GET    /farms/:farmId
PUT    /farms/:farmId
DELETE /farms/:farmId

POST   /farms/:farmId/harvest-crops
GET    /farms/:farmId/harvest-crops
PUT    /harvest-crops/:harvestCropId
DELETE /harvest-crops/:harvestCropId

GET    /dashboard
```

Documentacao interativa:

```text
http://localhost:3333/docs
```

Contrato versionado:

```text
docs/openapi.yaml
```

## Regras de Negocio

- CPF e CNPJ sao normalizados e validados por digito verificador.
- Documento de produtor e unico.
- Um produtor pode possuir multiplas fazendas.
- A soma `areaAgricultavel + areaVegetacao` nao pode ultrapassar `areaTotal`.
- Uma fazenda pode ter varias culturas por safra.
- A mesma cultura nao pode ser duplicada na mesma fazenda e safra.
- Exclusao de produtor e fazenda segue estrategia de soft delete para preservar historico operacional.

## Frontend

A interface foi desenhada com foco em produtividade operacional:

- Dashboard executivo com cards e graficos.
- Lista de produtores com expansao para fazendas e culturas.
- Formularios em modais para reduzir troca de contexto.
- Edicao de fazendas e culturas em modais preenchidos.
- Confirmacoes de exclusao com modal personalizado.
- Feedbacks de sucesso e erro com React Toastify.
- Layout dark SaaS responsivo.

Estrutura principal:

```text
apps/web/src
  App.tsx
  app-types.ts
  components/
    AppLayout.tsx
    modals.tsx
    ui.tsx
  screens/
    DashboardScreen.tsx
    ProducersScreen.tsx
    FarmsScreen.tsx
    CulturesScreen.tsx
  store/
  styles/
  utils/
```

## Qualidade e Validacao

O projeto inclui uma esteira local simples para avaliar integridade tecnica:

```bash
npm run build
npm run test
npm run openapi:validate
```

Esses comandos validam:

- compilacao TypeScript da API e do Web;
- build de producao do frontend;
- testes unitarios e de estado;
- contrato OpenAPI versionado;
- referencias internas do arquivo OpenAPI.

## Versionamento

O repositorio usa SemVer no formato `MAJOR.MINOR.PATCH`, mantendo versao sincronizada entre pacote raiz, API, Web e lockfile.

Comandos disponiveis:

```bash
npm run version:dev
npm run version:fix
npm run version:feature
npm run version:release
```

Simulacao sem escrita:

```bash
npm run version -- dev --dry-run
```

## Material de Apoio

- [Especificacao funcional e tecnica](docs/SPEC.md)
- [Contrato OpenAPI](docs/openapi.yaml)

## Proposta Tecnica

Brain Agriculture representa uma entrega fullstack com leitura de produto, criterio arquitetural e cuidado de experiencia. A solucao combina backend consistente, frontend orientado a fluxo de trabalho, validacoes de dominio, documentacao executavel e empacotamento com Docker.

O projeto foi conduzido com foco em clareza, manutencao e demonstrabilidade: possibilitando facilmente subir o ambiente, validar a API, navegar pelo frontend e verificar os principais criterios de negocio em poucos minutos.
