# Fase 4 — Sessões, desempenho e progressão de carga

## Entrega e acesso

O repositório não possuía execução de treino, armazenamento de séries nem histórico funcional. Foram criados esses recursos mínimos, preservando as fichas e os componentes das fases anteriores.

Fluxo: **Fichas → detalhes da ficha → dia → Iniciar este treino**. A rota `/sessions/{id}` permite registrar carga, repetições e RIR percebido, marcar séries concluídas, acrescentar até cinco aquecimentos, repetir a carga anterior e iniciar o temporizador de descanso. RIR é opcional, inclusive nos aquecimentos, e nunca é preenchido por inferência.

**Salvar andamento** persiste a execução. **Histórico** permite retomar sessões em andamento e consultar as encerradas, com paginação de 20 registros. **Evolução** dá acesso ao mesmo histórico e à análise por exercício. Ao concluir, o resumo preserva as séries incompletas e permite abrir **Evolução e próxima carga** em cada exercício.

Nenhum teste, arquivo de teste, dependência de testes ou script de testes foi criado, conforme orientação expressa do usuário. Não houve commit, push ou publicação no Firebase.

## Modelo e persistência

Coleção: `users/{uid}/workoutSessions/{sessionId}`. Cada sessão guarda o proprietário, referências da ficha e dia, nomes históricos, início/encerramento, status, versão e exercícios com snapshots e metas. Cada série registra número, meta, repetições realizadas, carga, RIR opcional, conclusão e identificação de aquecimento. O relato de dor é apenas um booleano por exercício, sem texto clínico.

Os timestamps são produzidos pelo servidor e armazenados como `Timestamp`; a API usa milissegundos em JSON, validados com Zod. A data de encerramento também é usada nas sessões canceladas. Não são aceitos UID, snapshots, datas ou prescrições arbitrárias como autoridade do cliente.

A API `/api/workout-sessions` verifica o Firebase ID Token, inclusive revogação, e usa exclusivamente seu UID. A criação lê a ficha persistida e a biblioteca real, aplicando a normalização de documentos legados já existente. O salvamento preserva as metas, referências, snapshots e carga inicial do servidor; aceita somente o desempenho e o relato de dor editáveis. A decisão de carga é uma operação específica, permitida após a conclusão.

Schemas estritos limitam a sessão a 30 exercícios, 20 séries de trabalho e cinco de aquecimento por exercício. Carga: 0–1000 kg, até duas casas decimais; repetições: 0–100, sendo pelo menos uma em séries concluídas; RIR: inteiro de 0–5. Identificadores, estrutura, sequência, metas e estados também são verificados. O corpo da solicitação é limitado a 256 KiB.

As regras novas permitem leitura somente ao proprietário e **bloqueiam toda escrita direta do cliente** na coleção de sessões. Toda escrita passa pelo serviço autenticado com Admin e pela validação integral dos arrays. Isso evita repetir a limitação de expressões das regras de fichas registrada na Fase 1. A pendência das regras de `workoutPlans` continua separada e não foi alterada nesta fase.

Não foram encontrados modelos anteriores de sessões no repositório para migrar. Fichas legadas continuam usando a normalização de repetições e os defaults já estabelecidos. Sessões inválidas não são silenciosamente usadas como desempenho.

## Primeira carga e referência

Sem histórico e com carga inicial zero, a tela informa **Carga a definir** e orienta o registro conservador da carga realmente usada. O zero continua sendo uma carga válida para exercícios sem carga externa; não representa uma recomendação em quilogramas.

A referência seguinte vem da última sessão concluída com desempenho válido para a mesma referência `source + exerciseId`, ou da decisão explícita de carga registrada nela. Quando as cargas variam, a última série de trabalho concluída serve como referência, mas não autoriza progressão automática. Uma sessão que não executou esse exercício não apaga uma referência anterior disponível no histórico consultado.

As escolhas e configurações de incremento são preservadas para o próximo treino. A carga da ficha não é alterada. Cargas informadas manualmente continuam permitidas, mesmo quando diferentes da sugestão.

## Motor determinístico

O motor não chama IA e não envia desempenho ou relato de dor a provedores. As consultas consideram apenas sessões concluídas, usando a referência exata do exercício. Sessões canceladas, aquecimentos e séries incompletas não são interpretados como perda de força.

1. Sem dados válidos, com dor, prescrição diferente, séries de trabalho incompletas ou cargas variadas, retorna `insufficientData`
2. Com todas as séries no limite superior e nenhum RIR informado abaixo do alvo, indica aumento
3. Dentro da faixa, indica manutenção
4. Duas ou mais séries abaixo do mínimo, ou RIR informado abaixo do alvo, indicam esforço abaixo da meta de desempenho
5. Uma única sessão ruim mantém a carga; redução exige duas sessões consecutivas comparáveis, completas e na mesma carga
6. RIR ausente nunca vira zero; permite avaliação por repetições e carga, com confiança menor

Incrementos seguem a prioridade: incremento escolhido pelo usuário, incremento do equipamento, percentual conservador. O percentual padrão é 2,5%, configurável entre 0,5% e 5%. O arredondamento usa o equipamento, o incremento informado ou a unidade configurável de arredondamento (padrão de 0,5 kg). A interface pede conferir se a carga resultante está disponível. Reduções acima de 10% após arredondar são recusadas; aumentos acima de 10% também são recusados quando não há incremento expressamente escolhido pelo usuário. Nesses casos, sugere manutenção e permite escolha manual.

O retorno inclui ação, carga atual, eventual carga sugerida, motivo, confiança e IDs das sessões utilizadas. A API recalcula a sugestão ao aceitar e rejeita confirmação se a carga calculada mudou. A decisão só pode ser registrada na sessão concluída mais recente daquele exercício.

## Histórico e decisões

A análise consulta no máximo as 20 sessões concluídas mais recentes que contêm a referência exata, ordenadas por início. O índice composto está em `firestore.indexes.json`. A listagem geral é paginada; o recorte analítico de 20 sessões é mostrado explicitamente na interface.

Por exercício são exibidos data, cargas, repetições, séries concluídas, RIR, variação de carga no período, melhor série e sugestão atual. “Melhor série” significa maior carga, com repetições como desempate; não estima 1RM nem afirma melhora clínica. Se a referência aparece mais de uma vez na mesma sessão, o motor não mistura as duas execuções.

**Aceitar sugestão**, **Manter carga atual** e **Confirmar minha carga** gravam uma decisão individual, incluindo carga, escolha, configuração, sugestão e dados utilizados. Nenhuma sugestão é aplicada sem uma dessas ações explícitas.

## Concorrência e recuperação

A criação usa UUID estável durante a tentativa e transação para impedir duplicação por cliques/repetições. Cada gravação usa versão otimista: uma aba ou tentativa antiga não sobrescreve uma versão mais nova. Após falha, os valores locais permanecem; o editor oferece recarregar a versão salva com confirmação. A análise pode ser recalculada para recuperar a versão atual após uma resposta de decisão perdida.

O andamento não é salvo automaticamente. Navegar por links pode descartar alterações locais; a tela orienta salvar antes de sair e registra um aviso do navegador para recarga/fechamento com alterações. O cancelamento preserva a última versão salva, encerra a sessão como cancelada e exclui seus dados das sugestões. Não há exclusão de documentos.

## Configuração necessária

- Configurar as credenciais Firebase Admin já descritas na Fase 2, correspondentes ao projeto Firebase do aplicativo
- A identidade do servidor precisa ler fichas/biblioteca, verificar usuários e ler/gravar sessões no Firestore
- Publicar as regras e o índice composto declarados em `firebase.json` e aguardar a criação do índice
- Reiniciar ou publicar o servidor Next.js com essa configuração

A Fase 4 não precisa de chave de IA para executar sessões ou calcular progressão. A geração de fichas também foi substituída por [regras no navegador](workout-rule-generator.md), sem chave de IA. Nenhuma credencial ou índice foi publicado automaticamente nesta implementação.

## Arquivos

Criados:

- `src/lib/sessions/schemas.ts`
- `src/lib/sessions/progression.ts`
- `src/lib/sessions/client.ts`
- `src/lib/server/session-service.ts`
- `src/app/api/workout-sessions/route.ts`
- `src/app/(authenticated)/sessions/[id]/page.tsx`
- `src/components/sessions/start-session-button.tsx`
- `src/components/sessions/session-screen.tsx`
- `src/components/sessions/session-exercise-form.tsx`
- `src/components/sessions/rest-timer.tsx`
- `src/components/sessions/session-summary.tsx`
- `src/components/sessions/session-progression.tsx`
- `src/components/sessions/session-history.tsx`
- `firebase.json`
- `firestore.indexes.json`
- `docs/workout-performance-phase-4.md`

Alterados nesta fase:

- `src/components/workouts/workout-details.tsx`
- `src/app/(authenticated)/history/page.tsx`
- `src/app/(authenticated)/progress/page.tsx`
- `firestore.rules`
- `docs/workout-ai-phase-3.md`

## Verificações e limites restantes

- Biome restrito aos arquivos desta fase
- TypeScript e build de produção executados
- Diff revisado, sem alterações deliberadas fora do escopo
- Interface em cards, sem tabelas largas, campos em coluna no celular, labels e avisos acessíveis; barra inferior preservada
- Conferência visual da execução completa em 320 px e gravações reais continuam pendentes da configuração de Admin, índice e sessão autenticada disponível
- Sem funcionamento offline, autosave, bloqueio de navegação interna ou migração de sessões externas desconhecidas
- O painel inicial ainda contém os indicadores provisórios anteriores; o desempenho real está em Histórico/Evolução
- A progressão é uma sugestão simples, não considera técnica, fadiga geral, idade do histórico, pausas prolongadas ou mudanças de equipamento
- Para expansão futura: histórico analítico paginado por exercício, tratamento explícito de troca de equipamento e salvamento automático com recuperação de conflitos

Os documentos das quatro fases foram mantidos como registro da implementação e das pendências.
