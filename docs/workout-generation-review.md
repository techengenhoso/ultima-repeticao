# Fase 3 — Revisão da montagem automática

> A execução, o histórico e as sugestões de carga foram acrescentados na [Fase 4](workout-performance-phase-4.md). Este documento preserva o escopo e as decisões da Fase 3.

## Entrega

A sugestão gerada abre uma revisão editável, ainda em memória. O usuário pode alterar nome e descrição, renomear e reordenar dias, reordenar, adicionar, substituir e remover exercícios, além de ajustar séries, repetições e descanso. A carga aparece como **A definir** e permanece representada por zero no formato já existente.

A revisão reutiliza `WorkoutDayForm`, `WorkoutExerciseForm` e `WorkoutExerciseSelector`, os mesmos componentes do formulário manual. O contexto opcional de revisão acrescenta validação e mantém a edição manual disponível. A quantidade de dias permanece vinculada à prescrição original.

## Validação e biblioteca

O filtro de exercícios é compartilhado entre a montagem automática e a revisão. Exercícios padrão, personalizados e overrides são considerados; nível, exclusões musculares, movimentos excluídos e exercícios evitados continuam sendo respeitados. Novas seleções recebem valores iniciais permitidos pela prescrição, sujeitos à revalidação do plano inteiro.

Após cada edição, a ordem visual é normalizada, os snapshots são reconstruídos a partir da biblioteca carregada, e o motor da Fase 1 verifica estrutura, duplicidades, volume, distribuição, recuperação, duração e parâmetros dos exercícios. Não há chamada externa para validar edições. Referências ausentes ou incompatíveis bloqueiam o salvamento.

Cards mostram a divisão semanal, grupos musculares, quantidade de exercícios, duração estimada e séries semanais por grupo. Erros aparecem junto ao dia, exercício ou campo correspondente e impedem salvar. Avisos dentro dos limites permitidos exigem confirmação explícita. Campos estruturalmente inválidos devem ser corrigidos antes que o motor possa concluir a análise metodológica completa.

## Regeneração e cancelamento

Gerar novamente utiliza as respostas originais e exige confirmação quando a ficha foi editada. O formulário de revisão é substituído somente após uma geração bem-sucedida; falhas preservam todas as edições. Geração e salvamento bloqueiam ações concorrentes e fechamento do assistente.

Cancelar, fechar pelo botão, clicar fora ou usar Escape pede confirmação quando há respostas alteradas ou ficha gerada. Confirmar o descarte limpa somente o estado temporário do assistente e retorna à listagem. Nenhum documento temporário é criado. Recarregar ou sair da página ainda perde o estado em memória.

## Persistência

Somente **Confirmar e salvar**, ou a confirmação posterior dos avisos, chama `createWorkoutRepository`, também usado pela criação manual. A validação é repetida imediatamente antes da persistência. O UID vem do contexto autenticado e é comparado com o usuário atual do Firebase; as regras de acesso do Firestore continuam sendo a autoridade para acesso à coleção do proprietário.

O schema compartilhado remove campos estranhos à ficha antes da escrita em `users/{uid}/workoutPlans/{id}`. Respostas de triagem, informações de saúde, preferências temporárias e metadados da geração não são enviados ao repositório. A ficha recebe `isActive: false`, `createdAt: serverTimestamp()` e `updatedAt: serverTimestamp()`.

Cada revisão mantém um identificador de criação estável e uma trava durante o envio. A transação cria o documento somente se ele não existir. Repetir uma tentativa cuja escrita tenha sido concluída, mas cuja leitura tenha falhado, recupera o documento original sem duplicá-lo. Se o usuário editar a ficha entre as tentativas, a confirmação atualiza esse mesmo documento com as últimas edições, preservando sua data de criação e estado de ativação.

Após sucesso, o contexto atualiza a listagem, mostra o toast e abre o diálogo de detalhes existente. Não foi criada uma rota nova, pois a aplicação já apresenta detalhes por diálogo. Em caso de falha, o rascunho e suas edições permanecem disponíveis para nova tentativa.

## Estrutura atual

- Componentes do fluxo ficam em `src/components/workouts/generator`
- Casos de uso e schema de entrada ficam em `src/modules/workouts/application`
- Geração, filtros e revisão metodológica ficam em `src/modules/workouts/domain`

O resumo provisório foi substituído pela revisão completa. A montagem automática atual usa regras locais, sem provedor de IA.

## Limitações atuais

- A biblioteca utilizada na revisão é a biblioteca carregada na página; não há assinatura em tempo real de alterações feitas em outra sessão
- A validação metodológica das edições ocorre no cliente; a pendência de validação profunda das listas nas regras do Firestore permanece registrada na Fase 1
