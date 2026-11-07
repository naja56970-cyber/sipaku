import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { OrganizationProfile, PersonRecord } from '@/types/organization';

export const getOrganizationProfile = async (): Promise<OrganizationProfile | null> => {
  const [snapshot] = await Promise.all([
    getDoc(doc(db, 'organizations', 'default')),
  ]);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as Partial<OrganizationProfile>;

  return {
    id: snapshot.id,
    name: data.name ?? 'PK IPNU-IPPNU UNUGIRI',
    shortName: data.shortName ?? 'PK IPNU-IPPNU UNUGIRI',
    tagline: data.tagline ?? 'Satu Sistem, Terintegrasi dalam Satu Gerak.',
    masaKhidmat: data.masaKhidmat ?? '2026-2027',
    visi: data.visi ?? 'Mewujudkan kader yang berilmu, berakhlak, dan bermanfaat.',
    misi: data.misi ?? 'Mengelola organisasi secara profesional dan terintegrasi.',
    logoUrl: data.logoUrl,
    description: data.description,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

export const getMembers = async (): Promise<PersonRecord[]> => {
  const snapshot = await getDocs(collection(db, 'people'));

  return snapshot.docs.map((docSnapshot) => {
    const data = docSnapshot.data() as Partial<PersonRecord>;

    return {
      id: docSnapshot.id,
      name: data.name ?? 'Tanpa nama',
      nim: data.nim,
      faculty: data.faculty,
      studyProgram: data.studyProgram,
      batch: data.batch,
      email: data.email,
      phone: data.phone,
      photoUrl: data.photoUrl,
      status: data.status ?? 'Aktif',
      organizationalStatus: data.organizationalStatus ?? 'Anggota',
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });
};
