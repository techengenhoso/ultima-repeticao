import type { Profile, ProfileEditable } from "@/modules/users/domain/profile"

export interface ProfileRepository {
  get(uid: string): Promise<Profile | null>
  save(uid: string, data: ProfileEditable): Promise<Profile>
}
