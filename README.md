# Brain Agriculture - Teste Tecnico v2

Especificacao para uma aplicacao fullstack de gerenciamento de produtores rurais, propriedades, safras e culturas plantadas.

## Objetivo

Construir uma solucao limpa, testavel, documentada e escalavel para cadastrar produtores rurais e apresentar indicadores consolidados em dashboard.

## Escopo

- Cadastro, edicao, listagem e exclusao de produtores rurais.
- Validacao de CPF ou CNPJ.
- Associacao de um produtor a zero, uma ou varias propriedades rurais.
- Cadastro de safras e culturas plantadas por propriedade.
- Validacao de areas da propriedade.
- Dashboard com totais e graficos por estado, cultura e uso do solo.

## Documentacao

- [Especificacao funcional e tecnica](docs/SPEC.md)
- [Contrato OpenAPI](docs/openapi.yaml)

## Como executar

1. Instale as dependencias:

```bash
npm install
```

2. Copie as variaveis de ambiente:

```bash
cp .env.example .env
```

3. Suba o PostgreSQL:

```bash
docker compose up -d
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

6. Rode backend e frontend em terminais separados:

```bash
npm run dev --workspace @brain-agriculture/api
npm run dev --workspace @brain-agriculture/web
```

URLs locais:

- API: `http://localhost:3333`
- Web: `http://localhost:5173`

## Stack sugerida

Backend:

- Node.js com TypeScript.
- NestJS.
- PostgreSQL.
- ORM Prisma ou TypeORM.
- Docker e Docker Compose.
- Testes unitarios e integrados.

Frontend:

- React com TypeScript.
- Redux Toolkit ou Context API.
- Jest e React Testing Library.
- Styled Components ou Emotion.
- Atomic design para componentes.

## Entregaveis esperados

- API REST documentada.
- Aplicacao frontend integrada ou dados mockados, conforme escopo escolhido.
- README com instrucoes de execucao.
- Especificacao OpenAPI.
- Testes automatizados.
- Logs estruturados no backend.
