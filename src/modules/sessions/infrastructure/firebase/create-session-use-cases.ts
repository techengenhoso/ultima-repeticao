import type { ExerciseLibraryReader } from "@/modules/exercises/application/ports/exercise-library-reader"
import { SessionUseCases } from "../../application/session-use-cases"
import { hmacSessionDraftSigner } from "../security/hmac-session-draft-signer"
import { FirebaseSessionRepository } from "./firebase-session-repository"
import {
  FirebaseSessionExerciseLibrary,
  FirebaseSessionPlanReader,
} from "./firebase-session-sources"

export function createSessionUseCases(exerciseLibraryReader: ExerciseLibraryReader) {
  return new SessionUseCases(
    new FirebaseSessionRepository(),
    new FirebaseSessionPlanReader(),
    new FirebaseSessionExerciseLibrary(exerciseLibraryReader),
    hmacSessionDraftSigner
  )
}
