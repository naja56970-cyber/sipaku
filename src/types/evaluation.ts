export type EvaluationStatus = 'draft' | 'submitted' | 'reviewed';

export type EvaluationRecord = {
  id: string;
  periodId: string;
  programId: string;
  target: string;
  achievement: number;
  blockers: string;
  followUp: string;
  status: EvaluationStatus;
  createdBy: string;
  createdAt?: unknown;
};
