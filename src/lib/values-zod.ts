import {
  difficulties,
  experiences,
  genders,
  goals,
  muscleGroups,
  muscles,
} from "./options-select"

export const gendersValues = genders.map(item => item.value) as [
  (typeof genders)[number]["value"],
  ...(typeof genders)[number]["value"][],
]

export const goalsValues = goals.map(item => item.value) as [
  (typeof goals)[number]["value"],
  ...(typeof goals)[number]["value"][],
]

export const experiencesValues = experiences.map(item => item.value) as [
  (typeof experiences)[number]["value"],
  ...(typeof experiences)[number]["value"][],
]

export const muscleGroupValues = muscleGroups.map(item => item.value) as [
  (typeof muscleGroups)[number]["value"],
  ...(typeof muscleGroups)[number]["value"][],
]

export const musclesValues = muscles.map(item => item.value) as [
  (typeof muscles)[number]["value"],
  ...(typeof muscles)[number]["value"][],
]

export const difficultiesValues = difficulties.map(item => item.value) as [
  (typeof difficulties)[number]["value"],
  ...(typeof difficulties)[number]["value"][],
]
