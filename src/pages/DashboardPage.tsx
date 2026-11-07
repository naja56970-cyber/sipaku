import { useAuth } from '@/contexts/AuthContext';
import { ROLE_LABELS } from '@/lib/roles';

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
          <h1 className="mt-1 text-3xl font-bold text-navy-900">Selamat datang</h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-slate-500">Role</p>
          <p className="mt-2 text-xl font-bold text-navy-900">
            {user ? ROLE_LABELS[user.role] : 'User'}
          </p>
        </div>

        <div className="card p-5">
          <p className="text-sm text-slate-500">Status</p>
          <p className="mt-2 text-xl font-bold text-green-600">
            {user?.status || 'pending'}
          </p>
        </div>

        <div className="card p-5">
          <p className="text-sm text-slate-500">Organisasi</p>
          <p className="mt-2 text-xl font-bold text-navy-900">PK IPNU-IPPNU UNUGIRI</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold text-navy-900">Ringkasan</h2>
        <p className="mt-3 text-sm text-slate-600">
          Fondasi SIPAKU sudah dibuat. Aplikasi siap untuk login, registrasi, status pending,
          dan kontrol akses dasar berdasarkan role.
        </p>
      </div>
    </div>
  );
};
