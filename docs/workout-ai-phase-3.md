# Fase 3 — Revisão, edição e salvamento

> A execução, o histórico e as sugestões de carga foram acrescentados na [Fase 4](workout-performance-phase-4.md). Este documento preserva o escopo e as decisões da Fase 3.

## Entrega

A sugestão gerada agora abre uma revisão editável, ainda em memória. O usuário pode alterar nome e descrição, renomear e reordenar dias, reordenar, adicionar, substituir e remover exercícios, além de ajustar séries, repetições, descanso e RIR. A carga aparece como **A definir** e permanece representada por zero no formato já existente. Não foi implementada progressão de carga nem a Fase 4.

A revisão reutiliza `WorkoutDayForm`, `WorkoutExerciseForm` e `WorkoutExerciseSelector`, os mesmos componentes do formulário manual. O contexto opcional de revisão acrescenta validação e mantém a edição manual disponível. A quantidade de dias permanece vinculada à prescrição original.

## Validação e biblioteca

O filtro de exercícios da Fase 2 foi extraído para um módulo compartilhado entre servidor e revisão. Exercícios padrão, personalizados e overrides são considerados; nível, exclusões musculares, movimentos excluídos e exercícios evitados continuam sendo respeitados. Novas seleções recebem valores iniciais permitidos pela prescrição, sujeitos à revalidação do plano inteiro.

Após cada edição, a ordem visual é normalizada, os snapshots são reconstruídos a partir da biblioteca carregada, e o motor da Fase 1 verifica estrutura, duplicidades, volume, distribuição, recuperação, duração e parâmetros dos exercícios. Não há nova chamada à IA para validar edições. Referências ausentes ou incompatíveis bloqueiam o salvamento.

Cards mostram a divisão semanal, grupos musculares, quantidade de exercícios, duração estimada e séries semanais por grupo. Erros aparecem junto ao dia, exercício ou campo correspondente e impedem salvar. Avisos dentro dos limites permitidos exigem confirmação explícita. Campos estruturalmente inválidos devem ser corrigidos antes que o motor possa concluir a análise metodológica completa.

## Regeneração e cancelamento

Gerar novamente utiliza as respostas originais e exige confirmação quando a ficha foi editada. O formulário de revisão é substituído somente após uma geração bem-sucedida; falhas preservam todas as edições. Geração e salvamento bloqueiam ações concorrentes e fechamento do assistente.

Cancelar, fechar pelo botão, clicar fora ou usar Escape pede confirmação quando há respostas alteradas ou ficha gerada. Confirmar o descarte limpa somente o estado temporário do assistente e retorna à listagem. Nenhum documento temporário é criado. Recarregar ou sair da página ainda perde o estado em memória.

## Persistência

Somente **Confirmar e salvar**, ou a confirmação posterior dos avisos, chama `createWorkoutRepository`, também usado pela criação manual. A validação é repetida imediatamente antes da persistência. O UID vem do contexto autenticado e é comparado com o usuário atual do Firebase; as regras de acesso do Firestore continuam sendo a autoridade para acesso à coleção do proprietário.

O schema compartilhado remove campos estranhos à ficha antes da escrita em `users/{uid}/workoutPlans/{id}`. Respostas de triagem, informações de saúde, preferências temporárias e timestamps da IA não são enviados ao repositório. A ficha recebe `isActive: false`, `createdAt: serverTimestamp()` e `updatedAt: serverTimestamp()`.

Cada revisão mantém um identificador de criação estável e uma trava durante o envio. A transação cria o documento somente se ele não existir. Repetir uma tentativa cuja escrita tenha sido concluída, mas cuja leitura tenha falhado, recupera o documento original sem duplicá-lo. Se o usuário editar a ficha entre as tentativas, a confirmação atualiza esse mesmo documento com as últimas edições, preservando sua data de criação e estado de ativação.

Após sucesso, o contexto atualiza a listagem, mostra o toast e abre o diálogo de detalhes existente. Não foi criada uma rota nova, pois a aplicação já apresenta detalhes por diálogo. Em caso de falha, o rascunho e suas edições permanecem disponíveis para nova tentativa.

## Arquivos desta fase

Criados:

- `src/components/workouts/ai/workout-ai-review.tsx`
- `src/components/workouts/ai/workout-review-context.tsx`
- `src/lib/workouts/ai/available-exercises.ts`
- `src/lib/workouts/ai/review.ts`
- `docs/workout-ai-phase-3.md`

Alterados:

- `src/components/workouts/ai/workout-ai-assistant.tsx`
- `src/components/workouts/workout-day-form.tsx`
- `src/components/workouts/workout-exercise-form.tsx`
- `src/components/workouts/workout-exercise-selector.tsx`
- `src/contexts/workout-context.tsx`
- `src/repositories/workout-repository.ts`
- `src/lib/workouts/ai/library.ts`
- `docs/workout-ai-phase-2.md`

O resumo provisório `workout-ai-summary.tsx` foi substituído pela revisão completa. As alterações preexistentes das Fases 1 e 2 e o placeholder do formulário manual foram preservados.

## Verificações e limitações

- Nenhum arquivo, script ou comando de testes foi criado, conforme orientação do usuário
- Biome aplicado somente aos arquivos do escopo
- TypeScript verificado com `npx tsc --noEmit`
- Build de produção concluída com sucesso; `git diff --check` sem erros de whitespace
- Layout em cards, campos em coluna nas telas pequenas e cabeçalhos com quebra de linha; barra inferior existente preservada
- Conferência visual de ponta a ponta em 320 px e geração/salvamento reais pendentes: faltam configuração de IA/Admin e uma sessão com ficha gerada disponível para inspeção
- A biblioteca utilizada na revisão é a biblioteca carregada na página; não há assinatura em tempo real de alterações feitas em outra sessão
- A validação metodológica das edições ocorre no cliente; a pendência de validação profunda das listas nas regras do Firestore permanece registrada na Fase 1, conforme decisão expressa do usuário de manter o escopo
- Nenhuma alteração nas regras do Firestore nesta fase, nenhum commit e nenhum push

Este documento deve permanecer até a conclusão das implementações.
