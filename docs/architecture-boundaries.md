# Fronteiras arquiteturais

## Shared kernel

`src/lib` fica restrito a utilitários sem persistência, HTTP, framework ou regra específica de um bounded context. Atualmente são aceitos temporariamente: datas, composição de classes e schemas/valores transversais. Catálogos, entidades, políticas, schemas de contexto e integrações devem ser migrados nas etapas do contexto correspondente.

`src/modules/shared` contém capacidades compartilhadas que pertencem a uma camada explícita. Por exemplo, autenticação de requisições e Firebase Admin pertencem a `shared/infrastructure`, nunca a `src/lib`.

## Direção de dependências

```text
presentation -> application -> domain
infrastructure -> application ports
```

- `domain` não importa React, Next.js, Firebase, HTTP, banco de dados, ambiente ou infraestrutura
- `application` não importa React, Next.js, Firebase, HTTP, banco de dados, ambiente ou infraestrutura
- `infrastructure` implementa ports e traduz dados externos
- `presentation` somente coordena interação e estado de tela; ela não acessa Firebase diretamente
- `src/app/api` autentica, valida HTTP, compõe dependências na borda e traduz resultados do caso de uso

## Proteção automatizada

`npm run check:architecture` inspeciona todos os arquivos de `domain` e `application` em `src/modules`. Ele falha se houver imports de React, Next.js, Firebase, `server-only`, infraestrutura global ou infraestrutura de outro contexto.

O comando faz parte de `npm run build`. Ele não substitui a revisão arquitetural: regras de domínio temporariamente localizadas em `src/lib` continuam registradas na linha de base e serão eliminadas nas etapas de cada bounded context.

## Convenções de fronteira

- Tipos de entrada e saída externos são validados na borda com Zod
- Ports ficam em `application/ports`; adapters concretos ficam em `infrastructure`
- Um caso de uso representa uma intenção observável do produto, não apenas um alias para um SDK
- Erros internos são traduzidos na borda HTTP para mensagens públicas em português
- Dados Firestore, `Timestamp`, `DocumentData` e transações não atravessam ports
