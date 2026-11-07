export type KaderLevel = 'Pemula' | 'Dasar' | 'Lanjutan' | 'Mahir';
export type KaderStatus = 'Aktif' | 'Calon' | 'Alumni' | 'Tidak aktif';

export type KaderRecord = {
  id?: string;
  personId: string;
  name: string;
  level: KaderLevel;
  status: KaderStatus;
  cohort?: string;
  departmentId?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type KaderTrainingRecord = {
  id?: string;
  kaderId: string;
  title: string;
  date: string;
  trainer?: string;
  notes?: string;
  createdAt?: string;
};
