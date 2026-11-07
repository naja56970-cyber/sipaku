import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { KaderRecord, KaderTrainingRecord } from '@/types/kaderisasi';

export const createKader = async (input: Omit<KaderRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
  return addDoc(collection(db, 'kaderisasi'), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const createKaderTraining = async (input: Omit<KaderTrainingRecord, 'id' | 'createdAt'>) => {
  return addDoc(collection(db, 'kader_training'), {
    ...input,
    createdAt: serverTimestamp(),
  });
};

export const listKader = async (): Promise<KaderRecord[]> => {
  const q = query(collection(db, 'kaderisasi'), orderBy('name', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<KaderRecord, 'id'>) }));
};

export const listKaderTraining = async (): Promise<KaderTrainingRecord[]> => {
  const q = query(collection(db, 'kader_training'), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<KaderTrainingRecord, 'id'>) }));
};
