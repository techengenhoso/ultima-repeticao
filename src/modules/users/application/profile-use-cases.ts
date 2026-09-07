import type { Profile, ProfileEditable } from "../domain/profile"
import type { ProfileRepository } from "./ports/profile-repository"

export interface ProfileUseCases {
  load(uid: string): Promise<Profile>
  save(uid: string, data: ProfileEditable): Promise<Profile>
}

export function createProfileUseCases(repository: ProfileRepository): ProfileUseCases {
  return {
    async load(uid) {
      return (await repository.get(uid)) ?? repository.save(uid, {})
    },
    save: (uid, data) => repository.save(uid, data),
  }
}
