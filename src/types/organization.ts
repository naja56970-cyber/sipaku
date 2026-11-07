export type OrganizationProfile = {
  id?: string;
  name: string;
  shortName?: string;
  tagline?: string;
  masaKhidmat?: string;
  visi?: string;
  misi?: string;
  logoUrl?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PersonRecord = {
  id?: string;
  name: string;
  nim?: string;
  faculty?: string;
  studyProgram?: string;
  batch?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  status?: 'Aktif' | 'Alumni' | 'Tidak aktif';
  organizationalStatus?: 'Pengurus' | 'Anggota' | 'Tidak aktif';
  createdAt?: string;
  updatedAt?: string;
};

export type MembershipRecord = {
  id?: string;
  personId?: string;
  periodId?: string;
  status?: 'Aktif' | 'Alumni' | 'Keluar';
  joinedAt?: string;
  endedAt?: string;
};
