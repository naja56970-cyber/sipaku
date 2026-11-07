import { addDoc, collection, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export type GovernancePeriodInput = {
  name: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  description?: string;
};

export type DepartmentInput = {
  name: string;
  shortName?: string;
  coordinatorId?: string;
  description?: string;
  responsibilities?: string;
  periodId?: string;
};

export type PositionInput = {
  personId: string;
  departmentId?: string;
  title: string;
  periodId?: string;
  startDate?: string;
  endDate?: string;
  status?: 'Aktif' | 'Selesai' | 'Ditugaskan';
};

export const createPeriod = async (input: GovernancePeriodInput) => {
  const ref = collection(db, 'periods');
  return await addDoc(ref, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const createDepartment = async (input: DepartmentInput) => {
  const ref = collection(db, 'departments');
  return await addDoc(ref, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const createPosition = async (input: PositionInput) => {
  const ref = collection(db, 'positions');
  return await addDoc(ref, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const createPerson = async (input: Record<string, any>) => {
  const ref = collection(db, 'people');
  return await addDoc(ref, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getCollectionSnapshot = async (collectionName: string) => {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

export const setOrganizationProfile = async (payload: Record<string, any>) => {
  const ref = doc(db, 'organizations', 'default');
  await setDoc(ref, {
    ...payload,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  }, { merge: true });
};
