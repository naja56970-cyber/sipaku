import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '@/config/firebase';
import type { EvaluationRecord, EvaluationStatus } from '@/types/evaluation';

const createEvaluationCall = httpsCallable<{
  periodId: string;
  programId: string;
  target: string;
  achievement: number;
  blockers: string;
  followUp: string;
}, { id: string }>(functions, 'createEvaluation');

export const createEvaluation = (input: Omit<EvaluationRecord, 'id' | 'createdBy' | 'createdAt' | 'status'>) =>
  createEvaluationCall(input);

export const listEvaluations = async (periodId: string): Promise<EvaluationRecord[]> => {
  const request = query(
    collection(db, 'evaluations'),
    where('periodId', '==', periodId),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(request);
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<EvaluationRecord, 'id'>),
  }));
};
