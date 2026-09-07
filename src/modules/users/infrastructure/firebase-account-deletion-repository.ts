import {
  getAdminAuth,
  getAdminFirestore,
} from "@/modules/shared/infrastructure/firebase-admin"
import type { AccountDeletionRepository } from "@/modules/users/application/ports/account-deletion-repository"

export const firebaseAccountDeletionRepository: AccountDeletionRepository = {
  async deleteByUserId(uid) {
    const firestore = getAdminFirestore()

    await firestore.recursiveDelete(firestore.collection("users").doc(uid))
    await getAdminAuth().deleteUser(uid)
  },
}
