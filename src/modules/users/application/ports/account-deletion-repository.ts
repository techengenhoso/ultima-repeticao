export interface AccountDeletionRepository {
  deleteByUserId(uid: string): Promise<void>
}
