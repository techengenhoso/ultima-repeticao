# Fase 1 — Metodologia de fichas

## Uso deste documento

Manter este documento como referência até finalizar as implementações, conforme solicitação do usuário. Atualizar entregas, decisões e pendências ao avançar cada fase. As fases serão implementadas uma por vez.

## Estado das fases

- Fase 1: modelo, formulário manual, motor determinístico e validadores implementados, com a pendência de validação de gravação descrita abaixo
- Fase 2: assistente, preparação da biblioteca e integração implementados; configuração de credenciais e conferência visual pendentes — detalhes em [workout-ai-phase-2.md](workout-ai-phase-2.md)
- Fase 3: revisão, edição e salvamento explícito da ficha gerada — não implementada
- Fase 4: registro de desempenho, definição de carga e sugestões determinísticas de progressão — não implementada

## Escopo e integração

O motor está em `src/lib/workouts/methodology`, junto ao domínio existente de fichas. Não importa Firebase, componentes React, serviços de rede ou provedores de IA. `createWorkoutPrescription` valida entradas com Zod. `validateWorkoutPlan` recebe uma ficha, a prescrição e um mapa `source:exerciseId → compound | isolation`, retornando problemas com código, severidade, caminho e mensagem em português. Os validadores de exercício, volume e recuperação também podem ser usados separadamente.

A biblioteca atual tem `movementPattern` textual, mas não classificação confiável de composto/isolado. O chamador deve fornecer metadados revisados; classificação ausente impede aprovação da ficha. Na Fase 2, referências e snapshots deverão ser reconstruídos da biblioteca real, com overrides e exercícios personalizados. Não há inferência por nome.

## Decisões metodológicas

- As faixas por objetivo seguem o pedido. Para objetivos sem volume semanal explicitado, foram adotados limites conservadores: até 14 séries para força, emagrecimento e condicionamento; 4–8 para qualidade de vida
- Hipertrofia usa os limites por experiência, começando no mínimo. Especialistas só recebem teto de 20 com pelo menos quatro dias e 60 minutos; o alvo não passa automaticamente a 20
- Contagem de volume: séries diretas atribuídas ao grupo do snapshot, sem inventar créditos de músculos secundários. Os mínimos se aplicam aos grupos principais (peito, costas, quadríceps, posteriores, glúteos e ombros) e aos grupos priorizados. Grupos acessórios têm mínimo/alvo zero e o mesmo teto da experiência; isso evita exigir exercícios isolados para todos os grupos. `fullBody` não substitui a cobertura dos grupos anatômicos
- Uma prioridade eleva o alvo em duas séries dentro do teto. Exclusões zeram mínimo, alvo e máximo. Sobreposição entre prioridade e exclusão é inválida
- Divisões são sugestões, não regras rígidas de seleção de grupos por dia. Há calendário semanal sugerido para avaliação da recuperação. Sete dias disponíveis representam seis sessões e um dia de recuperação, sem criar um dia vazio incompatível com o modelo atual
- Três dias consideram experiência e duração. Orientações complementares consideram objetivo e prioridades. Dois estímulos por grupo são preferenciais: frequência menor gera aviso
- Estímulo intenso é definido operacionalmente como pelo menos três séries com RIR até três para o mesmo grupo; o validador rejeita esses estímulos em dias consecutivos, inclusive na passagem de semana
- Duração é aproximada: cinco minutos iniciais, quatro segundos por repetição no limite superior, descanso entre séries e um minuto entre exercícios. Não é uma garantia fisiológica ou medição real
- Limite de exercícios considera duração, descanso dos compostos e experiência. Entradas incompatíveis com o volume conservador recebem `feasibilityWarnings`; o consumidor deve revisar as condições antes de gerar. Os limites não são relaxados silenciosamente
- Erros impedem aprovação metodológica; frequência e alvo conservador não atingidos geram avisos. O formulário manual continua usando os limites gerais do domínio, sem exigir um objetivo que ainda não coleta

## Compatibilidade

O formato de `users/{uid}/workoutPlans/{id}` permanece com dias e exercícios embutidos. `restSeconds` é opcional, entre 30 e 600; `targetRir` é opcional, inteiro entre 0 e 5. `initialLoad` continua aceitando zero.

O schema de escrita não aplica padrões. Na leitura, documentos sem os campos recebem descanso de 90 segundos e RIR 2 em memória; carga ausente continua recebendo zero. Esses valores são padrões de compatibilidade, não uma prescrição por objetivo. Valores existentes são preservados. Não há escrita ao consultar documentos.

Repetições passam a texto, aceitando quantidade única ou faixa crescente de 1 a 100 (`12`, `8-12`, `8–12`). Números antigos são convertidos para texto na leitura. Textos antigos de até 30 caracteres continuam legíveis; se não representarem uma faixa válida, a edição pede correção antes de salvar. Somente o salvamento explícito persiste o formato normalizado. Nenhuma migração em lote é necessária para esses campos.

## Pendência do Firestore

As regras receberam os campos opcionais na função `validExercise`, mas há uma pendência arquitetural: as funções de validação dos itens já não eram chamadas pela regra de salvamento. Conectar as funções e percorrer todos os itens foi testado no emulador e excedeu o limite de 1.000 expressões já com dois dias e seis exercícios. Essa conexão foi retirada para não bloquear fichas válidas. Portanto, **a validação dos campos internos ainda não é garantida pelas regras**.

Para concluir com segurança mantendo 14 dias × 30 exercícios e o formato embutido, a solução proposta é validar o salvamento em um backend confiável e impedir gravações diretas que contornem essa validação. O usuário decidiu manter o escopo da Fase 1 e registrar essa mudança de arquitetura como pendência, sem implementar salvamento no servidor nesta fase. Na Fase 2, Firebase Admin foi adicionado exclusivamente para verificar tokens e ler a biblioteca; a pendência de salvamento continua aberta. Nenhuma regra foi publicada e nenhum dado real foi acessado. Os testes do emulador usaram exclusivamente `demo-ultima-repeticao`.

Essa pendência deve ser retomada antes de considerar a validação de gravação concluída.

## Arquivos

Criados:

- `src/lib/workouts/repetitions.ts`
- `src/lib/workouts/document-schema.ts`
- `src/lib/workouts/methodology/types.ts`
- `src/lib/workouts/methodology/prescription.ts`
- `src/lib/workouts/methodology/validation.ts`
- `docs/workout-methodology-phase-1.md`

Alterados:

- `src/lib/workouts/types.ts`
- `src/lib/workouts/schemas.ts`
- `src/repositories/workout-repository.ts`
- `src/components/workouts/workout-exercise-form.tsx`
- `src/components/workouts/workout-exercise-selector.tsx`
- `src/components/workouts/workout-exercise-details.tsx`
- `firestore.rules`

A alteração preexistente em `src/components/workouts/workout-form.tsx` foi preservada e não integra a implementação.

## Verificações e decisões posteriores

Durante a implementação, 52 testes unitários, lint restrito ao escopo, checagem de tipos e build passaram. A validação no emulador revelou a limitação das regras descrita acima. Esses resultados são registros das verificações executadas naquele momento.

Os arquivos de testes, o adaptador TypeScript e o comando `npm test` foram removidos posteriormente por solicitação do usuário. Nenhuma dependência de testes foi adicionada ao projeto. A restauração deste documento não restaura os testes.

O documento foi restaurado a pedido do usuário para apoiar a continuidade das quatro fases. Não foram feitos commit, push ou deploy nesta implementação.
