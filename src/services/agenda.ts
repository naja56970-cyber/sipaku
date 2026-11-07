import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '@/config/firebase';

export type AgendaInput = {
  title: string;
  periodId: string;
  startsAt: string;
  location?: string;
  description?: string;
  programId?: string;
};

export type AttendanceInput = {
  agendaId: string;
  personUid: string;
  status: 'hadir' | 'izin' | 'sakit' | 'tanpa_keterangan';
  note?: string;
};

export const listAgendas = async () => {
  const q = query(collection(db, 'agendas'), orderBy('startsAt', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
};

export const createAgenda = async (input: AgendaInput, createdBy: string) => {
  return addDoc(collection(db, 'agendas'), {
    ...input,
    createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const listMyAttendance = async (uid: string) => {
  const q = query(collection(db, 'attendance'), where('personUid', '==', uid), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
};

export const recordAttendance = async (input: AttendanceInput, recordedBy: string) => {
  return addDoc(collection(db, 'attendance'), {
    ...input,
    recordedBy,
    createdAt: serverTimestamp(),
  });
};
