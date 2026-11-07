import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { AuditLogEntry } from '@/types/audit';

export const listAuditLogs = async (): Promise<AuditLogEntry[]> => {
  const q = query(collection(db, 'activity_logs'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => {
    const data = item.data() as Record<string, unknown>;
    const createdAtValue = data.createdAt;

    return {
      id: item.id,
      action: String(data.action ?? 'unknown_action'),
      actorUid: typeof data.actorUid === 'string' ? data.actorUid : undefined,
      targetId: typeof data.targetId === 'string' ? data.targetId : undefined,
      periodId: typeof data.periodId === 'string' ? data.periodId : undefined,
      programId: typeof data.programId === 'string' ? data.programId : undefined,
      amount: typeof data.amount === 'number' ? data.amount : undefined,
      achievement: typeof data.achievement === 'number' ? data.achievement : undefined,
      description: typeof data.description === 'string' ? data.description : undefined,
      createdAt:
        typeof createdAtValue === 'object' && createdAtValue !== null && 'toDate' in createdAtValue
          ? (createdAtValue as { toDate: () => Date }).toDate()
          : createdAtValue instanceof Date
            ? createdAtValue
            : typeof createdAtValue === 'string'
              ? createdAtValue
              : null,
    };
  });
};
