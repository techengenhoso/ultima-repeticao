# Montagem automática sem API de IA

A integração com a OpenAI foi removida a pedido do usuário. O gerador transforma as respostas estruturadas do formulário em uma ficha utilizando a metodologia e a biblioteca de exercícios do próprio aplicativo. Não há modelo de linguagem, chamada a um provedor ou cobrança de API de IA.

## Armazenamento e custos

As regras ficam em `src/lib/workouts/methodology`, distribuídas com o aplicativo. Os exercícios padrão continuam em `src/seeds/default-exercises.ts`. Não é necessário salvar essas regras no Firestore ou contratar outro armazenamento.

A geração executa no navegador usando a biblioteca já carregada, incluindo personalizados e overrides. Não faz novas leituras no Firestore, não cria documentos e não depende do Firebase Admin. Salvar a ficha e usar sessões continuam utilizando os serviços existentes; os limites/custos de Firebase e hospedagem permanecem independentes da geração. Não há garantia de custo total zero desses serviços.

## Algoritmo

1. Valida o formulário e a triagem de segurança
2. Calcula a prescrição por objetivo, experiência, frequência, duração e prioridades
3. Filtra exercícios pela biblioteca real, nível, grupos/movimentos excluídos e exercícios evitados
4. Prioriza exercícios preferidos e compostos, com uma variação de ordem entre gerações
5. Procura distribuições do volume alvo nos dias compatíveis com a divisão semanal, preservando recuperação entre estímulos do mesmo grupo
6. Combina exercícios e séries dentro dos intervalos da prescrição, respeitando o limite de exercícios e o tempo estimado
7. Ordena compostos antes de isolados e valida a ficha inteira com o mesmo motor usado na revisão
8. Entrega apenas uma combinação sem erros; caso não encontre, pede ajuste das opções sem relaxar os limites

Repetições, descanso e RIR são escolhidos dentro das regras já existentes. A carga inicial permanece zero, a definir na execução. A busca tem limites de candidatos, alternativas e duração; não é um otimizador exaustivo e pode não encontrar uma combinação mesmo quando alguma solução teórica existe. Os limites tornam o processamento finito. Gerar novamente pode repetir uma ficha quando há poucas alternativas válidas.

As preferências orientam a seleção, mas não garantem a inclusão de todos os exercícios preferidos. Volume de grupos acessórios preferidos também precisa caber nos limites. A geração não interpreta pedidos em texto livre; o campo de observações para o antigo provedor foi retirado. A descrição continua editável na revisão.

## Interface e persistência

O botão agora é **Montar treino automaticamente**. Revisão, edição, regeneração, confirmação de avisos e salvamento permanecem disponíveis. O formato persistido não mudou. Alguns identificadores internos ainda usam o nome `ai` por compatibilidade organizacional; isso não representa uma conexão com IA.

A validação local não substitui controles de segurança no servidor. A pendência de validação profunda de `workoutPlans` registrada na Fase 1 continua existindo. As sessões da Fase 4 mantêm sua API validada com Firebase Admin.

## Alterações

- Criado `src/lib/workouts/methodology/generator.ts`
- `src/lib/workouts/ai/client.ts` passou a montar e validar localmente, sem `fetch`
- Atualizados formulário, rótulos e schemas do assistente
- Removidos `provider.ts`, `generate.ts`, `rate-limit.ts` e a rota `/api/ai/workout-plan`
- Removidas `AI_API_KEY` e `AI_MODEL` do exemplo e da configuração local, preservando a configuração Firebase
- Mantida a leitura de biblioteca no servidor, ainda necessária para iniciar sessões

## Verificações

Conferida a geração em memória com exercícios reais para hipertrofia/iniciante, 60 minutos, de duas a seis sessões por semana. Essas combinações passaram pelo validador. Nenhuma chamada externa, arquivo de testes ou dependência de testes foi criado nessa conferência. Lint, tipos e build integram a verificação final. A conferência visual completa em 320 px continua pendente.

Os documentos das fases anteriores são registros históricos; as instruções de chave e modelo OpenAI da Fase 2 não se aplicam mais.
