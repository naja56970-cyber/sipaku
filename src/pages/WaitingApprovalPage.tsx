import { Link } from 'react-router-dom';

export const WaitingApprovalPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="card max-w-lg p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-2xl">
          ⏳
        </div>
        <h1 className="text-2xl font-bold text-navy-900">Akun Menunggu Persetujuan</h1>
        <p className="mt-3 text-sm text-slate-600">
          Data pendaftaran Anda sedang ditinjau oleh Super Admin. Silakan menunggu konfirmasi
          lanjutan.
        </p>

        <Link to="/login" className="btn-primary mt-6">
          Kembali ke Login
        </Link>
      </div>
    </div>
  );
};
