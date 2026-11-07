import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '@/config/firebase';

export type FinanceDirection = 'income' | 'expense';

export type FinanceEntry = {
  id: string;
  periodId: string;
  description: string;
  category: string;
  direction: FinanceDirection;
  amount: number;
  occurredOn: string;
  programId?: string;
  createdBy: string;
};

export type BudgetEntry = {
  id: string;
  periodId: string;
  title: string;
  amount: number;
  programId?: string;
  createdBy: string;
  createdAt?: unknown;
};

const createFinanceEntryCall = httpsCallable<{
  periodId: string;
  description: string;
  category: string;
  direction: FinanceDirection;
  amount: number;
  occurredOn: string;
  programId?: string;
}> (functions, 'createFinanceEntry');

const createBudgetCall = httpsCallable<{
  periodId: string;
  title: string;
  amount: number;
  programId?: string;
}> (functions, 'createBudget');

export async function createFinanceEntry(input: Omit<FinanceEntry, 'id' | 'createdBy'>) {
  return createFinanceEntryCall(input);
}

export async function createBudget(input: Omit<BudgetEntry, 'id' | 'createdBy' | 'createdAt'>) {
  return createBudgetCall(input);
}

export async function listFinanceEntries(periodId: string): Promise<FinanceEntry[]> {
  const request = query(
    collection(db, 'transactions'),
    where('periodId', '==', periodId),
    orderBy('occurredOn', 'desc'),
  );
  const snapshot = await getDocs(request);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<FinanceEntry, 'id'>) }));
}

export async function listBudgets(periodId: string): Promise<BudgetEntry[]> {
  const request = query(
    collection(db, 'budgets'),
    where('periodId', '==', periodId),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(request);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<BudgetEntry, 'id'>) }));
}
