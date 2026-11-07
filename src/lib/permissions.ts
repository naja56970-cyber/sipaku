import type { AppUser, UserRole } from '@/types/user';

export const ORG_LEAD_ROLES: UserRole[] = [
  'super_admin',
  'ketua_ipnu',
  'ketua_ippnu',
  'wakil_ketua',
];

export const SECRETARIAT_ROLES: UserRole[] = [
  'super_admin',
  'sekretaris',
  'wakil_ketua',
  'ketua_ipnu',
  'ketua_ippnu',
];

export const FINANCE_ROLES: UserRole[] = ['super_admin', 'bendahara', 'sekretaris'];

export const MEMBERSHIP_ROLES: UserRole[] = [
  'super_admin',
  'sekretaris',
  'wakil_ketua',
  'ketua_ipnu',
  'ketua_ippnu',
  'koordinator_departemen',
];

export const AUDIT_READ_ROLES: UserRole[] = ['super_admin', 'sekretaris', 'bendahara'];

export const APPROVED_USER_STATUSES = ['approved'] as const;

export const isApprovedUser = (user: AppUser | null) => {
  return !!user && APPROVED_USER_STATUSES.includes(user.status as (typeof APPROVED_USER_STATUSES)[number]);
};

export const canViewAudit = (user: AppUser | null) => {
  return !!user && AUDIT_READ_ROLES.includes(user.role);
};

export const canManageMembers = (user: AppUser | null) => {
  return !!user && MEMBERSHIP_ROLES.includes(user.role);
};

export const canManageFinance = (user: AppUser | null) => {
  return !!user && FINANCE_ROLES.includes(user.role);
};

export const canManageGovernance = (user: AppUser | null) => {
  return !!user && ORG_LEAD_ROLES.includes(user.role);
};
