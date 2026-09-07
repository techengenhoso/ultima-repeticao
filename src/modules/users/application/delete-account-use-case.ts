import type { AccountDeletionRepository } from "./ports/account-deletion-repository"

export async function deleteAccount(
  repository: AccountDeletionRepository,
  uid: string
): Promise<void> {
  await repository.deleteByUserId(uid)
}
