export interface Profile {
  birthDate: string
  gender: "male" | "female" | "other" | null
  goal: "hypertrophy" | "weightLoss" | "conditioning" | "strength" | "qualityOfLife" | null
  experience: "beginner" | "basic" | "intermediate" | "advanced" | "expert" | null
}

export type ProfileEditable = Partial<
  Pick<Profile, "birthDate" | "gender" | "goal" | "experience">
>
