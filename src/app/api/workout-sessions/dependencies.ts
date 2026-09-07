import { FirebaseExerciseLibraryReader } from "@/modules/exercises/infrastructure/firebase-admin-exercise-library-source"
import { createSessionUseCases } from "@/modules/sessions/infrastructure/firebase/create-session-use-cases"

export const sessionUseCases = createSessionUseCases(new FirebaseExerciseLibraryReader())
