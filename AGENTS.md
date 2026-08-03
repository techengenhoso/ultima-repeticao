# Última Repetição — Instruções para agentes de IA

## Escopo

Antes de alterar qualquer código, explore os arquivos relacionados e preserve os
padrões já adotados. Não modifique arquivos sem relação com a tarefa e não reverta
alterações existentes feitas pelo usuário.

## Visão geral do projeto

Última Repetição é uma aplicação web para acompanhamento de treinos de musculação e
evolução do usuário. O repositório contém uma única aplicação, não um monorepo.

Stack principal:

- Next.js 16 com App Router;
- React 19 e TypeScript em modo estrito;
- Tailwind CSS 4;
- shadcn/ui com primitives do Radix UI e ícones Lucide;
- Biome para formatação e análise estática;
- next-themes para os temas claro, escuro e do sistema;
- Firebase para os serviços de backend da aplicação;
- Zod para definição de schemas e validação de dados;
- React Hook Form para gerenciamento de formulários.

Estrutura relevante:

- `src/app`: rotas, layouts, páginas e estilos globais;
- `src/components`: componentes compartilhados da aplicação;
- `src/components/ui`: componentes de interface gerados ou adaptados do shadcn/ui;
- `src/lib`: funções utilitárias;
- `public`: arquivos estáticos.

## Convenções de implementação

- Nomeie arquivos e diretórios em inglês, usando letras minúsculas e palavras
  separadas por hífen (kebab-case), salvo nomes especiais exigidos pelo framework.

- Prefira Server Components. Adicione `"use client"` somente quando o componente
  depender de estado, efeitos, eventos do navegador ou APIs exclusivamente do cliente.

- Reutilize componentes e utilitários existentes antes de criar novas abstrações.

- Use os componentes do shadcn/ui para elementos de interface e preserve o estilo
  visual configurado no projeto.

- Utilize exclusivamente as cores semânticas já definidas em `src/app/globals.css`,
  como `primary`, `background`, `foreground`, `muted`, `accent`, `sidebar` e `chart`.
  Não use cores avulsas da paleta do Tailwind, valores literais de cor ou variantes
  `dark:` nos componentes; os temas devem ser controlados pelas variáveis CSS globais.

- Utilize os serviços do Firebase para autenticação, persistência, armazenamento e
  demais recursos de backend quando essas capacidades forem necessárias. Centralize
  a configuração e o acesso aos serviços, reutilizando os módulos existentes.

- Valide dados de entrada e dados vindos de fontes externas com schemas do Zod.
  Reutilize os mesmos schemas entre cliente e servidor quando isso for apropriado.

- Use React Hook Form para lidar com formulários que exijam estado, validação ou
  tratamento de envio. Integre-o ao Zod para manter as regras de validação
  centralizadas sempre que necessário.

- Utilize os aliases de importação já criados e não fique criando novos nas configurações.

- Mantenha a aplicação e os textos de interface em português do Brasil, salvo quando
  o requisito pedir outro idioma.

- Não termine frases ou mensagens visíveis na interface com ponto final.

- Preserve a acessibilidade e o comportamento responsivo ao criar interfaces.

- Siga a configuração do Biome: indentação de dois espaços, aspas duplas e sem
  ponto e vírgula quando ele não for necessário.

- Faça alterações pequenas, focadas e compatíveis com a arquitetura atual.

## Comandos do projeto

- `npm run dev`: inicia o servidor de desenvolvimento;
- `npm run build`: gera a build de produção e valida a integração do Next.js;
- `npm run lint`: executa o Biome com correções automáticas;
- `npm run format`: formata os arquivos com o Biome;
- `npx tsc --noEmit`: valida os tipos sem gerar arquivos.

Os comandos `lint` e `format` alteram arquivos. Antes de executá-los no repositório
inteiro, verifique se isso não modificará arquivos fora do escopo da tarefa; quando
possível, valide apenas os arquivos alterados.

## Processo de trabalho

## Processo de trabalho

1. Leia todos os arquivos `AGENTS.md` aplicáveis.
2. Explore os arquivos relacionados e identifique componentes e utilitários reutilizáveis.
3. Consulte a documentação oficial ou os tipos instalados quando houver dúvida sobre o Next.js.
4. Implemente a menor alteração que satisfaça o requisito, utilizando shadcn/ui quando aplicável.
5. Valide formatação e tipos; execute a build na proporção do risco.
6. Revise o diff para identificar alterações acidentais.
7. Informe os arquivos modificados e as verificações executadas.

Quando um requisito estiver ambíguo, preserve a arquitetura atual e escolha a solução de menor impacto.
