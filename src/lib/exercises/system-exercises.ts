import type { SystemExercise } from "@/lib/exercises/types"

export const systemExercises: SystemExercise[] = [
  {
    id: "system-ab-wheel",
    source: "system",
    name: "Ab Wheel",
    muscleGroup: "core",
    primaryMuscles: ["Reto Abdominal", "Transverso"],
    secondaryMuscles: ["Latíssimo", "Serrátil", "Ombros", "Glúteos"],
    level: "advanced",
    movementPattern: "Anti-extensão dinâmica",
    startingPosition:
      "Organize costelas e pelve, contraia o abdome e mantenha a respiração contínua",
    movementExecution:
      "Execute o movimento ou sustente a posição sem perder o alinhamento lombopélvico, avançando apenas até onde mantém controle",
    importantCautions:
      "Evite prender a respiração, arquear a lombar ou compensar com pescoço e ombros; encerre a série ao perder a postura",
  },
  {
    id: "system-abdominal-crunch",
    source: "system",
    name: "Abdominal Crunch",
    muscleGroup: "core",
    primaryMuscles: ["Reto Abdominal"],
    secondaryMuscles: ["Oblíquos", "Transverso"],
    level: "beginner",
    movementPattern: "Flexão de tronco",
    startingPosition:
      "Organize costelas e pelve, contraia o abdome e mantenha a respiração contínua",
    movementExecution:
      "Execute o movimento ou sustente a posição sem perder o alinhamento lombopélvico, avançando apenas até onde mantém controle",
    importantCautions:
      "Evite prender a respiração, arquear a lombar ou compensar com pescoço e ombros; encerre a série ao perder a postura",
  },
  {
    id: "system-abducao-de-quadril",
    source: "system",
    name: "Abdução de Quadril",
    muscleGroup: "glutes",
    primaryMuscles: ["Glúteo Médio", "Glúteo Mínimo"],
    secondaryMuscles: ["Tensor da Fáscia Lata"],
    level: "beginner",
    movementPattern: "Abdução de quadril",
    startingPosition:
      "Adote postura estável, mantenha pescoço relaxado e escápulas controladas antes de mover o braço ou a perna",
    movementExecution:
      "Conduza o segmento no plano indicado, com velocidade constante e amplitude sem dor; retorne resistindo à carga",
    importantCautions:
      "Evite compensar com inclinação ou rotação do tronco e não ultrapasse a amplitude que preserve a articulação confortável",
  },
  {
    id: "system-abducao-lateral-deitada",
    source: "system",
    name: "Abdução Lateral Deitada",
    muscleGroup: "glutes",
    primaryMuscles: ["Glúteo Médio"],
    secondaryMuscles: ["Glúteo Mínimo", "Tensor da Fáscia Lata"],
    level: "beginner",
    movementPattern: "Abdução lateral",
    startingPosition:
      "Adote postura estável, mantenha pescoço relaxado e escápulas controladas antes de mover o braço ou a perna",
    movementExecution:
      "Conduza o segmento no plano indicado, com velocidade constante e amplitude sem dor; retorne resistindo à carga",
    importantCautions:
      "Evite compensar com inclinação ou rotação do tronco e não ultrapasse a amplitude que preserve a articulação confortável",
  },
  {
    id: "system-adutora-de-quadril",
    source: "system",
    name: "Adutora de Quadril",
    muscleGroup: "adductors",
    primaryMuscles: ["Adutores do Quadril"],
    secondaryMuscles: ["Grácil", "Pectíneo"],
    level: "beginner",
    movementPattern: "Adução de quadril",
    startingPosition:
      "Adote postura estável, mantenha pescoço relaxado e escápulas controladas antes de mover o braço ou a perna",
    movementExecution:
      "Conduza o segmento no plano indicado, com velocidade constante e amplitude sem dor; retorne resistindo à carga",
    importantCautions:
      "Evite compensar com inclinação ou rotação do tronco e não ultrapasse a amplitude que preserve a articulação confortável",
  },
  {
    id: "system-afundo",
    source: "system",
    name: "Afundo",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps", "Glúteo Máximo"],
    secondaryMuscles: ["Adutores", "Posteriores", "Panturrilhas", "Core"],
    level: "intermediate",
    movementPattern: "Avanço",
    startingPosition:
      "Mantenha os pés firmes, joelhos alinhados à direção dos pés, coluna neutra e abdome ativo",
    movementExecution:
      "Flexione quadris e joelhos com controle, distribua a pressão por todo o pé e suba estendendo as pernas sem perder o alinhamento",
    importantCautions:
      "Evite colapsar os joelhos para dentro, levantar os calcanhares ou arredondar a lombar; ajuste a amplitude à sua mobilidade",
  },
  {
    id: "system-afundo-lateral",
    source: "system",
    name: "Afundo Lateral",
    muscleGroup: "adductors",
    primaryMuscles: ["Adutores", "Glúteo Máximo"],
    secondaryMuscles: ["Quadríceps", "Posteriores", "Core"],
    level: "intermediate",
    movementPattern: "Avanço lateral",
    startingPosition:
      "Mantenha os pés firmes, joelhos alinhados à direção dos pés, coluna neutra e abdome ativo",
    movementExecution:
      "Flexione quadris e joelhos com controle, distribua a pressão por todo o pé e suba estendendo as pernas sem perder o alinhamento",
    importantCautions:
      "Evite colapsar os joelhos para dentro, levantar os calcanhares ou arredondar a lombar; ajuste a amplitude à sua mobilidade",
  },
  {
    id: "system-afundo-reverso",
    source: "system",
    name: "Afundo Reverso",
    muscleGroup: "glutes",
    primaryMuscles: ["Glúteo Máximo", "Quadríceps"],
    secondaryMuscles: ["Adutores", "Posteriores", "Core"],
    level: "intermediate",
    movementPattern: "Avanço reverso",
    startingPosition:
      "Mantenha os pés firmes, joelhos alinhados à direção dos pés, coluna neutra e abdome ativo",
    movementExecution:
      "Flexione quadris e joelhos com controle, distribua a pressão por todo o pé e suba estendendo as pernas sem perder o alinhamento",
    importantCautions:
      "Evite colapsar os joelhos para dentro, levantar os calcanhares ou arredondar a lombar; ajuste a amplitude à sua mobilidade",
  },
  {
    id: "system-agachamento-bulgaro",
    source: "system",
    name: "Agachamento Búlgaro",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps", "Glúteo Máximo"],
    secondaryMuscles: ["Adutores", "Posteriores", "Core"],
    level: "intermediate",
    movementPattern: "Agachar unilateral",
    startingPosition:
      "Mantenha os pés firmes, joelhos alinhados à direção dos pés, coluna neutra e abdome ativo",
    movementExecution:
      "Flexione quadris e joelhos com controle, distribua a pressão por todo o pé e suba estendendo as pernas sem perder o alinhamento",
    importantCautions:
      "Evite colapsar os joelhos para dentro, levantar os calcanhares ou arredondar a lombar; ajuste a amplitude à sua mobilidade",
  },
  {
    id: "system-agachamento-cossaco",
    source: "system",
    name: "Agachamento Cossaco",
    muscleGroup: "adductors",
    primaryMuscles: ["Adutores", "Quadríceps"],
    secondaryMuscles: ["Glúteos", "Posteriores", "Core"],
    level: "advanced",
    movementPattern: "Agachar lateral",
    startingPosition:
      "Mantenha os pés firmes, joelhos alinhados à direção dos pés, coluna neutra e abdome ativo",
    movementExecution:
      "Flexione quadris e joelhos com controle, distribua a pressão por todo o pé e suba estendendo as pernas sem perder o alinhamento",
    importantCautions:
      "Evite colapsar os joelhos para dentro, levantar os calcanhares ou arredondar a lombar; ajuste a amplitude à sua mobilidade",
  },
  {
    id: "system-agachamento-espanhol",
    source: "system",
    name: "Agachamento Espanhol",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps"],
    secondaryMuscles: ["Glúteos", "Core"],
    level: "intermediate",
    movementPattern: "Agachar com suporte",
    startingPosition:
      "Mantenha os pés firmes, joelhos alinhados à direção dos pés, coluna neutra e abdome ativo",
    movementExecution:
      "Flexione quadris e joelhos com controle, distribua a pressão por todo o pé e suba estendendo as pernas sem perder o alinhamento",
    importantCautions:
      "Evite colapsar os joelhos para dentro, levantar os calcanhares ou arredondar a lombar; ajuste a amplitude à sua mobilidade",
  },
  {
    id: "system-agachamento-frontal",
    source: "system",
    name: "Agachamento Frontal",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps"],
    secondaryMuscles: ["Glúteo Máximo", "Adutores", "Core", "Eretores"],
    level: "intermediate",
    movementPattern: "Agachar com carga anterior",
    startingPosition:
      "Mantenha os pés firmes, joelhos alinhados à direção dos pés, coluna neutra e abdome ativo",
    movementExecution:
      "Flexione quadris e joelhos com controle, distribua a pressão por todo o pé e suba estendendo as pernas sem perder o alinhamento",
    importantCautions:
      "Evite colapsar os joelhos para dentro, levantar os calcanhares ou arredondar a lombar; ajuste a amplitude à sua mobilidade",
  },
  {
    id: "system-agachamento-goblet",
    source: "system",
    name: "Agachamento Goblet",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps", "Glúteo Máximo"],
    secondaryMuscles: ["Adutores", "Core", "Eretores"],
    level: "beginner",
    movementPattern: "Agachar com carga anterior",
    startingPosition:
      "Mantenha os pés firmes, joelhos alinhados à direção dos pés, coluna neutra e abdome ativo",
    movementExecution:
      "Flexione quadris e joelhos com controle, distribua a pressão por todo o pé e suba estendendo as pernas sem perder o alinhamento",
    importantCautions:
      "Evite colapsar os joelhos para dentro, levantar os calcanhares ou arredondar a lombar; ajuste a amplitude à sua mobilidade",
  },
  {
    id: "system-agachamento-hack",
    source: "system",
    name: "Agachamento Hack",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps"],
    secondaryMuscles: ["Glúteo Máximo", "Adutores", "Posteriores"],
    level: "intermediate",
    movementPattern: "Agachar guiado",
    startingPosition:
      "Mantenha os pés firmes, joelhos alinhados à direção dos pés, coluna neutra e abdome ativo",
    movementExecution:
      "Flexione quadris e joelhos com controle, distribua a pressão por todo o pé e suba estendendo as pernas sem perder o alinhamento",
    importantCautions:
      "Evite colapsar os joelhos para dentro, levantar os calcanhares ou arredondar a lombar; ajuste a amplitude à sua mobilidade",
  },
  {
    id: "system-agachamento-livre",
    source: "system",
    name: "Agachamento Livre",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps", "Glúteo Máximo"],
    secondaryMuscles: ["Adutores", "Posteriores", "Eretores", "Core"],
    level: "intermediate",
    movementPattern: "Agachar",
    startingPosition:
      "Mantenha os pés firmes, joelhos alinhados à direção dos pés, coluna neutra e abdome ativo",
    movementExecution:
      "Flexione quadris e joelhos com controle, distribua a pressão por todo o pé e suba estendendo as pernas sem perder o alinhamento",
    importantCautions:
      "Evite colapsar os joelhos para dentro, levantar os calcanhares ou arredondar a lombar; ajuste a amplitude à sua mobilidade",
  },
  {
    id: "system-agachamento-sissy",
    source: "system",
    name: "Agachamento Sissy",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps"],
    secondaryMuscles: ["Core", "Flexores do Quadril"],
    level: "advanced",
    movementPattern: "Extensão de joelho em cadeia fechada",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-agachamento-sumo",
    source: "system",
    name: "Agachamento Sumô",
    muscleGroup: "glutes",
    primaryMuscles: ["Glúteo Máximo", "Adutores"],
    secondaryMuscles: ["Quadríceps", "Posteriores", "Core"],
    level: "intermediate",
    movementPattern: "Agachar com base ampla",
    startingPosition:
      "Mantenha os pés firmes, joelhos alinhados à direção dos pés, coluna neutra e abdome ativo",
    movementExecution:
      "Flexione quadris e joelhos com controle, distribua a pressão por todo o pé e suba estendendo as pernas sem perder o alinhamento",
    importantCautions:
      "Evite colapsar os joelhos para dentro, levantar os calcanhares ou arredondar a lombar; ajuste a amplitude à sua mobilidade",
  },
  {
    id: "system-barra-fixa-pronada",
    source: "system",
    name: "Barra Fixa Pronada",
    muscleGroup: "back",
    primaryMuscles: ["Latíssimo do Dorso"],
    secondaryMuscles: ["Bíceps", "Braquial", "Romboides", "Trapézio"],
    level: "intermediate",
    movementPattern: "Puxar vertical",
    startingPosition:
      "Estabilize o tronco, mantenha peito aberto e ombros afastados das orelhas; ajuste a pegada e o apoio",
    movementExecution:
      "Inicie organizando as escápulas e puxe com os cotovelos na direção exigida pelo movimento; retorne controlando o alongamento",
    importantCautions:
      "Evite embalo, excesso de extensão lombar e projetar a cabeça; preserve o punho neutro e não force a amplitude",
  },
  {
    id: "system-barra-fixa-supinada",
    source: "system",
    name: "Barra Fixa Supinada",
    muscleGroup: "back",
    primaryMuscles: ["Latíssimo do Dorso"],
    secondaryMuscles: ["Bíceps", "Braquial", "Romboides"],
    level: "intermediate",
    movementPattern: "Puxar vertical",
    startingPosition:
      "Estabilize o tronco, mantenha peito aberto e ombros afastados das orelhas; ajuste a pegada e o apoio",
    movementExecution:
      "Inicie organizando as escápulas e puxe com os cotovelos na direção exigida pelo movimento; retorne controlando o alongamento",
    importantCautions:
      "Evite embalo, excesso de extensão lombar e projetar a cabeça; preserve o punho neutro e não force a amplitude",
  },
  {
    id: "system-bear-crawl",
    source: "system",
    name: "Bear Crawl",
    muscleGroup: "full_body",
    primaryMuscles: ["Core", "Ombros"],
    secondaryMuscles: ["Quadríceps", "Glúteos", "Peitoral", "Tríceps"],
    level: "intermediate",
    movementPattern: "Locomoção quadrúpede",
    startingPosition:
      "Prepare espaço livre, base firme, coluna neutra e abdome ativo; domine cada parte do movimento separadamente",
    movementExecution:
      "Produza força a partir das pernas e quadris, coordene a sequência e finalize em posição estável antes da próxima repetição",
    importantCautions:
      "Exige técnica e condicionamento; não sacrifique postura por velocidade e, nos levantamentos olímpicos, prefira supervisão qualificada",
  },
  {
    id: "system-bird-dog",
    source: "system",
    name: "Bird Dog",
    muscleGroup: "core",
    primaryMuscles: ["Multífidos", "Eretores da Coluna"],
    secondaryMuscles: ["Glúteos", "Transverso", "Ombros"],
    level: "beginner",
    movementPattern: "Estabilidade cruzada",
    startingPosition:
      "Organize costelas e pelve, contraia o abdome e mantenha a respiração contínua",
    movementExecution:
      "Execute o movimento ou sustente a posição sem perder o alinhamento lombopélvico, avançando apenas até onde mantém controle",
    importantCautions:
      "Evite prender a respiração, arquear a lombar ou compensar com pescoço e ombros; encerre a série ao perder a postura",
  },
  {
    id: "system-burpee",
    source: "system",
    name: "Burpee",
    muscleGroup: "full_body",
    primaryMuscles: ["Peitoral", "Quadríceps", "Glúteos"],
    secondaryMuscles: ["Tríceps", "Ombros", "Panturrilhas", "Core"],
    level: "intermediate",
    movementPattern: "Agachar, apoiar e saltar",
    startingPosition:
      "Mantenha os pés firmes, joelhos alinhados à direção dos pés, coluna neutra e abdome ativo",
    movementExecution:
      "Flexione quadris e joelhos com controle, distribua a pressão por todo o pé e suba estendendo as pernas sem perder o alinhamento",
    importantCautions:
      "Evite colapsar os joelhos para dentro, levantar os calcanhares ou arredondar a lombar; ajuste a amplitude à sua mobilidade",
  },
  {
    id: "system-cadeira-extensora",
    source: "system",
    name: "Cadeira Extensora",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps"],
    secondaryMuscles: [],
    level: "beginner",
    movementPattern: "Extensão de joelho",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-cadeira-flexora",
    source: "system",
    name: "Cadeira Flexora",
    muscleGroup: "hamstrings",
    primaryMuscles: ["Isquiotibiais"],
    secondaryMuscles: ["Gastrocnêmio"],
    level: "beginner",
    movementPattern: "Flexão de joelho",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-caminhada-lateral-com-elastico",
    source: "system",
    name: "Caminhada Lateral com Elástico",
    muscleGroup: "glutes",
    primaryMuscles: ["Glúteo Médio"],
    secondaryMuscles: ["Glúteo Máximo", "Quadríceps", "Core"],
    level: "beginner",
    movementPattern: "Deslocamento lateral",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-clean",
    source: "system",
    name: "Clean",
    muscleGroup: "full_body",
    primaryMuscles: ["Glúteos", "Quadríceps", "Trapézio"],
    secondaryMuscles: ["Posteriores", "Panturrilhas", "Ombros", "Core"],
    level: "advanced",
    movementPattern: "Puxada olímpica",
    startingPosition:
      "Estabilize o tronco, mantenha peito aberto e ombros afastados das orelhas; ajuste a pegada e o apoio",
    movementExecution:
      "Inicie organizando as escápulas e puxe com os cotovelos na direção exigida pelo movimento; retorne controlando o alongamento",
    importantCautions:
      "Evite embalo, excesso de extensão lombar e projetar a cabeça; preserve o punho neutro e não force a amplitude",
  },
  {
    id: "system-clean-and-press",
    source: "system",
    name: "Clean And Press",
    muscleGroup: "full_body",
    primaryMuscles: ["Quadríceps", "Glúteos", "Ombros"],
    secondaryMuscles: ["Trapézio", "Tríceps", "Posteriores", "Core"],
    level: "advanced",
    movementPattern: "Puxada e empurrada",
    startingPosition:
      "Estabilize o tronco, mantenha peito aberto e ombros afastados das orelhas; ajuste a pegada e o apoio",
    movementExecution:
      "Inicie organizando as escápulas e puxe com os cotovelos na direção exigida pelo movimento; retorne controlando o alongamento",
    importantCautions:
      "Evite embalo, excesso de extensão lombar e projetar a cabeça; preserve o punho neutro e não force a amplitude",
  },
  {
    id: "system-coice-de-gluteo",
    source: "system",
    name: "Coice de Glúteo",
    muscleGroup: "glutes",
    primaryMuscles: ["Glúteo Máximo"],
    secondaryMuscles: ["Isquiotibiais", "Core"],
    level: "beginner",
    movementPattern: "Extensão de quadril unilateral",
    startingPosition:
      "Posicione os pés estáveis, contraia o abdome, mantenha a coluna neutra e leve os quadris para trás",
    movementExecution:
      "Desloque o quadril para trás mantendo a carga próxima ao corpo; estenda o quadril contraindo os glúteos, sem hiperestender a lombar",
    importantCautions:
      "Não transforme o movimento em agachamento nem arredonde a coluna; progrida a carga somente com a trajetória dominada",
  },
  {
    id: "system-crossover-alto-para-baixo",
    source: "system",
    name: "Crossover Alto para Baixo",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior"],
    secondaryMuscles: ["Deltoide Anterior", "Serrátil Anterior"],
    level: "intermediate",
    movementPattern: "Adução diagonal",
    startingPosition:
      "Adote postura estável, mantenha pescoço relaxado e escápulas controladas antes de mover o braço ou a perna",
    movementExecution:
      "Conduza o segmento no plano indicado, com velocidade constante e amplitude sem dor; retorne resistindo à carga",
    importantCautions:
      "Evite compensar com inclinação ou rotação do tronco e não ultrapasse a amplitude que preserve a articulação confortável",
  },
  {
    id: "system-crossover-baixo-para-cima",
    source: "system",
    name: "Crossover Baixo para Cima",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior"],
    secondaryMuscles: ["Deltoide Anterior", "Serrátil Anterior"],
    level: "intermediate",
    movementPattern: "Adução diagonal",
    startingPosition:
      "Adote postura estável, mantenha pescoço relaxado e escápulas controladas antes de mover o braço ou a perna",
    movementExecution:
      "Conduza o segmento no plano indicado, com velocidade constante e amplitude sem dor; retorne resistindo à carga",
    importantCautions:
      "Evite compensar com inclinação ou rotação do tronco e não ultrapasse a amplitude que preserve a articulação confortável",
  },
  {
    id: "system-crucifixo-inclinado",
    source: "system",
    name: "Crucifixo Inclinado",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior"],
    secondaryMuscles: ["Deltoide Anterior", "Serrátil Anterior"],
    level: "intermediate",
    movementPattern: "Adução inclinada",
    startingPosition:
      "Adote postura estável, mantenha pescoço relaxado e escápulas controladas antes de mover o braço ou a perna",
    movementExecution:
      "Conduza o segmento no plano indicado, com velocidade constante e amplitude sem dor; retorne resistindo à carga",
    importantCautions:
      "Evite compensar com inclinação ou rotação do tronco e não ultrapasse a amplitude que preserve a articulação confortável",
  },
  {
    id: "system-crucifixo-inverso",
    source: "system",
    name: "Crucifixo Inverso",
    muscleGroup: "shoulders",
    primaryMuscles: ["Deltoide Posterior"],
    secondaryMuscles: ["Romboides", "Trapézio Médio"],
    level: "beginner",
    movementPattern: "Abdução horizontal",
    startingPosition:
      "Adote postura estável, mantenha pescoço relaxado e escápulas controladas antes de mover o braço ou a perna",
    movementExecution:
      "Conduza o segmento no plano indicado, com velocidade constante e amplitude sem dor; retorne resistindo à carga",
    importantCautions:
      "Evite compensar com inclinação ou rotação do tronco e não ultrapasse a amplitude que preserve a articulação confortável",
  },
  {
    id: "system-crucifixo-reto",
    source: "system",
    name: "Crucifixo Reto",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior"],
    secondaryMuscles: ["Deltoide Anterior", "Serrátil Anterior"],
    level: "beginner",
    movementPattern: "Adução horizontal",
    startingPosition:
      "Adote postura estável, mantenha pescoço relaxado e escápulas controladas antes de mover o braço ou a perna",
    movementExecution:
      "Conduza o segmento no plano indicado, com velocidade constante e amplitude sem dor; retorne resistindo à carga",
    importantCautions:
      "Evite compensar com inclinação ou rotação do tronco e não ultrapasse a amplitude que preserve a articulação confortável",
  },
  {
    id: "system-crunch-reverso",
    source: "system",
    name: "Crunch Reverso",
    muscleGroup: "core",
    primaryMuscles: ["Reto Abdominal"],
    secondaryMuscles: ["Oblíquos", "Flexores do Quadril"],
    level: "beginner",
    movementPattern: "Retroversão pélvica",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-dead-bug",
    source: "system",
    name: "Dead Bug",
    muscleGroup: "core",
    primaryMuscles: ["Transverso do Abdome"],
    secondaryMuscles: ["Reto Abdominal", "Oblíquos", "Flexores do Quadril"],
    level: "beginner",
    movementPattern: "Estabilidade lombo-pélvica",
    startingPosition:
      "Organize costelas e pelve, contraia o abdome e mantenha a respiração contínua",
    movementExecution:
      "Execute o movimento ou sustente a posição sem perder o alinhamento lombopélvico, avançando apenas até onde mantém controle",
    importantCautions:
      "Evite prender a respiração, arquear a lombar ou compensar com pescoço e ombros; encerre a série ao perder a postura",
  },
  {
    id: "system-dead-hang",
    source: "system",
    name: "Dead Hang",
    muscleGroup: "forearms",
    primaryMuscles: ["Flexores dos Dedos", "Antebraços"],
    secondaryMuscles: ["Latíssimo", "Trapézio", "Ombros"],
    level: "beginner",
    movementPattern: "Suspensão isométrica",
    startingPosition:
      "Apoie ou estabilize o antebraço conforme a variação e mantenha ombros relaxados",
    movementExecution:
      "Mova o punho, antebraço ou dedos pela amplitude confortável, aperte ou sustente a pegada e retorne de modo lento",
    importantCautions:
      "Use carga moderada, evite movimentos bruscos e interrompa diante de formigamento ou dor no punho e cotovelo",
  },
  {
    id: "system-desenvolvimento-arnold",
    source: "system",
    name: "Desenvolvimento Arnold",
    muscleGroup: "shoulders",
    primaryMuscles: ["Deltoide Anterior", "Deltoide Lateral"],
    secondaryMuscles: ["Tríceps", "Trapézio"],
    level: "intermediate",
    movementPattern: "Empurrar vertical com rotação",
    startingPosition:
      "Crie uma base estável, mantenha punhos alinhados, escápulas controladas e abdome ativo",
    movementExecution:
      "Empurre a resistência pela trajetória confortável, estenda os braços sem travar agressivamente os cotovelos e retorne com controle",
    importantCautions:
      "Evite abrir ou fechar demais os cotovelos, perder a posição dos ombros ou compensar com arqueamento lombar excessivo",
  },
  {
    id: "system-desenvolvimento-de-ombros",
    source: "system",
    name: "Desenvolvimento de Ombros",
    muscleGroup: "shoulders",
    primaryMuscles: ["Deltoide Anterior", "Deltoide Lateral"],
    secondaryMuscles: ["Tríceps", "Trapézio Superior"],
    level: "intermediate",
    movementPattern: "Empurrar vertical",
    startingPosition:
      "Crie uma base estável, mantenha punhos alinhados, escápulas controladas e abdome ativo",
    movementExecution:
      "Empurre a resistência pela trajetória confortável, estenda os braços sem travar agressivamente os cotovelos e retorne com controle",
    importantCautions:
      "Evite abrir ou fechar demais os cotovelos, perder a posição dos ombros ou compensar com arqueamento lombar excessivo",
  },
  {
    id: "system-deslizamento-lateral",
    source: "system",
    name: "Deslizamento Lateral",
    muscleGroup: "adductors",
    primaryMuscles: ["Adutores do Quadril"],
    secondaryMuscles: ["Glúteos", "Quadríceps", "Core"],
    level: "intermediate",
    movementPattern: "Avanço lateral deslizante",
    startingPosition:
      "Mantenha os pés firmes, joelhos alinhados à direção dos pés, coluna neutra e abdome ativo",
    movementExecution:
      "Flexione quadris e joelhos com controle, distribua a pressão por todo o pé e suba estendendo as pernas sem perder o alinhamento",
    importantCautions:
      "Evite colapsar os joelhos para dentro, levantar os calcanhares ou arredondar a lombar; ajuste a amplitude à sua mobilidade",
  },
  {
    id: "system-desvio-radial-do-punho",
    source: "system",
    name: "Desvio Radial do Punho",
    muscleGroup: "forearms",
    primaryMuscles: ["Flexor Radial", "Extensor Radial do Carpo"],
    secondaryMuscles: ["Braquiorradial", "Músculos da Mão"],
    level: "intermediate",
    movementPattern: "Desvio radial",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-donkey-calf-raise",
    source: "system",
    name: "Donkey Calf Raise",
    muscleGroup: "calves",
    primaryMuscles: ["Gastrocnêmio"],
    secondaryMuscles: ["Sóleo", "Músculos do Pé"],
    level: "intermediate",
    movementPattern: "Flexão plantar com quadril flexionado",
    startingPosition:
      "Apoie o pé com estabilidade e mantenha tornozelo, joelho e quadril alinhados",
    movementExecution:
      "Percorra a amplitude disponível do tornozelo, faça uma breve contração no final e retorne lentamente; em saltos, aterrisse suavemente",
    importantCautions:
      "Não balance o corpo, não deixe o tornozelo cair para os lados e progrida impacto e carga gradualmente",
  },
  {
    id: "system-elevacao-de-joelhos-na-barra",
    source: "system",
    name: "Elevação de Joelhos na Barra",
    muscleGroup: "core",
    primaryMuscles: ["Reto Abdominal", "Flexores do Quadril"],
    secondaryMuscles: ["Oblíquos", "Antebraços", "Latíssimo"],
    level: "intermediate",
    movementPattern: "Flexão de quadril suspensa",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-elevacao-de-panturrilha-agachado",
    source: "system",
    name: "Elevação de Panturrilha Agachado",
    muscleGroup: "calves",
    primaryMuscles: ["Sóleo"],
    secondaryMuscles: ["Gastrocnêmio", "Quadríceps"],
    level: "intermediate",
    movementPattern: "Flexão plantar com joelhos flexionados",
    startingPosition:
      "Apoie o pé com estabilidade e mantenha tornozelo, joelho e quadril alinhados",
    movementExecution:
      "Percorra a amplitude disponível do tornozelo, faça uma breve contração no final e retorne lentamente; em saltos, aterrisse suavemente",
    importantCautions:
      "Não balance o corpo, não deixe o tornozelo cair para os lados e progrida impacto e carga gradualmente",
  },
  {
    id: "system-elevacao-de-panturrilha-em-pe",
    source: "system",
    name: "Elevação de Panturrilha em Pé",
    muscleGroup: "calves",
    primaryMuscles: ["Gastrocnêmio"],
    secondaryMuscles: ["Sóleo", "Músculos do Pé"],
    level: "beginner",
    movementPattern: "Flexão plantar em pé",
    startingPosition:
      "Apoie o pé com estabilidade e mantenha tornozelo, joelho e quadril alinhados",
    movementExecution:
      "Percorra a amplitude disponível do tornozelo, faça uma breve contração no final e retorne lentamente; em saltos, aterrisse suavemente",
    importantCautions:
      "Não balance o corpo, não deixe o tornozelo cair para os lados e progrida impacto e carga gradualmente",
  },
  {
    id: "system-elevacao-de-panturrilha-sentado",
    source: "system",
    name: "Elevação de Panturrilha Sentado",
    muscleGroup: "calves",
    primaryMuscles: ["Sóleo"],
    secondaryMuscles: ["Gastrocnêmio", "Músculos do Pé"],
    level: "beginner",
    movementPattern: "Flexão plantar sentado",
    startingPosition:
      "Apoie o pé com estabilidade e mantenha tornozelo, joelho e quadril alinhados",
    movementExecution:
      "Percorra a amplitude disponível do tornozelo, faça uma breve contração no final e retorne lentamente; em saltos, aterrisse suavemente",
    importantCautions:
      "Não balance o corpo, não deixe o tornozelo cair para os lados e progrida impacto e carga gradualmente",
  },
  {
    id: "system-elevacao-de-pernas",
    source: "system",
    name: "Elevação de Pernas",
    muscleGroup: "core",
    primaryMuscles: ["Reto Abdominal", "Flexores do Quadril"],
    secondaryMuscles: ["Oblíquos", "Transverso"],
    level: "intermediate",
    movementPattern: "Flexão de quadril com controle pélvico",
    startingPosition:
      "Organize costelas e pelve, contraia o abdome e mantenha a respiração contínua",
    movementExecution:
      "Execute o movimento ou sustente a posição sem perder o alinhamento lombopélvico, avançando apenas até onde mantém controle",
    importantCautions:
      "Evite prender a respiração, arquear a lombar ou compensar com pescoço e ombros; encerre a série ao perder a postura",
  },
  {
    id: "system-elevacao-em-y",
    source: "system",
    name: "Elevação em Y",
    muscleGroup: "shoulders",
    primaryMuscles: ["Trapézio Inferior", "Deltoide Posterior"],
    secondaryMuscles: ["Supraespinal", "Serrátil Anterior"],
    level: "intermediate",
    movementPattern: "Elevação escapular em Y",
    startingPosition:
      "Estabilize o tronco, mantenha peito aberto e ombros afastados das orelhas; ajuste a pegada e o apoio",
    movementExecution:
      "Inicie organizando as escápulas e puxe com os cotovelos na direção exigida pelo movimento; retorne controlando o alongamento",
    importantCautions:
      "Evite embalo, excesso de extensão lombar e projetar a cabeça; preserve o punho neutro e não force a amplitude",
  },
  {
    id: "system-elevacao-frontal",
    source: "system",
    name: "Elevação Frontal",
    muscleGroup: "shoulders",
    primaryMuscles: ["Deltoide Anterior"],
    secondaryMuscles: ["Peitoral Superior", "Serrátil Anterior"],
    level: "beginner",
    movementPattern: "Flexão de ombro",
    startingPosition:
      "Adote postura estável, mantenha pescoço relaxado e escápulas controladas antes de mover o braço ou a perna",
    movementExecution:
      "Conduza o segmento no plano indicado, com velocidade constante e amplitude sem dor; retorne resistindo à carga",
    importantCautions:
      "Evite compensar com inclinação ou rotação do tronco e não ultrapasse a amplitude que preserve a articulação confortável",
  },
  {
    id: "system-elevacao-lateral",
    source: "system",
    name: "Elevação Lateral",
    muscleGroup: "shoulders",
    primaryMuscles: ["Deltoide Lateral"],
    secondaryMuscles: ["Trapézio Superior", "Supraespinal"],
    level: "beginner",
    movementPattern: "Abdução de ombro",
    startingPosition:
      "Adote postura estável, mantenha pescoço relaxado e escápulas controladas antes de mover o braço ou a perna",
    movementExecution:
      "Conduza o segmento no plano indicado, com velocidade constante e amplitude sem dor; retorne resistindo à carga",
    importantCautions:
      "Evite compensar com inclinação ou rotação do tronco e não ultrapasse a amplitude que preserve a articulação confortável",
  },
  {
    id: "system-elevacao-lateral-inclinada",
    source: "system",
    name: "Elevação Lateral Inclinada",
    muscleGroup: "shoulders",
    primaryMuscles: ["Deltoide Lateral"],
    secondaryMuscles: ["Supraespinal", "Trapézio"],
    level: "intermediate",
    movementPattern: "Abdução de ombro",
    startingPosition:
      "Adote postura estável, mantenha pescoço relaxado e escápulas controladas antes de mover o braço ou a perna",
    movementExecution:
      "Conduza o segmento no plano indicado, com velocidade constante e amplitude sem dor; retorne resistindo à carga",
    importantCautions:
      "Evite compensar com inclinação ou rotação do tronco e não ultrapasse a amplitude que preserve a articulação confortável",
  },
  {
    id: "system-elevacao-pelvica",
    source: "system",
    name: "Elevação Pélvica",
    muscleGroup: "glutes",
    primaryMuscles: ["Glúteo Máximo"],
    secondaryMuscles: ["Isquiotibiais", "Adutores", "Core"],
    level: "beginner",
    movementPattern: "Extensão de quadril",
    startingPosition:
      "Posicione os pés estáveis, contraia o abdome, mantenha a coluna neutra e leve os quadris para trás",
    movementExecution:
      "Desloque o quadril para trás mantendo a carga próxima ao corpo; estenda o quadril contraindo os glúteos, sem hiperestender a lombar",
    importantCautions:
      "Não transforme o movimento em agachamento nem arredonde a coluna; progrida a carga somente com a trajetória dominada",
  },
  {
    id: "system-elevacao-pelvica-unilateral",
    source: "system",
    name: "Elevação Pélvica Unilateral",
    muscleGroup: "glutes",
    primaryMuscles: ["Glúteo Máximo"],
    secondaryMuscles: ["Isquiotibiais", "Glúteo Médio", "Core"],
    level: "intermediate",
    movementPattern: "Extensão unilateral de quadril",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-encolhimento-de-ombros",
    source: "system",
    name: "Encolhimento de Ombros",
    muscleGroup: "back",
    primaryMuscles: ["Trapézio Superior"],
    secondaryMuscles: ["Levantador da Escápula", "Antebraços"],
    level: "beginner",
    movementPattern: "Elevação escapular",
    startingPosition:
      "Estabilize o tronco, mantenha peito aberto e ombros afastados das orelhas; ajuste a pegada e o apoio",
    movementExecution:
      "Inicie organizando as escápulas e puxe com os cotovelos na direção exigida pelo movimento; retorne controlando o alongamento",
    importantCautions:
      "Evite embalo, excesso de extensão lombar e projetar a cabeça; preserve o punho neutro e não force a amplitude",
  },
  {
    id: "system-extensao-cruzada-de-triceps",
    source: "system",
    name: "Extensão Cruzada de Tríceps",
    muscleGroup: "triceps",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Ancôneo", "Deltoide Posterior"],
    level: "intermediate",
    movementPattern: "Extensão diagonal de cotovelo",
    startingPosition:
      "Estabilize ombros e tronco, alinhe punhos e mantenha os cotovelos na posição adequada à variação",
    movementExecution:
      "Estenda os cotovelos até contrair o tríceps e retorne lentamente, preservando a posição do braço",
    importantCautions:
      "Não use impulso nem deixe os cotovelos abrirem sem controle; reduza amplitude ou carga se houver desconforto no cotovelo",
  },
  {
    id: "system-extensao-de-punho",
    source: "system",
    name: "Extensão de Punho",
    muscleGroup: "forearms",
    primaryMuscles: ["Extensores do Punho"],
    secondaryMuscles: ["Extensores dos Dedos", "Braquiorradial"],
    level: "beginner",
    movementPattern: "Extensão de punho",
    startingPosition:
      "Apoie ou estabilize o antebraço conforme a variação e mantenha ombros relaxados",
    movementExecution:
      "Mova o punho, antebraço ou dedos pela amplitude confortável, aperte ou sustente a pegada e retorne de modo lento",
    importantCautions:
      "Use carga moderada, evite movimentos bruscos e interrompa diante de formigamento ou dor no punho e cotovelo",
  },
  {
    id: "system-extensao-de-quadril-no-banco-romano",
    source: "system",
    name: "Extensão de Quadril no Banco Romano",
    muscleGroup: "hamstrings",
    primaryMuscles: ["Glúteo Máximo", "Isquiotibiais"],
    secondaryMuscles: ["Eretores da Coluna"],
    level: "intermediate",
    movementPattern: "Extensão de quadril",
    startingPosition:
      "Posicione os pés estáveis, contraia o abdome, mantenha a coluna neutra e leve os quadris para trás",
    movementExecution:
      "Desloque o quadril para trás mantendo a carga próxima ao corpo; estenda o quadril contraindo os glúteos, sem hiperestender a lombar",
    importantCautions:
      "Não transforme o movimento em agachamento nem arredonde a coluna; progrida a carga somente com a trajetória dominada",
  },
  {
    id: "system-extensao-lombar",
    source: "system",
    name: "Extensão Lombar",
    muscleGroup: "lower_back",
    primaryMuscles: ["Eretores da Coluna"],
    secondaryMuscles: ["Glúteos", "Isquiotibiais"],
    level: "beginner",
    movementPattern: "Extensão de tronco",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-extensao-unilateral-de-triceps",
    source: "system",
    name: "Extensão Unilateral de Tríceps",
    muscleGroup: "triceps",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Ancôneo"],
    level: "beginner",
    movementPattern: "Extensão unilateral de cotovelo",
    startingPosition:
      "Estabilize ombros e tronco, alinhe punhos e mantenha os cotovelos na posição adequada à variação",
    movementExecution:
      "Estenda os cotovelos até contrair o tríceps e retorne lentamente, preservando a posição do braço",
    importantCautions:
      "Não use impulso nem deixe os cotovelos abrirem sem controle; reduza amplitude ou carga se houver desconforto no cotovelo",
  },
  {
    id: "system-face-pull",
    source: "system",
    name: "Face Pull",
    muscleGroup: "shoulders",
    primaryMuscles: ["Deltoide Posterior", "Rotadores Externos"],
    secondaryMuscles: ["Trapézio Médio e Inferior", "Romboides"],
    level: "beginner",
    movementPattern: "Puxar para o rosto",
    startingPosition:
      "Estabilize o tronco, mantenha peito aberto e ombros afastados das orelhas; ajuste a pegada e o apoio",
    movementExecution:
      "Inicie organizando as escápulas e puxe com os cotovelos na direção exigida pelo movimento; retorne controlando o alongamento",
    importantCautions:
      "Evite embalo, excesso de extensão lombar e projetar a cabeça; preserve o punho neutro e não force a amplitude",
  },
  {
    id: "system-farmers-walk",
    source: "system",
    name: "Farmers Walk",
    muscleGroup: "full_body",
    primaryMuscles: ["Antebraços", "Trapézio", "Core"],
    secondaryMuscles: ["Glúteos", "Quadríceps", "Panturrilhas"],
    level: "beginner",
    movementPattern: "Caminhada carregada",
    startingPosition:
      "Prepare espaço livre, base firme, coluna neutra e abdome ativo; domine cada parte do movimento separadamente",
    movementExecution:
      "Produza força a partir das pernas e quadris, coordene a sequência e finalize em posição estável antes da próxima repetição",
    importantCautions:
      "Exige técnica e condicionamento; não sacrifique postura por velocidade e, nos levantamentos olímpicos, prefira supervisão qualificada",
  },
  {
    id: "system-farmers-walk-na-ponta-dos-pes",
    source: "system",
    name: "Farmers Walk na Ponta dos Pés",
    muscleGroup: "calves",
    primaryMuscles: ["Gastrocnêmio", "Sóleo"],
    secondaryMuscles: ["Antebraços", "Trapézio", "Core"],
    level: "advanced",
    movementPattern: "Caminhada em flexão plantar",
    startingPosition:
      "Apoie o pé com estabilidade e mantenha tornozelo, joelho e quadril alinhados",
    movementExecution:
      "Percorra a amplitude disponível do tornozelo, faça uma breve contração no final e retorne lentamente; em saltos, aterrisse suavemente",
    importantCautions:
      "Não balance o corpo, não deixe o tornozelo cair para os lados e progrida impacto e carga gradualmente",
  },
  {
    id: "system-flexao-arqueiro",
    source: "system",
    name: "Flexão Arqueiro",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior"],
    secondaryMuscles: ["Tríceps", "Deltoide Anterior", "Core"],
    level: "advanced",
    movementPattern: "Empurrar unilateral",
    startingPosition:
      "Crie uma base estável, mantenha punhos alinhados, escápulas controladas e abdome ativo",
    movementExecution:
      "Empurre a resistência pela trajetória confortável, estenda os braços sem travar agressivamente os cotovelos e retorne com controle",
    importantCautions:
      "Evite abrir ou fechar demais os cotovelos, perder a posição dos ombros ou compensar com arqueamento lombar excessivo",
  },
  {
    id: "system-flexao-de-bracos",
    source: "system",
    name: "Flexão de Braços",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior"],
    secondaryMuscles: ["Tríceps", "Deltoide Anterior", "Core"],
    level: "beginner",
    movementPattern: "Empurrar horizontal",
    startingPosition:
      "Crie uma base estável, mantenha punhos alinhados, escápulas controladas e abdome ativo",
    movementExecution:
      "Empurre a resistência pela trajetória confortável, estenda os braços sem travar agressivamente os cotovelos e retorne com controle",
    importantCautions:
      "Evite abrir ou fechar demais os cotovelos, perder a posição dos ombros ou compensar com arqueamento lombar excessivo",
  },
  {
    id: "system-flexao-de-punho",
    source: "system",
    name: "Flexão de Punho",
    muscleGroup: "forearms",
    primaryMuscles: ["Flexores do Punho"],
    secondaryMuscles: ["Flexores dos Dedos", "Braquiorradial"],
    level: "beginner",
    movementPattern: "Flexão de punho",
    startingPosition:
      "Apoie ou estabilize o antebraço conforme a variação e mantenha ombros relaxados",
    movementExecution:
      "Mova o punho, antebraço ou dedos pela amplitude confortável, aperte ou sustente a pegada e retorne de modo lento",
    importantCautions:
      "Use carga moderada, evite movimentos bruscos e interrompa diante de formigamento ou dor no punho e cotovelo",
  },
  {
    id: "system-flexao-diamante",
    source: "system",
    name: "Flexão Diamante",
    muscleGroup: "chest",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Peitoral Maior", "Deltoide Anterior", "Core"],
    level: "intermediate",
    movementPattern: "Empurrar horizontal",
    startingPosition:
      "Crie uma base estável, mantenha punhos alinhados, escápulas controladas e abdome ativo",
    movementExecution:
      "Empurre a resistência pela trajetória confortável, estenda os braços sem travar agressivamente os cotovelos e retorne com controle",
    importantCautions:
      "Evite abrir ou fechar demais os cotovelos, perder a posição dos ombros ou compensar com arqueamento lombar excessivo",
  },
  {
    id: "system-flexao-fechada",
    source: "system",
    name: "Flexão Fechada",
    muscleGroup: "triceps",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Peitoral", "Deltoide Anterior", "Core"],
    level: "intermediate",
    movementPattern: "Empurrar horizontal fechado",
    startingPosition:
      "Crie uma base estável, mantenha punhos alinhados, escápulas controladas e abdome ativo",
    movementExecution:
      "Empurre a resistência pela trajetória confortável, estenda os braços sem travar agressivamente os cotovelos e retorne com controle",
    importantCautions:
      "Evite abrir ou fechar demais os cotovelos, perder a posição dos ombros ou compensar com arqueamento lombar excessivo",
  },
  {
    id: "system-flexao-nordica",
    source: "system",
    name: "Flexão Nórdica",
    muscleGroup: "hamstrings",
    primaryMuscles: ["Isquiotibiais"],
    secondaryMuscles: ["Glúteos", "Gastrocnêmio", "Core"],
    level: "advanced",
    movementPattern: "Flexão excêntrica de joelho",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-flexora-em-pe",
    source: "system",
    name: "Flexora em Pé",
    muscleGroup: "hamstrings",
    primaryMuscles: ["Isquiotibiais"],
    secondaryMuscles: ["Gastrocnêmio", "Glúteos"],
    level: "beginner",
    movementPattern: "Flexão unilateral de joelho",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-good-morning",
    source: "system",
    name: "Good Morning",
    muscleGroup: "hamstrings",
    primaryMuscles: ["Isquiotibiais", "Glúteo Máximo"],
    secondaryMuscles: ["Eretores", "Adutores", "Core"],
    level: "advanced",
    movementPattern: "Dobradiça de quadril",
    startingPosition:
      "Posicione os pés estáveis, contraia o abdome, mantenha a coluna neutra e leve os quadris para trás",
    movementExecution:
      "Desloque o quadril para trás mantendo a carga próxima ao corpo; estenda o quadril contraindo os glúteos, sem hiperestender a lombar",
    importantCautions:
      "Não transforme o movimento em agachamento nem arredonde a coluna; progrida a carga somente com a trajetória dominada",
  },
  {
    id: "system-good-morning-sentado",
    source: "system",
    name: "Good Morning Sentado",
    muscleGroup: "lower_back",
    primaryMuscles: ["Eretores da Coluna"],
    secondaryMuscles: ["Glúteos", "Adutores", "Core"],
    level: "advanced",
    movementPattern: "Dobradiça sentada",
    startingPosition:
      "Posicione os pés estáveis, contraia o abdome, mantenha a coluna neutra e leve os quadris para trás",
    movementExecution:
      "Desloque o quadril para trás mantendo a carga próxima ao corpo; estenda o quadril contraindo os glúteos, sem hiperestender a lombar",
    importantCautions:
      "Não transforme o movimento em agachamento nem arredonde a coluna; progrida a carga somente com a trajetória dominada",
  },
  {
    id: "system-hand-gripper",
    source: "system",
    name: "Hand Gripper",
    muscleGroup: "forearms",
    primaryMuscles: ["Flexores dos Dedos"],
    secondaryMuscles: ["Músculos da Mão", "Antebraços"],
    level: "beginner",
    movementPattern: "Preensão",
    startingPosition:
      "Apoie ou estabilize o antebraço conforme a variação e mantenha ombros relaxados",
    movementExecution:
      "Mova o punho, antebraço ou dedos pela amplitude confortável, aperte ou sustente a pegada e retorne de modo lento",
    importantCautions:
      "Use carga moderada, evite movimentos bruscos e interrompa diante de formigamento ou dor no punho e cotovelo",
  },
  {
    id: "system-hollow-body-hold",
    source: "system",
    name: "Hollow Body Hold",
    muscleGroup: "core",
    primaryMuscles: ["Reto Abdominal", "Transverso"],
    secondaryMuscles: ["Flexores do Quadril", "Quadríceps"],
    level: "intermediate",
    movementPattern: "Anti-extensão isométrica",
    startingPosition:
      "Organize costelas e pelve, contraia o abdome e mantenha a respiração contínua",
    movementExecution:
      "Execute o movimento ou sustente a posição sem perder o alinhamento lombopélvico, avançando apenas até onde mantém controle",
    importantCautions:
      "Evite prender a respiração, arquear a lombar ou compensar com pescoço e ombros; encerre a série ao perder a postura",
  },
  {
    id: "system-jefferson-curl",
    source: "system",
    name: "Jefferson Curl",
    muscleGroup: "lower_back",
    primaryMuscles: ["Eretores da Coluna"],
    secondaryMuscles: ["Isquiotibiais", "Glúteos"],
    level: "advanced",
    movementPattern: "Flexão segmentar controlada",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-jm-press",
    source: "system",
    name: "Jm Press",
    muscleGroup: "triceps",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Peitoral", "Deltoide Anterior"],
    level: "advanced",
    movementPattern: "Empurrar e estender cotovelos",
    startingPosition:
      "Crie uma base estável, mantenha punhos alinhados, escápulas controladas e abdome ativo",
    movementExecution:
      "Empurre a resistência pela trajetória confortável, estenda os braços sem travar agressivamente os cotovelos e retorne com controle",
    importantCautions:
      "Evite abrir ou fechar demais os cotovelos, perder a posição dos ombros ou compensar com arqueamento lombar excessivo",
  },
  {
    id: "system-leg-press",
    source: "system",
    name: "Leg Press",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps", "Glúteo Máximo"],
    secondaryMuscles: ["Adutores", "Posteriores da Coxa"],
    level: "beginner",
    movementPattern: "Empurrar com pernas",
    startingPosition:
      "Crie uma base estável, mantenha punhos alinhados, escápulas controladas e abdome ativo",
    movementExecution:
      "Empurre a resistência pela trajetória confortável, estenda os braços sem travar agressivamente os cotovelos e retorne com controle",
    importantCautions:
      "Evite abrir ou fechar demais os cotovelos, perder a posição dos ombros ou compensar com arqueamento lombar excessivo",
  },
  {
    id: "system-levantamento-terra-com-trap-bar",
    source: "system",
    name: "Levantamento Terra com Trap Bar",
    muscleGroup: "full_body",
    primaryMuscles: ["Quadríceps", "Glúteo Máximo"],
    secondaryMuscles: ["Isquiotibiais", "Eretores", "Trapézio", "Antebraços"],
    level: "intermediate",
    movementPattern: "Dobradiça e puxada do solo",
    startingPosition:
      "Posicione os pés estáveis, contraia o abdome, mantenha a coluna neutra e leve os quadris para trás",
    movementExecution:
      "Desloque o quadril para trás mantendo a carga próxima ao corpo; estenda o quadril contraindo os glúteos, sem hiperestender a lombar",
    importantCautions:
      "Não transforme o movimento em agachamento nem arredonde a coluna; progrida a carga somente com a trajetória dominada",
  },
  {
    id: "system-levantamento-terra-convencional",
    source: "system",
    name: "Levantamento Terra Convencional",
    muscleGroup: "full_body",
    primaryMuscles: ["Glúteo Máximo", "Isquiotibiais", "Eretores"],
    secondaryMuscles: ["Quadríceps", "Trapézio", "Antebraços", "Core"],
    level: "intermediate",
    movementPattern: "Dobradiça e puxada do solo",
    startingPosition:
      "Posicione os pés estáveis, contraia o abdome, mantenha a coluna neutra e leve os quadris para trás",
    movementExecution:
      "Desloque o quadril para trás mantendo a carga próxima ao corpo; estenda o quadril contraindo os glúteos, sem hiperestender a lombar",
    importantCautions:
      "Não transforme o movimento em agachamento nem arredonde a coluna; progrida a carga somente com a trajetória dominada",
  },
  {
    id: "system-levantamento-terra-pernas-rigidas",
    source: "system",
    name: "Levantamento Terra Pernas Rígidas",
    muscleGroup: "hamstrings",
    primaryMuscles: ["Isquiotibiais"],
    secondaryMuscles: ["Glúteo Máximo", "Eretores", "Adutores"],
    level: "intermediate",
    movementPattern: "Dobradiça de quadril",
    startingPosition:
      "Posicione os pés estáveis, contraia o abdome, mantenha a coluna neutra e leve os quadris para trás",
    movementExecution:
      "Desloque o quadril para trás mantendo a carga próxima ao corpo; estenda o quadril contraindo os glúteos, sem hiperestender a lombar",
    importantCautions:
      "Não transforme o movimento em agachamento nem arredonde a coluna; progrida a carga somente com a trajetória dominada",
  },
  {
    id: "system-levantamento-terra-romeno",
    source: "system",
    name: "Levantamento Terra Romeno",
    muscleGroup: "hamstrings",
    primaryMuscles: ["Isquiotibiais", "Glúteo Máximo"],
    secondaryMuscles: ["Eretores", "Adutores", "Core"],
    level: "intermediate",
    movementPattern: "Dobradiça de quadril",
    startingPosition:
      "Posicione os pés estáveis, contraia o abdome, mantenha a coluna neutra e leve os quadris para trás",
    movementExecution:
      "Desloque o quadril para trás mantendo a carga próxima ao corpo; estenda o quadril contraindo os glúteos, sem hiperestender a lombar",
    importantCautions:
      "Não transforme o movimento em agachamento nem arredonde a coluna; progrida a carga somente com a trajetória dominada",
  },
  {
    id: "system-levantamento-terra-sumo",
    source: "system",
    name: "Levantamento Terra Sumô",
    muscleGroup: "glutes",
    primaryMuscles: ["Glúteo Máximo", "Adutores"],
    secondaryMuscles: ["Quadríceps", "Posteriores", "Eretores", "Core"],
    level: "intermediate",
    movementPattern: "Dobradiça com base ampla",
    startingPosition:
      "Posicione os pés estáveis, contraia o abdome, mantenha a coluna neutra e leve os quadris para trás",
    movementExecution:
      "Desloque o quadril para trás mantendo a carga próxima ao corpo; estenda o quadril contraindo os glúteos, sem hiperestender a lombar",
    importantCautions:
      "Não transforme o movimento em agachamento nem arredonde a coluna; progrida a carga somente com a trajetória dominada",
  },
  {
    id: "system-mergulho-nas-paralelas-com-foco-no-peito",
    source: "system",
    name: "Mergulho nas Paralelas com Foco no Peito",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior"],
    secondaryMuscles: ["Tríceps", "Deltoide Anterior"],
    level: "intermediate",
    movementPattern: "Empurrar vertical",
    startingPosition:
      "Crie uma base estável, mantenha punhos alinhados, escápulas controladas e abdome ativo",
    movementExecution:
      "Empurre a resistência pela trajetória confortável, estenda os braços sem travar agressivamente os cotovelos e retorne com controle",
    importantCautions:
      "Evite abrir ou fechar demais os cotovelos, perder a posição dos ombros ou compensar com arqueamento lombar excessivo",
  },
  {
    id: "system-mergulho-no-banco",
    source: "system",
    name: "Mergulho no Banco",
    muscleGroup: "triceps",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Peitoral", "Deltoide Anterior"],
    level: "intermediate",
    movementPattern: "Empurrar vertical",
    startingPosition:
      "Crie uma base estável, mantenha punhos alinhados, escápulas controladas e abdome ativo",
    movementExecution:
      "Empurre a resistência pela trajetória confortável, estenda os braços sem travar agressivamente os cotovelos e retorne com controle",
    importantCautions:
      "Evite abrir ou fechar demais os cotovelos, perder a posição dos ombros ou compensar com arqueamento lombar excessivo",
  },
  {
    id: "system-mesa-flexora",
    source: "system",
    name: "Mesa Flexora",
    muscleGroup: "hamstrings",
    primaryMuscles: ["Isquiotibiais"],
    secondaryMuscles: ["Gastrocnêmio"],
    level: "beginner",
    movementPattern: "Flexão de joelho",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-mountain-climber",
    source: "system",
    name: "Mountain Climber",
    muscleGroup: "full_body",
    primaryMuscles: ["Core", "Flexores do Quadril"],
    secondaryMuscles: ["Ombros", "Peitoral", "Quadríceps"],
    level: "beginner",
    movementPattern: "Prancha dinâmica",
    startingPosition:
      "Organize costelas e pelve, contraia o abdome e mantenha a respiração contínua",
    movementExecution:
      "Execute o movimento ou sustente a posição sem perder o alinhamento lombopélvico, avançando apenas até onde mantém controle",
    importantCautions:
      "Evite prender a respiração, arquear a lombar ou compensar com pescoço e ombros; encerre a série ao perder a postura",
  },
  {
    id: "system-pallof-press",
    source: "system",
    name: "Pallof Press",
    muscleGroup: "core",
    primaryMuscles: ["Oblíquos", "Transverso"],
    secondaryMuscles: ["Glúteos", "Ombros"],
    level: "beginner",
    movementPattern: "Anti-rotação",
    startingPosition:
      "Adote postura estável, mantenha pescoço relaxado e escápulas controladas antes de mover o braço ou a perna",
    movementExecution:
      "Conduza o segmento no plano indicado, com velocidade constante e amplitude sem dor; retorne resistindo à carga",
    importantCautions:
      "Evite compensar com inclinação ou rotação do tronco e não ultrapasse a amplitude que preserve a articulação confortável",
  },
  {
    id: "system-panturrilha-no-leg-press",
    source: "system",
    name: "Panturrilha no Leg Press",
    muscleGroup: "calves",
    primaryMuscles: ["Gastrocnêmio", "Sóleo"],
    secondaryMuscles: ["Músculos do Pé"],
    level: "beginner",
    movementPattern: "Flexão plantar",
    startingPosition:
      "Apoie o pé com estabilidade e mantenha tornozelo, joelho e quadril alinhados",
    movementExecution:
      "Percorra a amplitude disponível do tornozelo, faça uma breve contração no final e retorne lentamente; em saltos, aterrisse suavemente",
    importantCautions:
      "Não balance o corpo, não deixe o tornozelo cair para os lados e progrida impacto e carga gradualmente",
  },
  {
    id: "system-panturrilha-unilateral",
    source: "system",
    name: "Panturrilha Unilateral",
    muscleGroup: "calves",
    primaryMuscles: ["Gastrocnêmio", "Sóleo"],
    secondaryMuscles: ["Músculos do Pé", "Estabilizadores do Tornozelo"],
    level: "intermediate",
    movementPattern: "Flexão plantar unilateral",
    startingPosition:
      "Apoie o pé com estabilidade e mantenha tornozelo, joelho e quadril alinhados",
    movementExecution:
      "Percorra a amplitude disponível do tornozelo, faça uma breve contração no final e retorne lentamente; em saltos, aterrisse suavemente",
    importantCautions:
      "Não balance o corpo, não deixe o tornozelo cair para os lados e progrida impacto e carga gradualmente",
  },
  {
    id: "system-passada-caminhando",
    source: "system",
    name: "Passada Caminhando",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps", "Glúteo Máximo"],
    secondaryMuscles: ["Adutores", "Posteriores", "Panturrilhas", "Core"],
    level: "intermediate",
    movementPattern: "Avanço dinâmico",
    startingPosition:
      "Mantenha os pés firmes, joelhos alinhados à direção dos pés, coluna neutra e abdome ativo",
    movementExecution:
      "Flexione quadris e joelhos com controle, distribua a pressão por todo o pé e suba estendendo as pernas sem perder o alinhamento",
    importantCautions:
      "Evite colapsar os joelhos para dentro, levantar os calcanhares ou arredondar a lombar; ajuste a amplitude à sua mobilidade",
  },
  {
    id: "system-pinca-com-anilhas",
    source: "system",
    name: "Pinça com Anilhas",
    muscleGroup: "forearms",
    primaryMuscles: ["Flexores dos Dedos", "Adutor do Polegar"],
    secondaryMuscles: ["Músculos da Mão", "Antebraços"],
    level: "beginner",
    movementPattern: "Preensão em pinça",
    startingPosition:
      "Apoie ou estabilize o antebraço conforme a variação e mantenha ombros relaxados",
    movementExecution:
      "Mova o punho, antebraço ou dedos pela amplitude confortável, aperte ou sustente a pegada e retorne de modo lento",
    importantCautions:
      "Use carga moderada, evite movimentos bruscos e interrompa diante de formigamento ou dor no punho e cotovelo",
  },
  {
    id: "system-ponte-de-gluteos",
    source: "system",
    name: "Ponte de Glúteos",
    muscleGroup: "glutes",
    primaryMuscles: ["Glúteo Máximo"],
    secondaryMuscles: ["Isquiotibiais", "Core"],
    level: "beginner",
    movementPattern: "Extensão de quadril",
    startingPosition:
      "Posicione os pés estáveis, contraia o abdome, mantenha a coluna neutra e leve os quadris para trás",
    movementExecution:
      "Desloque o quadril para trás mantendo a carga próxima ao corpo; estenda o quadril contraindo os glúteos, sem hiperestender a lombar",
    importantCautions:
      "Não transforme o movimento em agachamento nem arredonde a coluna; progrida a carga somente com a trajetória dominada",
  },
  {
    id: "system-prancha-copenhagen",
    source: "system",
    name: "Prancha Copenhagen",
    muscleGroup: "adductors",
    primaryMuscles: ["Adutores do Quadril"],
    secondaryMuscles: ["Oblíquos", "Glúteos", "Ombros"],
    level: "advanced",
    movementPattern: "Adução isométrica",
    startingPosition:
      "Adote postura estável, mantenha pescoço relaxado e escápulas controladas antes de mover o braço ou a perna",
    movementExecution:
      "Conduza o segmento no plano indicado, com velocidade constante e amplitude sem dor; retorne resistindo à carga",
    importantCautions:
      "Evite compensar com inclinação ou rotação do tronco e não ultrapasse a amplitude que preserve a articulação confortável",
  },
  {
    id: "system-prancha-frontal",
    source: "system",
    name: "Prancha Frontal",
    muscleGroup: "core",
    primaryMuscles: ["Transverso do Abdome", "Reto Abdominal"],
    secondaryMuscles: ["Oblíquos", "Glúteos", "Serrátil"],
    level: "beginner",
    movementPattern: "Anti-extensão",
    startingPosition:
      "Organize costelas e pelve, contraia o abdome e mantenha a respiração contínua",
    movementExecution:
      "Execute o movimento ou sustente a posição sem perder o alinhamento lombopélvico, avançando apenas até onde mantém controle",
    importantCautions:
      "Evite prender a respiração, arquear a lombar ou compensar com pescoço e ombros; encerre a série ao perder a postura",
  },
  {
    id: "system-prancha-lateral",
    source: "system",
    name: "Prancha Lateral",
    muscleGroup: "core",
    primaryMuscles: ["Oblíquos", "Quadrado Lombar"],
    secondaryMuscles: ["Glúteo Médio", "Transverso", "Ombros"],
    level: "beginner",
    movementPattern: "Anti-flexão lateral",
    startingPosition:
      "Organize costelas e pelve, contraia o abdome e mantenha a respiração contínua",
    movementExecution:
      "Execute o movimento ou sustente a posição sem perder o alinhamento lombopélvico, avançando apenas até onde mantém controle",
    importantCautions:
      "Evite prender a respiração, arquear a lombar ou compensar com pescoço e ombros; encerre a série ao perder a postura",
  },
  {
    id: "system-pronacao-do-antebraco",
    source: "system",
    name: "Pronação do Antebraço",
    muscleGroup: "forearms",
    primaryMuscles: ["Pronador Redondo", "Pronador Quadrado"],
    secondaryMuscles: ["Flexores do Punho"],
    level: "intermediate",
    movementPattern: "Pronação",
    startingPosition:
      "Apoie ou estabilize o antebraço conforme a variação e mantenha ombros relaxados",
    movementExecution:
      "Mova o punho, antebraço ou dedos pela amplitude confortável, aperte ou sustente a pegada e retorne de modo lento",
    importantCautions:
      "Use carga moderada, evite movimentos bruscos e interrompa diante de formigamento ou dor no punho e cotovelo",
  },
  {
    id: "system-pular-corda",
    source: "system",
    name: "Pular Corda",
    muscleGroup: "calves",
    primaryMuscles: ["Gastrocnêmio", "Sóleo"],
    secondaryMuscles: ["Ombros", "Antebraços", "Core"],
    level: "beginner",
    movementPattern: "Saltos cíclicos",
    startingPosition:
      "Apoie o pé com estabilidade e mantenha tornozelo, joelho e quadril alinhados",
    movementExecution:
      "Percorra a amplitude disponível do tornozelo, faça uma breve contração no final e retorne lentamente; em saltos, aterrisse suavemente",
    importantCautions:
      "Não balance o corpo, não deixe o tornozelo cair para os lados e progrida impacto e carga gradualmente",
  },
  {
    id: "system-pulldown-com-bracos-estendidos",
    source: "system",
    name: "Pulldown com Braços Estendidos",
    muscleGroup: "back",
    primaryMuscles: ["Latíssimo do Dorso"],
    secondaryMuscles: ["Redondo Maior", "Tríceps (cabeça Longa)", "Core"],
    level: "beginner",
    movementPattern: "Extensão de ombro",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-pullover",
    source: "system",
    name: "Pullover",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior", "Latíssimo do Dorso"],
    secondaryMuscles: ["Tríceps (cabeça Longa)", "Serrátil Anterior"],
    level: "intermediate",
    movementPattern: "Extensão de ombro",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-pull-through",
    source: "system",
    name: "Pull-through",
    muscleGroup: "hamstrings",
    primaryMuscles: ["Glúteo Máximo", "Isquiotibiais"],
    secondaryMuscles: ["Adutores", "Core"],
    level: "beginner",
    movementPattern: "Dobradiça de quadril",
    startingPosition:
      "Posicione os pés estáveis, contraia o abdome, mantenha a coluna neutra e leve os quadris para trás",
    movementExecution:
      "Desloque o quadril para trás mantendo a carga próxima ao corpo; estenda o quadril contraindo os glúteos, sem hiperestender a lombar",
    importantCautions:
      "Não transforme o movimento em agachamento nem arredonde a coluna; progrida a carga somente com a trajetória dominada",
  },
  {
    id: "system-puxada-frontal",
    source: "system",
    name: "Puxada Frontal",
    muscleGroup: "back",
    primaryMuscles: ["Latíssimo do Dorso"],
    secondaryMuscles: ["Bíceps", "Braquial", "Romboides", "Trapézio Inferior"],
    level: "beginner",
    movementPattern: "Puxar vertical",
    startingPosition:
      "Estabilize o tronco, mantenha peito aberto e ombros afastados das orelhas; ajuste a pegada e o apoio",
    movementExecution:
      "Inicie organizando as escápulas e puxe com os cotovelos na direção exigida pelo movimento; retorne controlando o alongamento",
    importantCautions:
      "Evite embalo, excesso de extensão lombar e projetar a cabeça; preserve o punho neutro e não force a amplitude",
  },
  {
    id: "system-puxada-neutra",
    source: "system",
    name: "Puxada Neutra",
    muscleGroup: "back",
    primaryMuscles: ["Latíssimo do Dorso"],
    secondaryMuscles: ["Bíceps", "Braquial", "Romboides"],
    level: "beginner",
    movementPattern: "Puxar vertical",
    startingPosition:
      "Estabilize o tronco, mantenha peito aberto e ombros afastados das orelhas; ajuste a pegada e o apoio",
    movementExecution:
      "Inicie organizando as escápulas e puxe com os cotovelos na direção exigida pelo movimento; retorne controlando o alongamento",
    importantCautions:
      "Evite embalo, excesso de extensão lombar e projetar a cabeça; preserve o punho neutro e não force a amplitude",
  },
  {
    id: "system-puxada-unilateral",
    source: "system",
    name: "Puxada Unilateral",
    muscleGroup: "back",
    primaryMuscles: ["Latíssimo do Dorso"],
    secondaryMuscles: ["Bíceps", "Romboides", "Oblíquos"],
    level: "intermediate",
    movementPattern: "Puxar vertical unilateral",
    startingPosition:
      "Estabilize o tronco, mantenha peito aberto e ombros afastados das orelhas; ajuste a pegada e o apoio",
    movementExecution:
      "Inicie organizando as escápulas e puxe com os cotovelos na direção exigida pelo movimento; retorne controlando o alongamento",
    importantCautions:
      "Evite embalo, excesso de extensão lombar e projetar a cabeça; preserve o punho neutro e não force a amplitude",
  },
  {
    id: "system-remada-alta",
    source: "system",
    name: "Remada Alta",
    muscleGroup: "shoulders",
    primaryMuscles: ["Deltoide Lateral"],
    secondaryMuscles: ["Trapézio Superior", "Bíceps"],
    level: "intermediate",
    movementPattern: "Puxar vertical curto",
    startingPosition:
      "Estabilize o tronco, mantenha peito aberto e ombros afastados das orelhas; ajuste a pegada e o apoio",
    movementExecution:
      "Inicie organizando as escápulas e puxe com os cotovelos na direção exigida pelo movimento; retorne controlando o alongamento",
    importantCautions:
      "Evite embalo, excesso de extensão lombar e projetar a cabeça; preserve o punho neutro e não force a amplitude",
  },
  {
    id: "system-remada-baixa",
    source: "system",
    name: "Remada Baixa",
    muscleGroup: "back",
    primaryMuscles: ["Latíssimo do Dorso", "Romboides"],
    secondaryMuscles: ["Trapézio", "Deltoide Posterior", "Bíceps"],
    level: "beginner",
    movementPattern: "Puxar horizontal",
    startingPosition:
      "Estabilize o tronco, mantenha peito aberto e ombros afastados das orelhas; ajuste a pegada e o apoio",
    movementExecution:
      "Inicie organizando as escápulas e puxe com os cotovelos na direção exigida pelo movimento; retorne controlando o alongamento",
    importantCautions:
      "Evite embalo, excesso de extensão lombar e projetar a cabeça; preserve o punho neutro e não force a amplitude",
  },
  {
    id: "system-remada-cavalinho",
    source: "system",
    name: "Remada Cavalinho",
    muscleGroup: "back",
    primaryMuscles: ["Latíssimo do Dorso", "Romboides"],
    secondaryMuscles: ["Trapézio", "Deltoide Posterior", "Bíceps", "Eretores"],
    level: "intermediate",
    movementPattern: "Puxar horizontal inclinado",
    startingPosition:
      "Estabilize o tronco, mantenha peito aberto e ombros afastados das orelhas; ajuste a pegada e o apoio",
    movementExecution:
      "Inicie organizando as escápulas e puxe com os cotovelos na direção exigida pelo movimento; retorne controlando o alongamento",
    importantCautions:
      "Evite embalo, excesso de extensão lombar e projetar a cabeça; preserve o punho neutro e não force a amplitude",
  },
  {
    id: "system-remada-curvada",
    source: "system",
    name: "Remada Curvada",
    muscleGroup: "back",
    primaryMuscles: ["Latíssimo do Dorso", "Romboides"],
    secondaryMuscles: ["Trapézio", "Deltoide Posterior", "Bíceps", "Eretores da Coluna"],
    level: "intermediate",
    movementPattern: "Puxar horizontal inclinado",
    startingPosition:
      "Estabilize o tronco, mantenha peito aberto e ombros afastados das orelhas; ajuste a pegada e o apoio",
    movementExecution:
      "Inicie organizando as escápulas e puxe com os cotovelos na direção exigida pelo movimento; retorne controlando o alongamento",
    importantCautions:
      "Evite embalo, excesso de extensão lombar e projetar a cabeça; preserve o punho neutro e não force a amplitude",
  },
  {
    id: "system-remada-invertida",
    source: "system",
    name: "Remada Invertida",
    muscleGroup: "back",
    primaryMuscles: ["Romboides", "Latíssimo do Dorso"],
    secondaryMuscles: ["Bíceps", "Deltoide Posterior", "Core"],
    level: "intermediate",
    movementPattern: "Puxar horizontal",
    startingPosition:
      "Estabilize o tronco, mantenha peito aberto e ombros afastados das orelhas; ajuste a pegada e o apoio",
    movementExecution:
      "Inicie organizando as escápulas e puxe com os cotovelos na direção exigida pelo movimento; retorne controlando o alongamento",
    importantCautions:
      "Evite embalo, excesso de extensão lombar e projetar a cabeça; preserve o punho neutro e não force a amplitude",
  },
  {
    id: "system-remada-unilateral",
    source: "system",
    name: "Remada Unilateral",
    muscleGroup: "back",
    primaryMuscles: ["Latíssimo do Dorso"],
    secondaryMuscles: ["Romboides", "Trapézio", "Deltoide Posterior", "Bíceps"],
    level: "beginner",
    movementPattern: "Puxar horizontal unilateral",
    startingPosition:
      "Estabilize o tronco, mantenha peito aberto e ombros afastados das orelhas; ajuste a pegada e o apoio",
    movementExecution:
      "Inicie organizando as escápulas e puxe com os cotovelos na direção exigida pelo movimento; retorne controlando o alongamento",
    importantCautions:
      "Evite embalo, excesso de extensão lombar e projetar a cabeça; preserve o punho neutro e não force a amplitude",
  },
  {
    id: "system-reverse-hyper",
    source: "system",
    name: "Reverse Hyper",
    muscleGroup: "lower_back",
    primaryMuscles: ["Glúteo Máximo", "Eretores"],
    secondaryMuscles: ["Isquiotibiais", "Core"],
    level: "intermediate",
    movementPattern: "Extensão de quadril apoiada",
    startingPosition:
      "Posicione os pés estáveis, contraia o abdome, mantenha a coluna neutra e leve os quadris para trás",
    movementExecution:
      "Desloque o quadril para trás mantendo a carga próxima ao corpo; estenda o quadril contraindo os glúteos, sem hiperestender a lombar",
    importantCautions:
      "Não transforme o movimento em agachamento nem arredonde a coluna; progrida a carga somente com a trajetória dominada",
  },
  {
    id: "system-rosca-alternada",
    source: "system",
    name: "Rosca Alternada",
    muscleGroup: "biceps",
    primaryMuscles: ["Bíceps Braquial"],
    secondaryMuscles: ["Braquial", "Braquiorradial"],
    level: "beginner",
    movementPattern: "Flexão alternada de cotovelo",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-rosca-aranha",
    source: "system",
    name: "Rosca Aranha",
    muscleGroup: "biceps",
    primaryMuscles: ["Bíceps Braquial"],
    secondaryMuscles: ["Braquial", "Braquiorradial"],
    level: "intermediate",
    movementPattern: "Flexão de cotovelo em pronação do tronco",
    startingPosition:
      "Mantenha o tronco estável, ombros baixos e cotovelos próximos da posição definida para a variação",
    movementExecution:
      "Flexione os cotovelos sem deslocá-los desnecessariamente, contraia o bíceps e desça controlando até a extensão confortável",
    importantCautions:
      "Evite balanço do tronco, punhos dobrados e cargas que façam o ombro assumir o movimento",
  },
  {
    id: "system-rosca-bayesian",
    source: "system",
    name: "Rosca Bayesian",
    muscleGroup: "biceps",
    primaryMuscles: ["Bíceps Braquial"],
    secondaryMuscles: ["Braquial", "Deltoide Anterior"],
    level: "intermediate",
    movementPattern: "Flexão de cotovelo com braço atrás",
    startingPosition:
      "Mantenha o tronco estável, ombros baixos e cotovelos próximos da posição definida para a variação",
    movementExecution:
      "Flexione os cotovelos sem deslocá-los desnecessariamente, contraia o bíceps e desça controlando até a extensão confortável",
    importantCautions:
      "Evite balanço do tronco, punhos dobrados e cargas que façam o ombro assumir o movimento",
  },
  {
    id: "system-rosca-biceps",
    source: "system",
    name: "Rosca Bíceps",
    muscleGroup: "biceps",
    primaryMuscles: ["Bíceps Braquial"],
    secondaryMuscles: ["Braquial", "Braquiorradial", "Antebraços"],
    level: "beginner",
    movementPattern: "Flexão de cotovelo",
    startingPosition:
      "Mantenha o tronco estável, ombros baixos e cotovelos próximos da posição definida para a variação",
    movementExecution:
      "Flexione os cotovelos sem deslocá-los desnecessariamente, contraia o bíceps e desça controlando até a extensão confortável",
    importantCautions:
      "Evite balanço do tronco, punhos dobrados e cargas que façam o ombro assumir o movimento",
  },
  {
    id: "system-rosca-concentrada",
    source: "system",
    name: "Rosca Concentrada",
    muscleGroup: "biceps",
    primaryMuscles: ["Bíceps Braquial"],
    secondaryMuscles: ["Braquial", "Antebraços"],
    level: "beginner",
    movementPattern: "Flexão unilateral apoiada",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-rosca-de-dedos",
    source: "system",
    name: "Rosca de Dedos",
    muscleGroup: "forearms",
    primaryMuscles: ["Flexores dos Dedos"],
    secondaryMuscles: ["Flexores do Punho"],
    level: "intermediate",
    movementPattern: "Flexão dos dedos",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-rosca-inclinada",
    source: "system",
    name: "Rosca Inclinada",
    muscleGroup: "biceps",
    primaryMuscles: ["Bíceps Braquial"],
    secondaryMuscles: ["Braquial", "Braquiorradial"],
    level: "intermediate",
    movementPattern: "Flexão de cotovelo alongada",
    startingPosition:
      "Mantenha o tronco estável, ombros baixos e cotovelos próximos da posição definida para a variação",
    movementExecution:
      "Flexione os cotovelos sem deslocá-los desnecessariamente, contraia o bíceps e desça controlando até a extensão confortável",
    importantCautions:
      "Evite balanço do tronco, punhos dobrados e cargas que façam o ombro assumir o movimento",
  },
  {
    id: "system-rosca-inversa",
    source: "system",
    name: "Rosca Inversa",
    muscleGroup: "biceps",
    primaryMuscles: ["Braquiorradial", "Extensores do Antebraço"],
    secondaryMuscles: ["Braquial", "Bíceps"],
    level: "intermediate",
    movementPattern: "Flexão pronada de cotovelo",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-rosca-martelo",
    source: "system",
    name: "Rosca Martelo",
    muscleGroup: "biceps",
    primaryMuscles: ["Braquial", "Braquiorradial"],
    secondaryMuscles: ["Bíceps Braquial", "Antebraços"],
    level: "beginner",
    movementPattern: "Flexão neutra de cotovelo",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-rosca-scott",
    source: "system",
    name: "Rosca Scott",
    muscleGroup: "biceps",
    primaryMuscles: ["Bíceps Braquial"],
    secondaryMuscles: ["Braquial", "Braquiorradial"],
    level: "beginner",
    movementPattern: "Flexão de cotovelo apoiada",
    startingPosition:
      "Mantenha o tronco estável, ombros baixos e cotovelos próximos da posição definida para a variação",
    movementExecution:
      "Flexione os cotovelos sem deslocá-los desnecessariamente, contraia o bíceps e desça controlando até a extensão confortável",
    importantCautions:
      "Evite balanço do tronco, punhos dobrados e cargas que façam o ombro assumir o movimento",
  },
  {
    id: "system-rosca-zottman",
    source: "system",
    name: "Rosca Zottman",
    muscleGroup: "biceps",
    primaryMuscles: ["Bíceps", "Braquiorradial"],
    secondaryMuscles: ["Braquial", "Flexores e Extensores do Antebraço"],
    level: "intermediate",
    movementPattern: "Flexão com rotação",
    startingPosition:
      "Adote postura estável, mantenha pescoço relaxado e escápulas controladas antes de mover o braço ou a perna",
    movementExecution:
      "Conduza o segmento no plano indicado, com velocidade constante e amplitude sem dor; retorne resistindo à carga",
    importantCautions:
      "Evite compensar com inclinação ou rotação do tronco e não ultrapasse a amplitude que preserve a articulação confortável",
  },
  {
    id: "system-rotacao-externa-de-ombro",
    source: "system",
    name: "Rotação Externa de Ombro",
    muscleGroup: "shoulders",
    primaryMuscles: ["Infraespinal", "Redondo Menor"],
    secondaryMuscles: ["Deltoide Posterior"],
    level: "beginner",
    movementPattern: "Rotação externa",
    startingPosition:
      "Adote postura estável, mantenha pescoço relaxado e escápulas controladas antes de mover o braço ou a perna",
    movementExecution:
      "Conduza o segmento no plano indicado, com velocidade constante e amplitude sem dor; retorne resistindo à carga",
    importantCautions:
      "Evite compensar com inclinação ou rotação do tronco e não ultrapasse a amplitude que preserve a articulação confortável",
  },
  {
    id: "system-russian-twist",
    source: "system",
    name: "Russian Twist",
    muscleGroup: "core",
    primaryMuscles: ["Oblíquos"],
    secondaryMuscles: ["Reto Abdominal", "Flexores do Quadril"],
    level: "intermediate",
    movementPattern: "Rotação de tronco",
    startingPosition:
      "Adote postura estável, mantenha pescoço relaxado e escápulas controladas antes de mover o braço ou a perna",
    movementExecution:
      "Conduza o segmento no plano indicado, com velocidade constante e amplitude sem dor; retorne resistindo à carga",
    importantCautions:
      "Evite compensar com inclinação ou rotação do tronco e não ultrapasse a amplitude que preserve a articulação confortável",
  },
  {
    id: "system-saltos-na-ponta-dos-pes",
    source: "system",
    name: "Saltos na Ponta dos Pés",
    muscleGroup: "calves",
    primaryMuscles: ["Gastrocnêmio", "Sóleo"],
    secondaryMuscles: ["Quadríceps", "Músculos do Pé"],
    level: "intermediate",
    movementPattern: "Flexão plantar explosiva",
    startingPosition:
      "Apoie o pé com estabilidade e mantenha tornozelo, joelho e quadril alinhados",
    movementExecution:
      "Percorra a amplitude disponível do tornozelo, faça uma breve contração no final e retorne lentamente; em saltos, aterrisse suavemente",
    importantCautions:
      "Não balance o corpo, não deixe o tornozelo cair para os lados e progrida impacto e carga gradualmente",
  },
  {
    id: "system-snatch",
    source: "system",
    name: "Snatch",
    muscleGroup: "full_body",
    primaryMuscles: ["Glúteos", "Quadríceps", "Trapézio", "Ombros"],
    secondaryMuscles: ["Posteriores", "Tríceps", "Core"],
    level: "advanced",
    movementPattern: "Puxada olímpica acima da cabeça",
    startingPosition:
      "Estabilize o tronco, mantenha peito aberto e ombros afastados das orelhas; ajuste a pegada e o apoio",
    movementExecution:
      "Inicie organizando as escápulas e puxe com os cotovelos na direção exigida pelo movimento; retorne controlando o alongamento",
    importantCautions:
      "Evite embalo, excesso de extensão lombar e projetar a cabeça; preserve o punho neutro e não force a amplitude",
  },
  {
    id: "system-step-up",
    source: "system",
    name: "Step-up",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps", "Glúteo Máximo"],
    secondaryMuscles: ["Posteriores", "Panturrilhas", "Core"],
    level: "beginner",
    movementPattern: "Subida unilateral",
    startingPosition:
      "Mantenha os pés firmes, joelhos alinhados à direção dos pés, coluna neutra e abdome ativo",
    movementExecution:
      "Flexione quadris e joelhos com controle, distribua a pressão por todo o pé e suba estendendo as pernas sem perder o alinhamento",
    importantCautions:
      "Evite colapsar os joelhos para dentro, levantar os calcanhares ou arredondar a lombar; ajuste a amplitude à sua mobilidade",
  },
  {
    id: "system-suitcase-carry",
    source: "system",
    name: "Suitcase Carry",
    muscleGroup: "core",
    primaryMuscles: ["Oblíquos", "Quadrado Lombar"],
    secondaryMuscles: ["Antebraços", "Trapézio", "Glúteos"],
    level: "intermediate",
    movementPattern: "Anti-flexão lateral em marcha",
    startingPosition:
      "Organize costelas e pelve, contraia o abdome e mantenha a respiração contínua",
    movementExecution:
      "Execute o movimento ou sustente a posição sem perder o alinhamento lombopélvico, avançando apenas até onde mantém controle",
    importantCautions:
      "Evite prender a respiração, arquear a lombar ou compensar com pescoço e ombros; encerre a série ao perder a postura",
  },
  {
    id: "system-superman",
    source: "system",
    name: "Superman",
    muscleGroup: "lower_back",
    primaryMuscles: ["Eretores da Coluna"],
    secondaryMuscles: ["Glúteos", "Posteriores", "Deltoide Posterior"],
    level: "beginner",
    movementPattern: "Extensão de tronco",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-supinacao-do-antebraco",
    source: "system",
    name: "Supinação do Antebraço",
    muscleGroup: "forearms",
    primaryMuscles: ["Supinador", "Bíceps Braquial"],
    secondaryMuscles: ["Braquiorradial"],
    level: "intermediate",
    movementPattern: "Supinação",
    startingPosition:
      "Apoie ou estabilize o antebraço conforme a variação e mantenha ombros relaxados",
    movementExecution:
      "Mova o punho, antebraço ou dedos pela amplitude confortável, aperte ou sustente a pegada e retorne de modo lento",
    importantCautions:
      "Use carga moderada, evite movimentos bruscos e interrompa diante de formigamento ou dor no punho e cotovelo",
  },
  {
    id: "system-supino-declinado",
    source: "system",
    name: "Supino Declinado",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior"],
    secondaryMuscles: ["Tríceps", "Deltoide Anterior"],
    level: "intermediate",
    movementPattern: "Empurrar declinado",
    startingPosition:
      "Crie uma base estável, mantenha punhos alinhados, escápulas controladas e abdome ativo",
    movementExecution:
      "Empurre a resistência pela trajetória confortável, estenda os braços sem travar agressivamente os cotovelos e retorne com controle",
    importantCautions:
      "Evite abrir ou fechar demais os cotovelos, perder a posição dos ombros ou compensar com arqueamento lombar excessivo",
  },
  {
    id: "system-supino-fechado",
    source: "system",
    name: "Supino Fechado",
    muscleGroup: "triceps",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Peitoral Maior", "Deltoide Anterior"],
    level: "intermediate",
    movementPattern: "Empurrar horizontal fechado",
    startingPosition:
      "Crie uma base estável, mantenha punhos alinhados, escápulas controladas e abdome ativo",
    movementExecution:
      "Empurre a resistência pela trajetória confortável, estenda os braços sem travar agressivamente os cotovelos e retorne com controle",
    importantCautions:
      "Evite abrir ou fechar demais os cotovelos, perder a posição dos ombros ou compensar com arqueamento lombar excessivo",
  },
  {
    id: "system-supino-inclinado",
    source: "system",
    name: "Supino Inclinado",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior"],
    secondaryMuscles: ["Tríceps", "Deltoide Anterior"],
    level: "intermediate",
    movementPattern: "Empurrar inclinado",
    startingPosition:
      "Crie uma base estável, mantenha punhos alinhados, escápulas controladas e abdome ativo",
    movementExecution:
      "Empurre a resistência pela trajetória confortável, estenda os braços sem travar agressivamente os cotovelos e retorne com controle",
    importantCautions:
      "Evite abrir ou fechar demais os cotovelos, perder a posição dos ombros ou compensar com arqueamento lombar excessivo",
  },
  {
    id: "system-supino-reto",
    source: "system",
    name: "Supino Reto",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior"],
    secondaryMuscles: ["Tríceps", "Deltoide Anterior"],
    level: "intermediate",
    movementPattern: "Empurrar horizontal",
    startingPosition:
      "Crie uma base estável, mantenha punhos alinhados, escápulas controladas e abdome ativo",
    movementExecution:
      "Empurre a resistência pela trajetória confortável, estenda os braços sem travar agressivamente os cotovelos e retorne com controle",
    importantCautions:
      "Evite abrir ou fechar demais os cotovelos, perder a posição dos ombros ou compensar com arqueamento lombar excessivo",
  },
  {
    id: "system-swing",
    source: "system",
    name: "Swing",
    muscleGroup: "hamstrings",
    primaryMuscles: ["Glúteo Máximo", "Isquiotibiais"],
    secondaryMuscles: ["Eretores", "Core", "Deltoides"],
    level: "intermediate",
    movementPattern: "Dobradiça explosiva",
    startingPosition:
      "Posicione os pés estáveis, contraia o abdome, mantenha a coluna neutra e leve os quadris para trás",
    movementExecution:
      "Desloque o quadril para trás mantendo a carga próxima ao corpo; estenda o quadril contraindo os glúteos, sem hiperestender a lombar",
    importantCautions:
      "Não transforme o movimento em agachamento nem arredonde a coluna; progrida a carga somente com a trajetória dominada",
  },
  {
    id: "system-thruster",
    source: "system",
    name: "Thruster",
    muscleGroup: "full_body",
    primaryMuscles: ["Quadríceps", "Glúteos", "Deltoides"],
    secondaryMuscles: ["Tríceps", "Core", "Panturrilhas"],
    level: "intermediate",
    movementPattern: "Agachar e empurrar",
    startingPosition:
      "Mantenha os pés firmes, joelhos alinhados à direção dos pés, coluna neutra e abdome ativo",
    movementExecution:
      "Flexione quadris e joelhos com controle, distribua a pressão por todo o pé e suba estendendo as pernas sem perder o alinhamento",
    importantCautions:
      "Evite colapsar os joelhos para dentro, levantar os calcanhares ou arredondar a lombar; ajuste a amplitude à sua mobilidade",
  },
  {
    id: "system-tibial-anterior",
    source: "system",
    name: "Tibial Anterior",
    muscleGroup: "calves",
    primaryMuscles: ["Tibial Anterior"],
    secondaryMuscles: ["Extensores dos Dedos"],
    level: "beginner",
    movementPattern: "Dorsiflexão",
    startingPosition:
      "Apoie o pé com estabilidade e mantenha tornozelo, joelho e quadril alinhados",
    movementExecution:
      "Percorra a amplitude disponível do tornozelo, faça uma breve contração no final e retorne lentamente; em saltos, aterrisse suavemente",
    importantCautions:
      "Não balance o corpo, não deixe o tornozelo cair para os lados e progrida impacto e carga gradualmente",
  },
  {
    id: "system-triceps-coice",
    source: "system",
    name: "Tríceps Coice",
    muscleGroup: "triceps",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Ancôneo", "Deltoide Posterior"],
    level: "beginner",
    movementPattern: "Extensão de cotovelo com braço atrás",
    startingPosition:
      "Estabilize ombros e tronco, alinhe punhos e mantenha os cotovelos na posição adequada à variação",
    movementExecution:
      "Estenda os cotovelos até contrair o tríceps e retorne lentamente, preservando a posição do braço",
    importantCautions:
      "Não use impulso nem deixe os cotovelos abrirem sem controle; reduza amplitude ou carga se houver desconforto no cotovelo",
  },
  {
    id: "system-triceps-frances",
    source: "system",
    name: "Tríceps Francês",
    muscleGroup: "triceps",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Ancôneo", "Core"],
    level: "intermediate",
    movementPattern: "Extensão acima da cabeça",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
  {
    id: "system-triceps-na-polia",
    source: "system",
    name: "Tríceps na Polia",
    muscleGroup: "triceps",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Ancôneo", "Antebraços"],
    level: "beginner",
    movementPattern: "Extensão de cotovelo",
    startingPosition:
      "Estabilize ombros e tronco, alinhe punhos e mantenha os cotovelos na posição adequada à variação",
    movementExecution:
      "Estenda os cotovelos até contrair o tríceps e retorne lentamente, preservando a posição do braço",
    importantCautions:
      "Não use impulso nem deixe os cotovelos abrirem sem controle; reduza amplitude ou carga se houver desconforto no cotovelo",
  },
  {
    id: "system-triceps-testa",
    source: "system",
    name: "Tríceps Testa",
    muscleGroup: "triceps",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Ancôneo"],
    level: "intermediate",
    movementPattern: "Extensão de cotovelo deitado",
    startingPosition:
      "Estabilize ombros e tronco, alinhe punhos e mantenha os cotovelos na posição adequada à variação",
    movementExecution:
      "Estenda os cotovelos até contrair o tríceps e retorne lentamente, preservando a posição do braço",
    importantCautions:
      "Não use impulso nem deixe os cotovelos abrirem sem controle; reduza amplitude ou carga se houver desconforto no cotovelo",
  },
  {
    id: "system-woodchopper",
    source: "system",
    name: "Woodchopper",
    muscleGroup: "core",
    primaryMuscles: ["Oblíquos"],
    secondaryMuscles: ["Reto Abdominal", "Serrátil", "Glúteos"],
    level: "intermediate",
    movementPattern: "Rotação diagonal",
    startingPosition:
      "Adote postura estável, mantenha pescoço relaxado e escápulas controladas antes de mover o braço ou a perna",
    movementExecution:
      "Conduza o segmento no plano indicado, com velocidade constante e amplitude sem dor; retorne resistindo à carga",
    importantCautions:
      "Evite compensar com inclinação ou rotação do tronco e não ultrapasse a amplitude que preserve a articulação confortável",
  },
  {
    id: "system-wrist-roller",
    source: "system",
    name: "Wrist Roller",
    muscleGroup: "forearms",
    primaryMuscles: ["Flexores e Extensores do Punho"],
    secondaryMuscles: ["Flexores dos Dedos", "Ombros"],
    level: "intermediate",
    movementPattern: "Enrolar carga",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
]

function normalizedMuscleName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
}

export const muscleOptions = [
  ...new Map(
    systemExercises
      .flatMap(exercise => [...exercise.primaryMuscles, ...exercise.secondaryMuscles])
      .map(muscle => [normalizedMuscleName(muscle), muscle])
  ).values(),
].sort((left, right) => left.localeCompare(right, "pt-BR"))
