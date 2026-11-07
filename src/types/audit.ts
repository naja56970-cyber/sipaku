export type AuditLogEntry = {
  id: string;
  action: string;
  actorUid?: string;
  targetId?: string;
  periodId?: string;
  programId?: string;
  amount?: number;
  achievement?: number;
  description?: string;
  createdAt?: Date | string | null;
};
