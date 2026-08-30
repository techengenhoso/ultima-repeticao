import type { DefaultExercise, Muscle } from "@/lib/exercises/types"
import { muscles } from "@/lib/options-select"

type DefaultExerciseSeed = Omit<DefaultExercise, "primaryMuscles" | "secondaryMuscles"> & {
  primaryMuscles: string[]
  secondaryMuscles: string[]
}

const defaultExerciseSeeds: DefaultExerciseSeed[] = [
  {
    id: "system-ab-wheel",
    source: "default",
    name: "Ab Wheel",
    muscleGroup: "core",
    primaryMuscles: ["Reto Abdominal", "Transverso"],
    secondaryMuscles: ["Latíssimo", "Serrátil", "Ombros", "Glúteos"],
    difficulty: "hard",
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
    source: "default",
    name: "Abdominal Crunch",
    muscleGroup: "core",
    primaryMuscles: ["Reto Abdominal"],
    secondaryMuscles: ["Oblíquos", "Transverso"],
    difficulty: "easy",
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
    source: "default",
    name: "Abdução de Quadril",
    muscleGroup: "glutes",
    primaryMuscles: ["Glúteo Médio", "Glúteo Mínimo"],
    secondaryMuscles: ["Tensor da Fáscia Lata"],
    difficulty: "easy",
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
    source: "default",
    name: "Abdução Lateral Deitada",
    muscleGroup: "glutes",
    primaryMuscles: ["Glúteo Médio"],
    secondaryMuscles: ["Glúteo Mínimo", "Tensor da Fáscia Lata"],
    difficulty: "easy",
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
    source: "default",
    name: "Adutora de Quadril",
    muscleGroup: "adductors",
    primaryMuscles: ["Adutores do Quadril"],
    secondaryMuscles: ["Grácil", "Pectíneo"],
    difficulty: "easy",
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
    source: "default",
    name: "Afundo",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps", "Glúteo Máximo"],
    secondaryMuscles: ["Adutores", "Posteriores", "Panturrilhas", "Core"],
    difficulty: "moderate",
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
    source: "default",
    name: "Afundo Lateral",
    muscleGroup: "adductors",
    primaryMuscles: ["Adutores", "Glúteo Máximo"],
    secondaryMuscles: ["Quadríceps", "Posteriores", "Core"],
    difficulty: "moderate",
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
    source: "default",
    name: "Afundo Reverso",
    muscleGroup: "glutes",
    primaryMuscles: ["Glúteo Máximo", "Quadríceps"],
    secondaryMuscles: ["Adutores", "Posteriores", "Core"],
    difficulty: "moderate",
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
    source: "default",
    name: "Agachamento Búlgaro",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps", "Glúteo Máximo"],
    secondaryMuscles: ["Adutores", "Posteriores", "Core"],
    difficulty: "moderate",
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
    source: "default",
    name: "Agachamento Cossaco",
    muscleGroup: "adductors",
    primaryMuscles: ["Adutores", "Quadríceps"],
    secondaryMuscles: ["Glúteos", "Posteriores", "Core"],
    difficulty: "hard",
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
    source: "default",
    name: "Agachamento Espanhol",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps"],
    secondaryMuscles: ["Glúteos", "Core"],
    difficulty: "moderate",
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
    source: "default",
    name: "Agachamento Frontal",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps"],
    secondaryMuscles: ["Glúteo Máximo", "Adutores", "Core", "Eretores"],
    difficulty: "moderate",
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
    source: "default",
    name: "Agachamento Goblet",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps", "Glúteo Máximo"],
    secondaryMuscles: ["Adutores", "Core", "Eretores"],
    difficulty: "easy",
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
    source: "default",
    name: "Agachamento Hack",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps"],
    secondaryMuscles: ["Glúteo Máximo", "Adutores", "Posteriores"],
    difficulty: "moderate",
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
    source: "default",
    name: "Agachamento Livre",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps", "Glúteo Máximo"],
    secondaryMuscles: ["Adutores", "Posteriores", "Eretores", "Core"],
    difficulty: "moderate",
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
    source: "default",
    name: "Agachamento Sissy",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps"],
    secondaryMuscles: ["Core", "Flexores do Quadril"],
    difficulty: "hard",
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
    source: "default",
    name: "Agachamento Sumô",
    muscleGroup: "glutes",
    primaryMuscles: ["Glúteo Máximo", "Adutores"],
    secondaryMuscles: ["Quadríceps", "Posteriores", "Core"],
    difficulty: "moderate",
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
    source: "default",
    name: "Barra Fixa Pronada",
    muscleGroup: "back",
    primaryMuscles: ["Latíssimo do Dorso"],
    secondaryMuscles: ["Bíceps", "Braquial", "Romboides", "Trapézio"],
    difficulty: "moderate",
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
    source: "default",
    name: "Barra Fixa Supinada",
    muscleGroup: "back",
    primaryMuscles: ["Latíssimo do Dorso"],
    secondaryMuscles: ["Bíceps", "Braquial", "Romboides"],
    difficulty: "moderate",
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
    source: "default",
    name: "Bear Crawl",
    muscleGroup: "fullBody",
    primaryMuscles: ["Core", "Ombros"],
    secondaryMuscles: ["Quadríceps", "Glúteos", "Peitoral", "Tríceps"],
    difficulty: "moderate",
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
    source: "default",
    name: "Bird Dog",
    muscleGroup: "core",
    primaryMuscles: ["Multífidos", "Eretores da Coluna"],
    secondaryMuscles: ["Glúteos", "Transverso", "Ombros"],
    difficulty: "easy",
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
    source: "default",
    name: "Burpee",
    muscleGroup: "fullBody",
    primaryMuscles: ["Peitoral", "Quadríceps", "Glúteos"],
    secondaryMuscles: ["Tríceps", "Ombros", "Panturrilhas", "Core"],
    difficulty: "moderate",
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
    source: "default",
    name: "Cadeira Extensora",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps"],
    secondaryMuscles: [],
    difficulty: "easy",
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
    source: "default",
    name: "Cadeira Flexora",
    muscleGroup: "hamstrings",
    primaryMuscles: ["Isquiotibiais"],
    secondaryMuscles: ["Gastrocnêmio"],
    difficulty: "easy",
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
    source: "default",
    name: "Caminhada Lateral com Elástico",
    muscleGroup: "glutes",
    primaryMuscles: ["Glúteo Médio"],
    secondaryMuscles: ["Glúteo Máximo", "Quadríceps", "Core"],
    difficulty: "easy",
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
    source: "default",
    name: "Clean",
    muscleGroup: "fullBody",
    primaryMuscles: ["Glúteos", "Quadríceps", "Trapézio"],
    secondaryMuscles: ["Posteriores", "Panturrilhas", "Ombros", "Core"],
    difficulty: "hard",
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
    source: "default",
    name: "Clean And Press",
    muscleGroup: "fullBody",
    primaryMuscles: ["Quadríceps", "Glúteos", "Ombros"],
    secondaryMuscles: ["Trapézio", "Tríceps", "Posteriores", "Core"],
    difficulty: "hard",
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
    source: "default",
    name: "Coice de Glúteo",
    muscleGroup: "glutes",
    primaryMuscles: ["Glúteo Máximo"],
    secondaryMuscles: ["Isquiotibiais", "Core"],
    difficulty: "easy",
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
    source: "default",
    name: "Crossover Alto para Baixo",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior"],
    secondaryMuscles: ["Deltoide Anterior", "Serrátil Anterior"],
    difficulty: "moderate",
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
    source: "default",
    name: "Crossover Baixo para Cima",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior"],
    secondaryMuscles: ["Deltoide Anterior", "Serrátil Anterior"],
    difficulty: "moderate",
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
    source: "default",
    name: "Crucifixo Inclinado",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior"],
    secondaryMuscles: ["Deltoide Anterior", "Serrátil Anterior"],
    difficulty: "moderate",
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
    source: "default",
    name: "Crucifixo Inverso",
    muscleGroup: "shoulders",
    primaryMuscles: ["Deltoide Posterior"],
    secondaryMuscles: ["Romboides", "Trapézio Médio"],
    difficulty: "easy",
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
    source: "default",
    name: "Crucifixo Reto",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior"],
    secondaryMuscles: ["Deltoide Anterior", "Serrátil Anterior"],
    difficulty: "easy",
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
    source: "default",
    name: "Crunch Reverso",
    muscleGroup: "core",
    primaryMuscles: ["Reto Abdominal"],
    secondaryMuscles: ["Oblíquos", "Flexores do Quadril"],
    difficulty: "easy",
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
    source: "default",
    name: "Dead Bug",
    muscleGroup: "core",
    primaryMuscles: ["Transverso do Abdome"],
    secondaryMuscles: ["Reto Abdominal", "Oblíquos", "Flexores do Quadril"],
    difficulty: "easy",
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
    source: "default",
    name: "Dead Hang",
    muscleGroup: "forearms",
    primaryMuscles: ["Flexores dos Dedos", "Antebraços"],
    secondaryMuscles: ["Latíssimo", "Trapézio", "Ombros"],
    difficulty: "easy",
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
    source: "default",
    name: "Desenvolvimento Arnold",
    muscleGroup: "shoulders",
    primaryMuscles: ["Deltoide Anterior", "Deltoide Lateral"],
    secondaryMuscles: ["Tríceps", "Trapézio"],
    difficulty: "moderate",
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
    source: "default",
    name: "Desenvolvimento de Ombros",
    muscleGroup: "shoulders",
    primaryMuscles: ["Deltoide Anterior", "Deltoide Lateral"],
    secondaryMuscles: ["Tríceps", "Trapézio Superior"],
    difficulty: "moderate",
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
    source: "default",
    name: "Deslizamento Lateral",
    muscleGroup: "adductors",
    primaryMuscles: ["Adutores do Quadril"],
    secondaryMuscles: ["Glúteos", "Quadríceps", "Core"],
    difficulty: "moderate",
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
    source: "default",
    name: "Desvio Radial do Punho",
    muscleGroup: "forearms",
    primaryMuscles: ["Flexor Radial", "Extensor Radial do Carpo"],
    secondaryMuscles: ["Braquiorradial", "Músculos da Mão"],
    difficulty: "moderate",
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
    source: "default",
    name: "Donkey Calf Raise",
    muscleGroup: "calves",
    primaryMuscles: ["Gastrocnêmio"],
    secondaryMuscles: ["Sóleo", "Músculos do Pé"],
    difficulty: "moderate",
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
    source: "default",
    name: "Elevação de Joelhos na Barra",
    muscleGroup: "core",
    primaryMuscles: ["Reto Abdominal", "Flexores do Quadril"],
    secondaryMuscles: ["Oblíquos", "Antebraços", "Latíssimo"],
    difficulty: "moderate",
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
    source: "default",
    name: "Elevação de Panturrilha Agachado",
    muscleGroup: "calves",
    primaryMuscles: ["Sóleo"],
    secondaryMuscles: ["Gastrocnêmio", "Quadríceps"],
    difficulty: "moderate",
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
    source: "default",
    name: "Elevação de Panturrilha em Pé",
    muscleGroup: "calves",
    primaryMuscles: ["Gastrocnêmio"],
    secondaryMuscles: ["Sóleo", "Músculos do Pé"],
    difficulty: "easy",
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
    source: "default",
    name: "Elevação de Panturrilha Sentado",
    muscleGroup: "calves",
    primaryMuscles: ["Sóleo"],
    secondaryMuscles: ["Gastrocnêmio", "Músculos do Pé"],
    difficulty: "easy",
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
    source: "default",
    name: "Elevação de Pernas",
    muscleGroup: "core",
    primaryMuscles: ["Reto Abdominal", "Flexores do Quadril"],
    secondaryMuscles: ["Oblíquos", "Transverso"],
    difficulty: "moderate",
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
    source: "default",
    name: "Elevação em Y",
    muscleGroup: "shoulders",
    primaryMuscles: ["Trapézio Inferior", "Deltoide Posterior"],
    secondaryMuscles: ["Supraespinal", "Serrátil Anterior"],
    difficulty: "moderate",
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
    source: "default",
    name: "Elevação Frontal",
    muscleGroup: "shoulders",
    primaryMuscles: ["Deltoide Anterior"],
    secondaryMuscles: ["Peitoral Superior", "Serrátil Anterior"],
    difficulty: "easy",
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
    source: "default",
    name: "Elevação Lateral",
    muscleGroup: "shoulders",
    primaryMuscles: ["Deltoide Lateral"],
    secondaryMuscles: ["Trapézio Superior", "Supraespinal"],
    difficulty: "easy",
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
    source: "default",
    name: "Elevação Lateral Inclinada",
    muscleGroup: "shoulders",
    primaryMuscles: ["Deltoide Lateral"],
    secondaryMuscles: ["Supraespinal", "Trapézio"],
    difficulty: "moderate",
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
    source: "default",
    name: "Elevação Pélvica",
    muscleGroup: "glutes",
    primaryMuscles: ["Glúteo Máximo"],
    secondaryMuscles: ["Isquiotibiais", "Adutores", "Core"],
    difficulty: "easy",
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
    source: "default",
    name: "Elevação Pélvica Unilateral",
    muscleGroup: "glutes",
    primaryMuscles: ["Glúteo Máximo"],
    secondaryMuscles: ["Isquiotibiais", "Glúteo Médio", "Core"],
    difficulty: "moderate",
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
    source: "default",
    name: "Encolhimento de Ombros",
    muscleGroup: "back",
    primaryMuscles: ["Trapézio Superior"],
    secondaryMuscles: ["Levantador da Escápula", "Antebraços"],
    difficulty: "easy",
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
    source: "default",
    name: "Extensão Cruzada de Tríceps",
    muscleGroup: "triceps",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Ancôneo", "Deltoide Posterior"],
    difficulty: "moderate",
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
    source: "default",
    name: "Extensão de Punho",
    muscleGroup: "forearms",
    primaryMuscles: ["Extensores do Punho"],
    secondaryMuscles: ["Extensores dos Dedos", "Braquiorradial"],
    difficulty: "easy",
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
    source: "default",
    name: "Extensão de Quadril no Banco Romano",
    muscleGroup: "hamstrings",
    primaryMuscles: ["Glúteo Máximo", "Isquiotibiais"],
    secondaryMuscles: ["Eretores da Coluna"],
    difficulty: "moderate",
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
    source: "default",
    name: "Extensão Lombar",
    muscleGroup: "lowerBack",
    primaryMuscles: ["Eretores da Coluna"],
    secondaryMuscles: ["Glúteos", "Isquiotibiais"],
    difficulty: "easy",
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
    source: "default",
    name: "Extensão Unilateral de Tríceps",
    muscleGroup: "triceps",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Ancôneo"],
    difficulty: "easy",
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
    source: "default",
    name: "Face Pull",
    muscleGroup: "shoulders",
    primaryMuscles: ["Deltoide Posterior", "Rotadores Externos"],
    secondaryMuscles: ["Trapézio Médio e Inferior", "Romboides"],
    difficulty: "easy",
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
    source: "default",
    name: "Farmers Walk",
    muscleGroup: "fullBody",
    primaryMuscles: ["Antebraços", "Trapézio", "Core"],
    secondaryMuscles: ["Glúteos", "Quadríceps", "Panturrilhas"],
    difficulty: "easy",
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
    source: "default",
    name: "Farmers Walk na Ponta dos Pés",
    muscleGroup: "calves",
    primaryMuscles: ["Gastrocnêmio", "Sóleo"],
    secondaryMuscles: ["Antebraços", "Trapézio", "Core"],
    difficulty: "hard",
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
    source: "default",
    name: "Flexão Arqueiro",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior"],
    secondaryMuscles: ["Tríceps", "Deltoide Anterior", "Core"],
    difficulty: "hard",
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
    source: "default",
    name: "Flexão de Braços",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior"],
    secondaryMuscles: ["Tríceps", "Deltoide Anterior", "Core"],
    difficulty: "easy",
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
    source: "default",
    name: "Flexão de Punho",
    muscleGroup: "forearms",
    primaryMuscles: ["Flexores do Punho"],
    secondaryMuscles: ["Flexores dos Dedos", "Braquiorradial"],
    difficulty: "easy",
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
    source: "default",
    name: "Flexão Diamante",
    muscleGroup: "chest",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Peitoral Maior", "Deltoide Anterior", "Core"],
    difficulty: "moderate",
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
    source: "default",
    name: "Flexão Fechada",
    muscleGroup: "triceps",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Peitoral", "Deltoide Anterior", "Core"],
    difficulty: "moderate",
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
    source: "default",
    name: "Flexão Nórdica",
    muscleGroup: "hamstrings",
    primaryMuscles: ["Isquiotibiais"],
    secondaryMuscles: ["Glúteos", "Gastrocnêmio", "Core"],
    difficulty: "hard",
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
    source: "default",
    name: "Flexora em Pé",
    muscleGroup: "hamstrings",
    primaryMuscles: ["Isquiotibiais"],
    secondaryMuscles: ["Gastrocnêmio", "Glúteos"],
    difficulty: "easy",
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
    source: "default",
    name: "Good Morning",
    muscleGroup: "hamstrings",
    primaryMuscles: ["Isquiotibiais", "Glúteo Máximo"],
    secondaryMuscles: ["Eretores", "Adutores", "Core"],
    difficulty: "hard",
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
    source: "default",
    name: "Good Morning Sentado",
    muscleGroup: "lowerBack",
    primaryMuscles: ["Eretores da Coluna"],
    secondaryMuscles: ["Glúteos", "Adutores", "Core"],
    difficulty: "hard",
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
    source: "default",
    name: "Hand Gripper",
    muscleGroup: "forearms",
    primaryMuscles: ["Flexores dos Dedos"],
    secondaryMuscles: ["Músculos da Mão", "Antebraços"],
    difficulty: "easy",
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
    source: "default",
    name: "Hollow Body Hold",
    muscleGroup: "core",
    primaryMuscles: ["Reto Abdominal", "Transverso"],
    secondaryMuscles: ["Flexores do Quadril", "Quadríceps"],
    difficulty: "moderate",
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
    source: "default",
    name: "Jefferson Curl",
    muscleGroup: "lowerBack",
    primaryMuscles: ["Eretores da Coluna"],
    secondaryMuscles: ["Isquiotibiais", "Glúteos"],
    difficulty: "hard",
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
    source: "default",
    name: "Jm Press",
    muscleGroup: "triceps",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Peitoral", "Deltoide Anterior"],
    difficulty: "hard",
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
    source: "default",
    name: "Leg Press",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps", "Glúteo Máximo"],
    secondaryMuscles: ["Adutores", "Posteriores da Coxa"],
    difficulty: "easy",
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
    source: "default",
    name: "Levantamento Terra com Trap Bar",
    muscleGroup: "fullBody",
    primaryMuscles: ["Quadríceps", "Glúteo Máximo"],
    secondaryMuscles: ["Isquiotibiais", "Eretores", "Trapézio", "Antebraços"],
    difficulty: "moderate",
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
    source: "default",
    name: "Levantamento Terra Convencional",
    muscleGroup: "fullBody",
    primaryMuscles: ["Glúteo Máximo", "Isquiotibiais", "Eretores"],
    secondaryMuscles: ["Quadríceps", "Trapézio", "Antebraços", "Core"],
    difficulty: "moderate",
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
    source: "default",
    name: "Levantamento Terra Pernas Rígidas",
    muscleGroup: "hamstrings",
    primaryMuscles: ["Isquiotibiais"],
    secondaryMuscles: ["Glúteo Máximo", "Eretores", "Adutores"],
    difficulty: "moderate",
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
    source: "default",
    name: "Levantamento Terra Romeno",
    muscleGroup: "hamstrings",
    primaryMuscles: ["Isquiotibiais", "Glúteo Máximo"],
    secondaryMuscles: ["Eretores", "Adutores", "Core"],
    difficulty: "moderate",
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
    source: "default",
    name: "Levantamento Terra Sumô",
    muscleGroup: "glutes",
    primaryMuscles: ["Glúteo Máximo", "Adutores"],
    secondaryMuscles: ["Quadríceps", "Posteriores", "Eretores", "Core"],
    difficulty: "moderate",
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
    source: "default",
    name: "Mergulho nas Paralelas com Foco no Peito",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior"],
    secondaryMuscles: ["Tríceps", "Deltoide Anterior"],
    difficulty: "moderate",
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
    source: "default",
    name: "Mergulho no Banco",
    muscleGroup: "triceps",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Peitoral", "Deltoide Anterior"],
    difficulty: "moderate",
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
    source: "default",
    name: "Mesa Flexora",
    muscleGroup: "hamstrings",
    primaryMuscles: ["Isquiotibiais"],
    secondaryMuscles: ["Gastrocnêmio"],
    difficulty: "easy",
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
    source: "default",
    name: "Mountain Climber",
    muscleGroup: "fullBody",
    primaryMuscles: ["Core", "Flexores do Quadril"],
    secondaryMuscles: ["Ombros", "Peitoral", "Quadríceps"],
    difficulty: "easy",
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
    source: "default",
    name: "Pallof Press",
    muscleGroup: "core",
    primaryMuscles: ["Oblíquos", "Transverso"],
    secondaryMuscles: ["Glúteos", "Ombros"],
    difficulty: "easy",
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
    source: "default",
    name: "Panturrilha no Leg Press",
    muscleGroup: "calves",
    primaryMuscles: ["Gastrocnêmio", "Sóleo"],
    secondaryMuscles: ["Músculos do Pé"],
    difficulty: "easy",
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
    source: "default",
    name: "Panturrilha Unilateral",
    muscleGroup: "calves",
    primaryMuscles: ["Gastrocnêmio", "Sóleo"],
    secondaryMuscles: ["Músculos do Pé", "Estabilizadores do Tornozelo"],
    difficulty: "moderate",
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
    source: "default",
    name: "Passada Caminhando",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps", "Glúteo Máximo"],
    secondaryMuscles: ["Adutores", "Posteriores", "Panturrilhas", "Core"],
    difficulty: "moderate",
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
    source: "default",
    name: "Pinça com Anilhas",
    muscleGroup: "forearms",
    primaryMuscles: ["Flexores dos Dedos", "Adutor do Polegar"],
    secondaryMuscles: ["Músculos da Mão", "Antebraços"],
    difficulty: "easy",
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
    source: "default",
    name: "Ponte de Glúteos",
    muscleGroup: "glutes",
    primaryMuscles: ["Glúteo Máximo"],
    secondaryMuscles: ["Isquiotibiais", "Core"],
    difficulty: "easy",
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
    source: "default",
    name: "Prancha Copenhagen",
    muscleGroup: "adductors",
    primaryMuscles: ["Adutores do Quadril"],
    secondaryMuscles: ["Oblíquos", "Glúteos", "Ombros"],
    difficulty: "hard",
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
    source: "default",
    name: "Prancha Frontal",
    muscleGroup: "core",
    primaryMuscles: ["Transverso do Abdome", "Reto Abdominal"],
    secondaryMuscles: ["Oblíquos", "Glúteos", "Serrátil"],
    difficulty: "easy",
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
    source: "default",
    name: "Prancha Lateral",
    muscleGroup: "core",
    primaryMuscles: ["Oblíquos", "Quadrado Lombar"],
    secondaryMuscles: ["Glúteo Médio", "Transverso", "Ombros"],
    difficulty: "easy",
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
    source: "default",
    name: "Pronação do Antebraço",
    muscleGroup: "forearms",
    primaryMuscles: ["Pronador Redondo", "Pronador Quadrado"],
    secondaryMuscles: ["Flexores do Punho"],
    difficulty: "moderate",
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
    source: "default",
    name: "Pular Corda",
    muscleGroup: "calves",
    primaryMuscles: ["Gastrocnêmio", "Sóleo"],
    secondaryMuscles: ["Ombros", "Antebraços", "Core"],
    difficulty: "easy",
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
    source: "default",
    name: "Pulldown com Braços Estendidos",
    muscleGroup: "back",
    primaryMuscles: ["Latíssimo do Dorso"],
    secondaryMuscles: ["Redondo Maior", "Tríceps (cabeça Longa)", "Core"],
    difficulty: "easy",
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
    source: "default",
    name: "Pullover",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior", "Latíssimo do Dorso"],
    secondaryMuscles: ["Tríceps (cabeça Longa)", "Serrátil Anterior"],
    difficulty: "moderate",
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
    source: "default",
    name: "Pull-through",
    muscleGroup: "hamstrings",
    primaryMuscles: ["Glúteo Máximo", "Isquiotibiais"],
    secondaryMuscles: ["Adutores", "Core"],
    difficulty: "easy",
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
    source: "default",
    name: "Puxada Frontal",
    muscleGroup: "back",
    primaryMuscles: ["Latíssimo do Dorso"],
    secondaryMuscles: ["Bíceps", "Braquial", "Romboides", "Trapézio Inferior"],
    difficulty: "easy",
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
    source: "default",
    name: "Puxada Neutra",
    muscleGroup: "back",
    primaryMuscles: ["Latíssimo do Dorso"],
    secondaryMuscles: ["Bíceps", "Braquial", "Romboides"],
    difficulty: "easy",
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
    source: "default",
    name: "Puxada Unilateral",
    muscleGroup: "back",
    primaryMuscles: ["Latíssimo do Dorso"],
    secondaryMuscles: ["Bíceps", "Romboides", "Oblíquos"],
    difficulty: "moderate",
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
    source: "default",
    name: "Remada Alta",
    muscleGroup: "shoulders",
    primaryMuscles: ["Deltoide Lateral"],
    secondaryMuscles: ["Trapézio Superior", "Bíceps"],
    difficulty: "moderate",
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
    source: "default",
    name: "Remada Baixa",
    muscleGroup: "back",
    primaryMuscles: ["Latíssimo do Dorso", "Romboides"],
    secondaryMuscles: ["Trapézio", "Deltoide Posterior", "Bíceps"],
    difficulty: "easy",
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
    source: "default",
    name: "Remada Cavalinho",
    muscleGroup: "back",
    primaryMuscles: ["Latíssimo do Dorso", "Romboides"],
    secondaryMuscles: ["Trapézio", "Deltoide Posterior", "Bíceps", "Eretores"],
    difficulty: "moderate",
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
    source: "default",
    name: "Remada Curvada",
    muscleGroup: "back",
    primaryMuscles: ["Latíssimo do Dorso", "Romboides"],
    secondaryMuscles: ["Trapézio", "Deltoide Posterior", "Bíceps", "Eretores da Coluna"],
    difficulty: "moderate",
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
    source: "default",
    name: "Remada Invertida",
    muscleGroup: "back",
    primaryMuscles: ["Romboides", "Latíssimo do Dorso"],
    secondaryMuscles: ["Bíceps", "Deltoide Posterior", "Core"],
    difficulty: "moderate",
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
    source: "default",
    name: "Remada Unilateral",
    muscleGroup: "back",
    primaryMuscles: ["Latíssimo do Dorso"],
    secondaryMuscles: ["Romboides", "Trapézio", "Deltoide Posterior", "Bíceps"],
    difficulty: "easy",
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
    source: "default",
    name: "Reverse Hyper",
    muscleGroup: "lowerBack",
    primaryMuscles: ["Glúteo Máximo", "Eretores"],
    secondaryMuscles: ["Isquiotibiais", "Core"],
    difficulty: "moderate",
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
    source: "default",
    name: "Rosca Alternada",
    muscleGroup: "biceps",
    primaryMuscles: ["Bíceps Braquial"],
    secondaryMuscles: ["Braquial", "Braquiorradial"],
    difficulty: "easy",
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
    source: "default",
    name: "Rosca Aranha",
    muscleGroup: "biceps",
    primaryMuscles: ["Bíceps Braquial"],
    secondaryMuscles: ["Braquial", "Braquiorradial"],
    difficulty: "moderate",
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
    source: "default",
    name: "Rosca Bayesian",
    muscleGroup: "biceps",
    primaryMuscles: ["Bíceps Braquial"],
    secondaryMuscles: ["Braquial", "Deltoide Anterior"],
    difficulty: "moderate",
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
    source: "default",
    name: "Rosca Bíceps",
    muscleGroup: "biceps",
    primaryMuscles: ["Bíceps Braquial"],
    secondaryMuscles: ["Braquial", "Braquiorradial", "Antebraços"],
    difficulty: "easy",
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
    source: "default",
    name: "Rosca Concentrada",
    muscleGroup: "biceps",
    primaryMuscles: ["Bíceps Braquial"],
    secondaryMuscles: ["Braquial", "Antebraços"],
    difficulty: "easy",
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
    source: "default",
    name: "Rosca de Dedos",
    muscleGroup: "forearms",
    primaryMuscles: ["Flexores dos Dedos"],
    secondaryMuscles: ["Flexores do Punho"],
    difficulty: "moderate",
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
    source: "default",
    name: "Rosca Inclinada",
    muscleGroup: "biceps",
    primaryMuscles: ["Bíceps Braquial"],
    secondaryMuscles: ["Braquial", "Braquiorradial"],
    difficulty: "moderate",
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
    source: "default",
    name: "Rosca Inversa",
    muscleGroup: "biceps",
    primaryMuscles: ["Braquiorradial", "Extensores do Antebraço"],
    secondaryMuscles: ["Braquial", "Bíceps"],
    difficulty: "moderate",
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
    source: "default",
    name: "Rosca Martelo",
    muscleGroup: "biceps",
    primaryMuscles: ["Braquial", "Braquiorradial"],
    secondaryMuscles: ["Bíceps Braquial", "Antebraços"],
    difficulty: "easy",
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
    source: "default",
    name: "Rosca Scott",
    muscleGroup: "biceps",
    primaryMuscles: ["Bíceps Braquial"],
    secondaryMuscles: ["Braquial", "Braquiorradial"],
    difficulty: "easy",
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
    source: "default",
    name: "Rosca Zottman",
    muscleGroup: "biceps",
    primaryMuscles: ["Bíceps", "Braquiorradial"],
    secondaryMuscles: ["Braquial", "Flexores e Extensores do Antebraço"],
    difficulty: "moderate",
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
    source: "default",
    name: "Rotação Externa de Ombro",
    muscleGroup: "shoulders",
    primaryMuscles: ["Infraespinal", "Redondo Menor"],
    secondaryMuscles: ["Deltoide Posterior"],
    difficulty: "easy",
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
    source: "default",
    name: "Russian Twist",
    muscleGroup: "core",
    primaryMuscles: ["Oblíquos"],
    secondaryMuscles: ["Reto Abdominal", "Flexores do Quadril"],
    difficulty: "moderate",
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
    source: "default",
    name: "Saltos na Ponta dos Pés",
    muscleGroup: "calves",
    primaryMuscles: ["Gastrocnêmio", "Sóleo"],
    secondaryMuscles: ["Quadríceps", "Músculos do Pé"],
    difficulty: "moderate",
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
    source: "default",
    name: "Snatch",
    muscleGroup: "fullBody",
    primaryMuscles: ["Glúteos", "Quadríceps", "Trapézio", "Ombros"],
    secondaryMuscles: ["Posteriores", "Tríceps", "Core"],
    difficulty: "hard",
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
    source: "default",
    name: "Step-up",
    muscleGroup: "quadriceps",
    primaryMuscles: ["Quadríceps", "Glúteo Máximo"],
    secondaryMuscles: ["Posteriores", "Panturrilhas", "Core"],
    difficulty: "easy",
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
    source: "default",
    name: "Suitcase Carry",
    muscleGroup: "core",
    primaryMuscles: ["Oblíquos", "Quadrado Lombar"],
    secondaryMuscles: ["Antebraços", "Trapézio", "Glúteos"],
    difficulty: "moderate",
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
    source: "default",
    name: "Superman",
    muscleGroup: "lowerBack",
    primaryMuscles: ["Eretores da Coluna"],
    secondaryMuscles: ["Glúteos", "Posteriores", "Deltoide Posterior"],
    difficulty: "easy",
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
    source: "default",
    name: "Supinação do Antebraço",
    muscleGroup: "forearms",
    primaryMuscles: ["Supinador", "Bíceps Braquial"],
    secondaryMuscles: ["Braquiorradial"],
    difficulty: "moderate",
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
    source: "default",
    name: "Supino Declinado",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior"],
    secondaryMuscles: ["Tríceps", "Deltoide Anterior"],
    difficulty: "moderate",
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
    source: "default",
    name: "Supino Fechado",
    muscleGroup: "triceps",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Peitoral Maior", "Deltoide Anterior"],
    difficulty: "moderate",
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
    source: "default",
    name: "Supino Inclinado",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior"],
    secondaryMuscles: ["Tríceps", "Deltoide Anterior"],
    difficulty: "moderate",
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
    source: "default",
    name: "Supino Reto",
    muscleGroup: "chest",
    primaryMuscles: ["Peitoral Maior"],
    secondaryMuscles: ["Tríceps", "Deltoide Anterior"],
    difficulty: "moderate",
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
    source: "default",
    name: "Swing",
    muscleGroup: "hamstrings",
    primaryMuscles: ["Glúteo Máximo", "Isquiotibiais"],
    secondaryMuscles: ["Eretores", "Core", "Deltoides"],
    difficulty: "moderate",
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
    source: "default",
    name: "Thruster",
    muscleGroup: "fullBody",
    primaryMuscles: ["Quadríceps", "Glúteos", "Deltoides"],
    secondaryMuscles: ["Tríceps", "Core", "Panturrilhas"],
    difficulty: "moderate",
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
    source: "default",
    name: "Tibial Anterior",
    muscleGroup: "calves",
    primaryMuscles: ["Tibial Anterior"],
    secondaryMuscles: ["Extensores dos Dedos"],
    difficulty: "easy",
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
    source: "default",
    name: "Tríceps Coice",
    muscleGroup: "triceps",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Ancôneo", "Deltoide Posterior"],
    difficulty: "easy",
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
    source: "default",
    name: "Tríceps Francês",
    muscleGroup: "triceps",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Ancôneo", "Core"],
    difficulty: "moderate",
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
    source: "default",
    name: "Tríceps na Polia",
    muscleGroup: "triceps",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Ancôneo", "Antebraços"],
    difficulty: "easy",
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
    source: "default",
    name: "Tríceps Testa",
    muscleGroup: "triceps",
    primaryMuscles: ["Tríceps Braquial"],
    secondaryMuscles: ["Ancôneo"],
    difficulty: "moderate",
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
    source: "default",
    name: "Woodchopper",
    muscleGroup: "core",
    primaryMuscles: ["Oblíquos"],
    secondaryMuscles: ["Reto Abdominal", "Serrátil", "Glúteos"],
    difficulty: "moderate",
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
    source: "default",
    name: "Wrist Roller",
    muscleGroup: "forearms",
    primaryMuscles: ["Flexores e Extensores do Punho"],
    secondaryMuscles: ["Flexores dos Dedos", "Ombros"],
    difficulty: "moderate",
    movementPattern: "Enrolar carga",
    startingPosition:
      "Ajuste o equipamento e estabilize pés, tronco e escápulas antes de iniciar",
    movementExecution:
      "Execute a fase de força de modo controlado, alcance amplitude confortável e retorne sem perder a postura",
    importantCautions:
      "Use carga que permita controle, respire sem prender o ar por tempo excessivo e interrompa se houver dor articular aguda",
  },
]

function normalizedMuscleLabel(value: string) {
  return value.toLocaleLowerCase("pt-BR")
}

const muscleValueByLabel = new Map<string, Muscle>(
  muscles.map(muscle => [normalizedMuscleLabel(muscle.label), muscle.value])
)

function getMuscleValue(label: string) {
  const value = muscleValueByLabel.get(normalizedMuscleLabel(label))
  if (!value) throw new Error(`Músculo não encontrado no catálogo: ${label}`)
  return value
}

export const defaultExercises: DefaultExercise[] = defaultExerciseSeeds.map(exercise => ({
  ...exercise,
  primaryMuscles: exercise.primaryMuscles.map(getMuscleValue),
  secondaryMuscles: exercise.secondaryMuscles.map(getMuscleValue),
}))
