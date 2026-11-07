import type { AppUser, UserRole } from '@/types/user';

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  ketua_ipnu: 'Ketua IPNU',
  ketua_ippnu: 'Ketua IPPNU',
  wakil_ketua: 'Wakil Ketua',
  sekretaris: 'Sekretaris',
  bendahara: 'Bendahara',
  koordinator_departemen: 'Koordinator Departemen',
  anggota: 'Anggota/Pengurus',
};

export const DEFAULT_ROLE: UserRole = 'anggota';

export const canAccessRoute = (user: AppUser | null, allowedRoles: UserRole[]) => {
  if (!user) return false;
  if (allowedRoles.length === 0) return true;
  return allowedRoles.includes(user.role);
};
