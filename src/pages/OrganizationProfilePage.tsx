import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOrganizationProfile } from '@/services/organization';
import type { OrganizationProfile } from '@/types/organization';

export const OrganizationProfilePage = () => {
  const [organization, setOrganization] = useState<OrganizationProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getOrganizationProfile();
        setOrganization(data);
      } catch (error) {
        console.error('Gagal memuat profil organisasi:', error);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Memuat profil organisasi...</div>;
  }

  if (!organization) {
    return (
      <div className="p-6">
        <div className="card p-6">
          <h1 className="text-2xl font-bold text-navy-900">Profil organisasi</h1>
          <p className="mt-3 text-sm text-slate-600">
            Data profil belum tersedia. Silakan isi profil organisasi pada tahap konfigurasi.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Profil Organisasi</p>
          <h1 className="mt-1 text-3xl font-bold text-navy-900">{organization.name}</h1>
        </div>
        <Link to="/dashboard" className="btn-secondary">
          Kembali
        </Link>
      </div>

      <div className="card p-6">
        <div className="grid gap-6 md:grid-cols-[160px_1fr]">
          <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4">
            {organization.logoUrl ? (
              <img src={organization.logoUrl} alt={organization.name} className="h-24 w-24 rounded-xl object-cover" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-navy-900 text-2xl font-bold text-white">
                PK
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tagline</p>
              <p className="mt-1 text-lg font-semibold text-navy-900">
                {organization.tagline ?? 'Satu Sistem, Terintegrasi dalam Satu Gerak.'}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Masa khidmat</p>
              <p className="mt-1 text-base text-slate-700">{organization.masaKhidmat ?? '2026–2027'}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Deskripsi</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">
                {organization.description ?? 'SIPAKU menjadi pusat data dan administrasi organisasi PK IPNU-IPPNU UNUGIRI.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Visi</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            {organization.visi ?? 'Mewujudkan kader yang berilmu, berakhlak, dan bermanfaat.'}
          </p>
        </div>

        <div className="card p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Misi</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            {organization.misi ?? 'Mengelola organisasi secara profesional, terintegrasi, dan akuntabel.'}
          </p>
        </div>
      </div>
    </div>
  );
};
