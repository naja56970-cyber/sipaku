export type UserRole =
  | 'super_admin'
  | 'ketua_ipnu'
  | 'ketua_ippnu'
  | 'wakil_ketua'
  | 'sekretaris'
  | 'bendahara'
  | 'koordinator_departemen'
  | 'anggota';

export type UserStatus = 'pending' | 'approved' | 'rejected';

export type AppUser = {
  uid: string;
  email: string;
  username?: string;
  role: UserRole;
  status: UserStatus;
  personId?: string;
  departmentId?: string;
  organizationId?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};
