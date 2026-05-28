# Diagnostico tecnico e pontos de revisao

## Status atual

- Backend com CRUD de produtores, fazendas, culturas e dashboard agregado.
- Frontend integrado via Redux Toolkit.
- Dashboard com graficos de pizza, legendas e filtros funcionais em memoria.
- Pagina de produtores simplificada com lista, modal de cadastro e expansao de fazendas.
- OpenAPI validado por script local.
- Docker preparado para banco, API e Web.

## Pontos que precisam de revisao futura

### 1. Swagger UI ou Redoc ainda nao publicado pela API

O contrato `docs/openapi.yaml` esta valido e sem referencias quebradas, mas a API NestJS ainda nao expoe uma rota visual como `/docs`.

Recomendacao:

- Instalar e configurar `@nestjs/swagger` e `swagger-ui-express`, ou servir Redoc/Swagger UI estatico.
- Publicar a documentacao em `http://localhost:3333/docs`.

Motivo de nao implementacao agora:

- Exigiria novas dependencias. Como o ambiente tem rede restrita, preferi nao introduzir instalacoes externas sem aprovacao.

### 2. Filtros do dashboard estao no frontend

Os filtros por UF e cultura sao calculados em memoria a partir dos produtores carregados.

Recomendacao:

- Criar `GET /dashboard?state=MT&crop=Soja`.
- Retornar agregacoes ja filtradas pelo banco.

Risco atual:

- Funciona bem para volumes pequenos/medios, mas pode ficar impreciso se a lista de produtores carregada no frontend estiver paginada ou limitada.

### 3. Telas de Relatorios e Configuracoes sao placeholders

Elas existem na navegacao, mas ainda nao possuem regra de negocio conectada.

Recomendacao:

- Definir requisitos dessas telas antes de implementar UI.
- Remover da navegacao se nao forem parte do escopo de entrega.

### 4. Lint ainda nao executa

O script `lint` falha porque o projeto usa ESLint 9, mas nao possui `eslint.config.js`.

Recomendacao:

- Criar configuracao flat config do ESLint 9.
- Incluir regras para React, TypeScript e hooks.

### 5. Testes do frontend cobrem store, mas nao UI

Hoje existem testes do slice de produtores, mas nao ha testes de componentes/telas.

Recomendacao:

- Adicionar testes de UI para cadastro de produtor, expansao de fazendas, filtros do dashboard e estados vazios.

### 6. Confirmacoes ainda usam `window.confirm`

As exclusoes ainda usam confirmacao nativa do navegador.

Recomendacao:

- Criar `ConfirmDialog` reutilizavel para consistencia visual e acessibilidade.

### 7. Tipos do frontend podem evoluir com contratos gerados

Os tipos atuais sao manuais.

Recomendacao:

- Gerar tipos TypeScript a partir do OpenAPI para reduzir divergencia entre contrato e frontend.

## Validacoes executadas

- `npm run build --workspace @brain-agriculture/web`
- `npm run test --workspace @brain-agriculture/web`
- `npm run openapi:validate`

## Limitacoes de permissao/ambiente encontradas

- Navegador interno do Codex nao estava disponivel em tentativas anteriores, entao a validacao visual foi feita por build/testes e revisao estatica.
- Rede restrita: evitei adicionar dependencias novas como Swagger UI, Redoc, Shadcn/UI, Tailwind ou Framer Motion.
- Docker pode exigir permissao fora do sandbox dependendo do comando; evitei reiniciar containers sem necessidade.
