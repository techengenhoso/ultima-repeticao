# Fase 2 — Assistente de criação de treinos

> **Integração OpenAI removida**: o fluxo atual usa [montagem por regras no navegador](workout-rule-generator.md), sem chave de IA ou requisições pagas. A configuração de provedor abaixo é somente o registro histórico da implementação anterior.

> Registro da entrega original da Fase 2. A revisão, edição, confirmação de descarte, regeneração e salvamento foram acrescentados na [Fase 3](workout-ai-phase-3.md), que substituiu o resumo provisório descrito abaixo.

## Estado e escopo

Implementado o botão `Criar treino com IA`, com três etapas em React Hook Form e Zod: planejamento, preferências/movimentos e segurança. A ficha validada fica somente no estado do componente, com resumo de dias e grupos musculares. Fechar o diálogo preserva as respostas e o resultado enquanto a página continuar montada; sair da página ou recarregar descarta o estado. Trocar de usuário remonta o assistente.

Esta fase não salva fichas, documentos temporários ou informações de saúde no Firestore. Não adiciona edição/revisão completa, progressão ou regeneração de uma ficha já aprovada. Após erro, o formulário permanece preenchido e permite nova tentativa. A Fase 3 continua pendente.

Não foram criados testes, scripts de teste ou comando `npm test`, conforme instrução do usuário. Este documento deve ser mantido até concluir as implementações.

## Servidor e provedor

`POST /api/ai/workout-plan` executa em Node.js, recebe Firebase ID Token no cabeçalho `Authorization: Bearer ...` e verifica assinatura, validade, revogação e usuário desativado pelo Firebase Admin. O UID é obtido exclusivamente do token; o schema estrito não aceita UID ou campos extras enviados no corpo.

A configuração Admin é inicializada sob demanda em `src/lib/server/firebase-admin.ts`, sem importar o SDK do cliente. Isso permite gerar a build sem segredos. O Admin lê apenas `users/{uid}/exercises` e `users/{uid}/exerciseOverrides`. Não altera o fluxo manual de salvamento nem resolve a pendência das regras registrada na Fase 1.

O provedor inicial é OpenAI, isolado pela interface `WorkoutAiProvider` em `src/lib/workouts/ai/provider.ts`. Para trocar o provedor, implemente essa interface e ajuste `getWorkoutAiProvider`, preservando todos os filtros e validadores externos a ela.

A chamada usa Responses API com Structured Outputs, schema derivado de Zod, `strict: true` e `store: false`, conforme a [documentação oficial de respostas estruturadas](https://developers.openai.com/api/docs/guides/structured-outputs). Nenhuma regra numérica de metodologia é recriada no prompt: o servidor envia a prescrição calculada pelo motor da Fase 1. Textos do usuário e da biblioteca são tratados como dados, não instruções. O modelo não recebe token Firebase, UID ou as respostas dos campos de triagem/saúde.

`store: false` desabilita o armazenamento do objeto de resposta pela API; não deve ser interpretado como garantia de ausência de qualquer retenção operacional pelo provedor.

## Configuração

Dependências adicionadas: `firebase-admin` e `server-only`. A integração HTTP usa `fetch`, sem SDK adicional de IA.

Copie `.env.example` para `.env.local` e configure:

| Variável | Uso |
| --- | --- |
| `AI_API_KEY` | Chave da API OpenAI, somente no servidor |
| `AI_MODEL` | Identificador de modelo habilitado na conta, compatível com Responses e Structured Outputs |
| `FIREBASE_ADMIN_PROJECT_ID` | Projeto do Firebase Auth usado pelo aplicativo |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | E-mail de conta de serviço, quando usar credencial explícita |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Chave privada correspondente, com quebras reais ou `\n` escapado |
| `GOOGLE_APPLICATION_CREDENTIALS` | Alternativa local: caminho para arquivo de credencial fora do repositório, usando ADC |

Use o par e-mail/chave ou Application Default Credentials. Em um ambiente Google com identidade de serviço configurada, ADC pode ser fornecida pela plataforma. A identidade precisa das permissões necessárias para verificar o usuário e ler as duas coleções. O projeto Admin deve corresponder ao Firebase configurado em `src/lib/firebase.ts`.

Não use `NEXT_PUBLIC_` para esses segredos, não versionar `.env.local` nem arquivos de conta de serviço. Reinicie o servidor após configurar as variáveis. O ambiente de hospedagem deve permitir uma rota de até 90 segundos. Não é necessário preencher segredos para executar a build, mas eles são necessários para gerar uma ficha real.

## Limites operacionais

- Corpo JSON limitado a 32 KiB, inclusive quando transmitido sem `Content-Length`
- Prazo total de 80 segundos no servidor; o cliente cancela a chamada após 85 segundos
- Até três tentativas autenticadas por usuário a cada dez minutos e uma geração simultânea por usuário
- Rate limit em memória, limitado a 5.000 usuários por processo e limpo por expiração; não grava documentos
- **O limitador não é distribuído e reinicia com o processo**: usar somente em uma instância persistente; antes de hospedar com várias instâncias/serverless, substituir por um armazenamento compartilhado, mantendo a interface de aquisição/liberação
- Leitura limitada a 500 exercícios personalizados e 500 overrides; biblioteca acima desse limite é recusada
- Solicitação ao provedor limitada a 500 KB; resposta limitada a 512 KB e saída a 12.000 tokens
- Erros sem tokens, prompts, chaves ou detalhes técnicos do provedor; respostas HTTP com `Cache-Control: no-store`

## Preparação da biblioteca

A normalização legada de exercícios foi extraída de `exercise-repository.ts` para `src/lib/exercises/normalize.ts` e reutilizada sem alterar o comportamento da biblioteca manual.

O servidor carrega os padrões, aplica overrides, adiciona personalizados e valida os campos com Zod. Filtra referências evitadas, grupos excluídos, músculos primários/secundários associados aos grupos excluídos na biblioteca padrão e padrões de movimento selecionados. As exclusões de músculos são conservadoras e podem reduzir bastante a biblioteca.

Dificuldade permitida: iniciante recebe fácil; básico/intermediário recebem fácil ou moderada; avançado/especialista recebem todas. Exercícios preferidos incompatíveis são recusados com mensagem para revisar a seleção.

Uma tabela explícita de padrões dinâmicos em `movement-classification.ts` fornece `compound` ou `isolation` ao validador da Fase 1. Não utiliza nome ou equipamento para classificar. Padrões desconhecidos, isometrias e movimentos explosivos/olímpicos não listados ficam fora da geração. Personalizados e overrides com padrões conhecidos podem participar. A tabela não é uma avaliação profissional de cada execução individual.

## Segurança e validação

A interface coleta as sete situações de bloqueio do requisito e exige confirmação de revisão. Qualquer situação marcada ou texto no campo de dores/lesões interrompe a geração. Uma detecção textual complementar também bloqueia termos de saúde no nome/observações. Essa detecção não é diagnóstico nem uma garantia de compreensão de texto livre; o fluxo depende de informações corretas do usuário.

Limitações são coletadas como padrões de movimento a excluir por inteiro. Condições que exijam outra adaptação são bloqueadas. O aviso educativo aparece no assistente e no resumo. Relatos de saúde não são enviados ao provedor; observações devem conter somente preferências de organização, conforme orientação da interface.

Antes de chamar o provedor, o servidor executa a prescrição, recusa as incompatibilidades de tempo/volume sinalizadas pelo motor e verifica se há exercícios compatíveis para os grupos obrigatórios.

Após a chamada, valida JSON, formato estrito, referências permitidas, ordem sequencial e todos os limites pelo motor da Fase 1: séries, repetições, descanso, RIR, duplicidade, volume, distribuição, recuperação e duração. Qualquer erro descarta a resposta inteira. Avisos não impeditivos são apresentados no resumo.

IDs dos dias e itens são gerados com `randomUUID`; snapshots vêm da biblioteca real; carga é sempre zero. A resposta do modelo não aceita IDs internos, carga, timestamps, `isActive` ou snapshots.

## Arquivos da Fase 2

Criados:

- `src/app/api/ai/workout-plan/route.ts`
- `src/lib/server/firebase-admin.ts`
- `src/lib/workouts/ai/client.ts`
- `src/lib/workouts/ai/generate.ts`
- `src/lib/workouts/ai/http.ts`
- `src/lib/workouts/ai/library.ts`
- `src/lib/workouts/ai/movement-classification.ts`
- `src/lib/workouts/ai/provider.ts`
- `src/lib/workouts/ai/rate-limit.ts`
- `src/lib/workouts/ai/safety.ts`
- `src/lib/workouts/ai/schemas.ts`
- `src/components/workouts/ai/workout-ai-assistant.tsx`
- `src/components/workouts/ai/workout-ai-fields.tsx`
- `src/components/workouts/ai/workout-ai-summary.tsx`
- `.env.example`
- `docs/workout-ai-phase-2.md`

Alterados:

- `src/components/workouts/workouts-filter.tsx`
- `src/lib/exercises/normalize.ts`
- `src/repositories/exercise-repository.ts`
- `package.json` e `package-lock.json`
- `.gitignore`
- `docs/workout-methodology-phase-1.md`

As alterações preexistentes da Fase 1 e o placeholder alterado pelo usuário em `workout-form.tsx` foram preservados.

## Verificações e pendências

- Lint restrito ao escopo aprovado
- Checagem de tipos aprovada
- Build de produção aprovada, com `/api/ai/workout-plan` reconhecido como rota dinâmica
- Nenhum teste criado ou executado nesta fase
- Geração real não exercitada: variáveis de IA/Admin ainda não configuradas
- Conferência visual em 320 px não realizada: Computer Use interrompeu a inspeção por não conseguir identificar a URL do navegador com segurança; o layout foi revisado no código para empilhar campos e botões e limitar a rolagem do diálogo
- Sem commit, push, deploy ou gravação de fichas
