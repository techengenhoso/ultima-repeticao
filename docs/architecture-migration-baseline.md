# Linha de base da migração arquitetural

## Finalidade

Este documento é a Etapa 0 da migração incremental para a estrutura definida em `AGENTS.md`. Ele registra o comportamento e as fronteiras que devem permanecer estáveis durante a refatoração. Não autoriza migração de dados, alteração de URLs, regras do Firestore, autenticação ou publicação.

## Estado do repositório

Há alterações locais não confirmadas relacionadas à refatoração em andamento. Elas são parte do estado de trabalho a preservar: esta etapa não faz `reset`, `checkout`, formatação global, commit ou limpeza de arquivos.

## Contratos públicos que não podem mudar

| Área | Contrato atual |
| --- | --- |
| Autenticação | Firebase Authentication no browser; o UID é a única autoridade de posse dos dados |
| Perfil, exercícios e fichas | Leitura e escrita pelo cliente, protegidas pelas regras do Firestore |
| Sessões | `GET` e `POST /api/workout-sessions`; token Bearer validado no servidor; gravação somente por Firebase Admin |
| Avaliações | `GET`, `POST`, `PUT` e `DELETE /api/body-assessments`; token Bearer validado no servidor; gravação somente por Firebase Admin |
| Desempenho | `GET /api/performance`; token Bearer validado no servidor |
| Sessões | Documento contém snapshots da ficha e exercício, estado, `version`, desempenho e decisão de progressão |
| Fichas | Documento incorporado em `users/{uid}/workoutPlans/{id}`; uma ativação deve continuar atômica |

## Persistência e regras de acesso

| Coleção | Caminho de escrita obrigatório | Observação |
| --- | --- | --- |
| Perfil | Cliente + regras Firestore | `users/{uid}` |
| Exercícios e overrides | Cliente + regras Firestore | `users/{uid}/exercises` e `exerciseOverrides` |
| Fichas | Cliente + regras Firestore | `users/{uid}/workoutPlans` |
| Sessões | Route Handler + Firebase Admin | Regras bloqueiam toda escrita direta do cliente |
| Avaliações corporais | Route Handler + Firebase Admin | Regras bloqueiam toda escrita direta do cliente |

Os índices atuais cobrem consultas de sessões concluídas por data e por referência de exercício. Nenhum índice ou regra deve ser publicado como parte da migração sem solicitação explícita.

## Invariantes a preservar

- O histórico de sessões é imutável quanto a ficha, dia, identidade e snapshot de exercício
- Atualizações de execução alteram somente desempenho permitido, relato de dor e decisão de carga
- A concorrência otimista usa `version` e conflitos retornam 409
- Progressão é determinística, só ocorre depois da sessão concluída e não usa IA
- Referências de exercício usam `source + exerciseId`, nunca o nome
- Uma ficha ativa por usuário é preservada por transação
- O formato legado de fichas continua normalizado somente em memória até salvamento explícito
- A pendência de validação profunda dos itens internos de fichas nas regras do Firestore permanece aberta e não pode ser considerada resolvida por esta migração

## Mapa de dependências observado

| Contexto | Estado atual | Alvo da migração |
| --- | --- | --- |
| Usuário e perfil | Casos de uso, portas e adapters Firebase separados; contexts somente coordenam estado | Manter a fronteira nas próximas alterações |
| Exercícios | Modelos, filtros e normalização no domínio; casos de uso e adapter Firebase separados; contexts somente coordenam estado | Manter a fronteira nas próximas alterações |
| Fichas | Agregado, schemas, catálogo e metodologia no domínio; casos de uso e adapter Firebase separados; context somente coordena estado | Manter a fronteira nas próximas alterações |
| Assistente de fichas | Regras no domínio, schema e orquestração de geração na aplicação; componentes somente coordenam formulário e estado | Manter a fronteira nas próximas alterações |
| Avaliações | Modelos e cálculos no domínio; metadados de formulário na apresentação; portas, adapters HTTP e Firebase separados | Manter a fronteira nas próximas alterações |
| Sessões e progressão | Domínio, portas, casos de uso, mappers e Firebase separados; leitura da biblioteca abstraída por porta e composta na borda HTTP | Manter a fronteira nas próximas alterações |
| Desempenho | Tipos e cálculos no domínio; consultas e operações de progresso passam por casos de uso; adapters HTTP e Firebase separados | Manter a fronteira nas próximas alterações |

## Violações conhecidas a tratar nas próximas etapas

Não há violações mapeadas pendentes nos contextos já migrados.

Consulte também `docs/architecture-final-audit.md` para os critérios conferidos ao final da migração e a pendência de segurança que permanece fora do seu escopo.

## Critérios de saída da Etapa 0

- Contratos HTTP, coleções e invariantes documentados
- Violações arquiteturais existentes registradas sem mudança funcional
- Base validada por TypeScript, verificação de fronteiras e build de produção
- Etapas seguintes executadas por contexto, removendo código legado somente depois de não haver importadores

## Verificações da etapa

Executar depois de qualquer alteração de código nas etapas seguintes:

```bash
npx tsc --noEmit
npm run check:architecture
npm run build
```

O Biome deve receber somente os arquivos modificados na etapa correspondente.
