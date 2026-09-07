# Última Repetição — Instruções para agentes de IA

## Prioridade e objetivo

Estas instruções se aplicam a todo o repositório. Em caso de conflito, siga nesta ordem: solicitação atual do usuário, este arquivo, padrões já presentes no código e, por último, preferências técnicas.

O Última Repetição é uma aplicação pessoal de acompanhamento de musculação: biblioteca de exercícios, fichas, execução, histórico, avaliações corporais e evolução. A prioridade é preservar dados e regras já existentes. Não trate recomendações de treino como aconselhamento médico.

## Autonomia e método de trabalho

O agente tem autonomia para analisar, planejar, implementar, testar e corrigir tarefas dentro destas regras. Para alterações não triviais, comunique antes um plano curto com comportamento esperado, arquivos prováveis e validações; em seguida, execute-o sem aguardar aprovação.

Só peça confirmação quando a solicitação exigir uma decisão de produto não especificada ou envolver ação irreversível/externa: apagar ou migrar dados existentes, alterar contrato público incompatível, mudar autenticação ou permissões, publicar/deployar, adicionar custo/serviço externo, alterar dependência central, ou reformular globalmente o design.

Antes de editar:

1. Leia todos os arquivos `AGENTS.md` aplicáveis e os documentos de `docs/` ligados ao domínio alterado.
2. Inspecione os fluxos completos relacionados: interface, caso de uso, domínio, persistência, schemas, rotas e regras do Firestore.
3. Identifique a camada correta da alteração e mantenha as dependências na direção permitida.
4. Faça a menor alteração completa que atende ao requisito. Não implemente funcionalidades extras, não invente requisitos e não substitua a arquitetura atual apenas por preferência.
5. Nunca reverta, formate em massa, mova ou remova alterações preexistentes do usuário.

## Stack e versão instalada

- Next.js 16.2.12 com App Router, React 19, TypeScript estrito e Tailwind CSS 4
- Firebase Authentication, Firestore e Firebase Admin
- Zod 4, React Hook Form, shadcn/ui, Radix/Base UI, Lucide e Sonner
- Biome 2.2 como formatador e linter

Esta versão do Next.js pode divergir do conhecimento prévio do agente. Antes de escrever código que use APIs, convenções ou estrutura do Next.js, consulte as definições e a documentação instaladas em `node_modules/next/` e considere avisos de breaking changes e deprecações. Quando necessário, complemente com a documentação oficial. A mesma regra vale para as versões instaladas das demais dependências: não invente APIs.

## Clean Architecture e Domain-Driven Design

Todo código novo ou significativamente alterado deve respeitar esta direção de dependências:

```text
presentation (Next.js, componentes, contexts)
        ↓
application (casos de uso e portas)
        ↓
domain (entidades, value objects e regras de negócio)

infrastructure (Firebase, HTTP e provedores externos) → implementa portas de application
```

Nunca deixe `domain` depender de React, Next.js, Firebase, HTTP, banco de dados ou variáveis de ambiente. `application` também não pode importar SDKs de infraestrutura; ela orquestra casos de uso e depende de contratos/ports. Apenas `infrastructure` conhece Firebase Admin, Firestore, Auth, APIs externas e seus formatos.

Use a migração incremental: módulos legados podem ser preservados temporariamente para evitar regressões, mas não são uma exceção permanente. Mapeie as violações por contexto e migre cada uma antes de expandir suas responsabilidades. Ao tocar um fluxo que misture camada de apresentação, negócio e infraestrutura, extraia a parte alterada para a camada adequada; não acrescente nova funcionalidade ao componente/serviço legado sem primeiro reduzir o acoplamento que a nova funcionalidade afetará.

Estrutura-alvo para novos domínios ou refatorações locais:

- `src/domain/<context>/`: entidades identificadas, value objects, serviços e políticas puras; regras e invariantes do negócio
- `src/application/<context>/`: casos de uso, comandos/consultas, portas de repositório e DTOs de aplicação
- `src/infrastructure/<context>/`: adapters do Firebase, mapeadores, implementações de repositório e integrações
- `src/presentation/`: adaptadores de interface compartilhados; `src/app/`, `src/components/` e `src/contexts/` continuam sendo a camada de apresentação do App Router

Para DDD:

- Use linguagem ubíqua consistente com o produto: ficha, dia de treino, exercício, sessão, série, avaliação corporal, desempenho e progressão
- Cada bounded context define seus próprios tipos e regras. Não reutilize objetos de um contexto como se fossem contrato universal
- Entidades têm identidade e ciclo de vida; value objects são validados, imutáveis quando possível e comparados pelo valor
- Invariantes pertencem à entidade, aggregate ou serviço de domínio — nunca ao componente, hook, Route Handler ou adapter Firebase
- Um caso de uso executa uma intenção de negócio completa, como iniciar sessão, registrar desempenho, criar ficha ou salvar avaliação. A UI não implementa essa regra nem chama uma implementação concreta de Firebase
- Declare interfaces de repositório/port em `application` (ou `domain` quando a abstração for puramente de domínio). Implemente-as em `infrastructure`; não nomeie um wrapper do SDK diretamente como arquitetura de repositório
- Traduza dados na fronteira: documentos Firestore, Request/Response e formulários não devem vazar como entidades de domínio
- Use Zod para validar entradas e dados externos nas bordas. A validação de formato não substitui invariantes de domínio

Regras práticas para a estrutura atual:

- `src/lib/workouts/methodology/`, `src/lib/sessions/progression.ts` e cálculos puros devem continuar sem imports de framework ou Firebase
- `src/app/api/` é um adapter HTTP: autentica, valida a requisição, invoca um caso de uso e traduz a resposta; não concentra regra de negócio ou consultas Firestore
- `src/contexts/` e componentes coordenam estado e interação. Eles não devem chamar Firestore nem conter cálculo de prescrição, progressão ou persistência
- Todo acesso Firebase novo deve ficar em um adapter de infraestrutura. Firebase Admin é exclusivamente servidor
- A composição de dependências fica na borda do servidor; não espalhe instâncias concretas pelo domínio ou apresentação
- `src/components/ui/` é código-base do shadcn: não o refatore para resolver problemas de domínio

Mantenha componentes, hooks e serviços focados em uma responsabilidade. Arquivos de conteúdo estático podem ser extensos; arquivos que combinem lógica de interface, formulário, acesso a dados e regra de negócio não podem crescer sem divisão. Acima de 500 linhas, extraia responsabilidades ao alterar o arquivo; acima de 700 linhas, proponha e execute uma divisão incremental no escopo da tarefa, salvo justificativa explícita para catálogo estático ou componente-base de terceiros.

## Dados, autenticação e segurança

Todo dado pertence ao usuário autenticado. Em qualquer leitura ou escrita, derive e valide o `uid` pela fonte autorizada; nunca aceite um `userId` do cliente como autorização.

Existem duas fronteiras de persistência:

| Domínio | Caminho obrigatório |
| --- | --- |
| Perfil, exercícios personalizados/overrides e fichas | Repositórios cliente + regras do Firestore |
| Sessões de treino, avaliações corporais e desempenho | Route Handler autenticado + Firebase Admin |

Não contorne essa divisão. As regras do Firestore proíbem escritas diretas de sessões e avaliações; manter essa garantia é intencional.

Para uma nova rota de API:

1. Use `runtime = "nodejs"` se houver Firebase Admin
2. Exija token `Authorization: Bearer <idToken>` e valide-o com `verifyIdToken(token, true)`
3. Valide query, corpo e resposta de domínio com Zod
4. Limite tamanho e tempo de leitura do corpo usando o padrão existente
5. Retorne mensagens públicas em português e status HTTP coerente; nunca exponha credenciais, stack traces ou detalhes internos
6. Use `Cache-Control: no-store` para dados pessoais ou mutáveis

Não exponha, registre, faça commit nem copie para o cliente valores de `.env`, credenciais Firebase Admin, tokens ou chaves privadas. Atualize `.env.example` quando uma variável pública ou de servidor passar a ser obrigatória, sem inserir valores reais.

Ao alterar uma coleção, contrato ou schema, localize e atualize em conjunto: schema Zod, tipo inferido, leitor/escritor, regra do Firestore ou serviço de servidor, cliente e índice do Firestore se uma nova consulta o exigir. Não publique regras, índices ou deploys Firebase/Vercel sem solicitação explícita.

## Regras de domínio que não podem regredir

- Preserve o histórico como registro imutável: uma sessão armazena snapshots do plano, dia e exercício usados no início. Alterar ou excluir uma ficha/exercício não pode reescrever sessões passadas
- Alterações de execução só podem modificar desempenho permitido (séries, carga, repetições, dor e decisão); não podem trocar exercícios, metas ou identidade da sessão
- Preserve a concorrência otimista das sessões com `version`; um conflito deve retornar 409, não sobrescrever dados silenciosamente
- A decisão de progressão só ocorre após sessão concluída e usa a lógica determinística existente. Não introduza cálculos “inteligentes” ou recomendações por IA sem validação explícita do domínio
- Não gere ou aceite fichas da IA sem reconstruir referências a partir da biblioteca e validar com os schemas/validadores existentes
- Para exercícios, preserve `source`, `exerciseId` e snapshots. Não deduza exercício apenas pelo nome
- Preserve limites, defaults de compatibilidade e normalização já definidos nos schemas. Mudanças de formato exigem estratégia explícita de compatibilidade e não podem migrar dados silenciosamente
- O usuário deve ter no máximo uma ficha ativa. Toda ativação precisa manter essa invariável de forma atômica
- Considere a pendência registrada em `docs/workout-methodology-phase-1.md`: as regras atuais não validam profundamente cada item interno de `workoutPlans`. Não declare essa validação concluída nem amplie gravações diretas para dados sensíveis sem uma solução de backend confiável

## Interface, acessibilidade e textos

- A interface e mensagens visíveis são em português do Brasil, salvo requisito contrário
- Não finalize textos de interface com ponto final
- Use componentes shadcn/ui e os padrões visuais existentes antes de criar controles próprios
- Use apenas tokens semânticos definidos em `src/app/globals.css` (`background`, `foreground`, `primary`, `muted`, `accent`, `sidebar`, `chart` etc.). Não use cores literais, paleta Tailwind avulsa ou `dark:`; o tema é controlado por variáveis CSS
- Preserve tema claro, escuro e sistema. Não use `!important`
- Interfaces devem funcionar em 320 px, mobile, tablet, desktop e telas largas: evite overflow horizontal, dimensões rígidas e ações inacessíveis. Prefira grid/flex responsivo, `minmax`, `min-w-0`, `max-w-*`, `flex-wrap`, `clamp()` e unidades `dvh/svh` quando adequadas
- Todo controle interativo precisa de rótulo acessível, foco visível, navegação por teclado, estado de carregamento/desabilitado e mensagem de erro compreensível
- Formulários com estado, validação ou envio devem usar React Hook Form integrado ao Zod. Erros de campo ficam próximos ao campo e erros globais usam o padrão de toast já existente
- Não oculte um erro de carregamento ou salvamento como se a operação tivesse sido concluída

## Convenções de código

- Arquivos e diretórios em inglês, kebab-case, exceto nomes exigidos pelo framework
- Use aliases existentes (`@/`); não crie novos aliases sem necessidade
- Tipos devem ser explícitos nas fronteiras (API, Firebase, props públicas e domínio). Prefira `z.infer` e tipos do domínio a duplicação manual
- Normalize entrada uma única vez perto da fronteira de escrita e valide dados externos antes de usá-los
- Preserve a configuração Biome: dois espaços, aspas duplas e ponto e vírgula somente quando necessário
- Evite componentes, hooks e funções excessivamente longos. Extraia cálculo, transformação ou regra de domínio quando isso reduzir responsabilidade e complexidade
- Não silencie erros com `any`, casts inseguros, catch vazio ou `@ts-ignore`

## Verificação e entrega

Após a alteração:

1. Revise o diff e confirme que somente arquivos do escopo foram modificados
2. Rode `npx tsc --noEmit` para alterações TypeScript
3. Rode `npm run build` quando a alteração afetar rotas, Next.js, API, Firebase, configuração ou integração entre módulos
4. Não execute o Biome (`npm run lint`, `npm run format` ou comandos `npx @biomejs/biome`): o usuário é responsável por essa verificação e formatação. Não execute uma reescrita global em um diretório com alterações fora do escopo
5. Para mudanças no Firestore ou API, confira autenticação, isolamento por usuário, validação de entrada, mensagens de erro e compatibilidade dos dados
6. Para interface, teste o fluxo principal e ao menos um viewport móvel

Se alguma verificação não puder ser executada, informe exatamente qual e o motivo. Ao finalizar, reporte: comportamento entregue, arquivos modificados, verificações executadas e pendências/riscos reais.
