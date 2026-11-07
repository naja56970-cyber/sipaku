import { useState } from 'react';
import { toast } from 'sonner';
import {
  createDepartment,
  createPeriod,
  createPosition,
  setOrganizationProfile,
} from '@/services/governance-operations';

export const GovernanceFormPanel = () => {
  const [loading, setLoading] = useState(false);

  const handleCreatePeriod = async () => {
    setLoading(true);
    try {
      await createPeriod({
        name: 'Masa Khidmat 2026-2027',
        startDate: '2026-01-01',
        endDate: '2027-12-31',
        isActive: true,
        description: 'Periode kepengurusan aktif PK IPNU-IPPNU UNUGIRI',
      });
      toast.success('Periode berhasil dibuat');
    } catch (error) {
      console.error(error);
      toast.error('Gagal membuat periode');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async () => {
    setLoading(true);
    try {
      await createDepartment({
        name: 'Kaderisasi',
        shortName: 'KDR',
        description: 'Bidang kaderisasi organisasi',
        responsibilities: 'Mengelola pembinaan kader, pelatihan, dan pengembangan anggota.',
        periodId: 'default-period',
      });
      toast.success('Departemen berhasil dibuat');
    } catch (error) {
      console.error(error);
      toast.error('Gagal membuat departemen');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePosition = async () => {
    setLoading(true);
    try {
      await createPosition({
        personId: 'demo-person',
        departmentId: 'demo-department',
        title: 'Ketua IPNU',
        periodId: 'default-period',
        startDate: '2026-01-01',
        endDate: '2027-12-31',
        status: 'Aktif',
      });
      toast.success('Jabatan berhasil dibuat');
    } catch (error) {
      console.error(error);
      toast.error('Gagal membuat jabatan');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async () => {
    setLoading(true);
    try {
      await setOrganizationProfile({
        name: 'PK IPNU-IPPNU UNUGIRI',
        shortName: 'PK IPNU-IPPNU UNUGIRI',
        masaKhidmat: '2026-2027',
        tagline: 'Satu Sistem, Terintegrasi dalam Satu Gerak.',
        visi: 'Mewujudkan kader yang berilmu, berakhlak, dan bermanfaat.',
        misi: 'Mengelola organisasi secara profesional dan terintegrasi.',
      });
      toast.success('Profil organisasi berhasil disimpan');
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan profil organisasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-navy-900">Form dasar organisasi</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <button className="btn-primary" onClick={handleCreatePeriod} disabled={loading}>
          {loading ? 'Memproses...' : 'Buat periode'}
        </button>
        <button className="btn-secondary" onClick={handleCreateDepartment} disabled={loading}>
          Buat departemen
        </button>
        <button className="btn-secondary" onClick={handleCreatePosition} disabled={loading}>
          Buat jabatan
        </button>
        <button className="btn-secondary" onClick={handleCreateProfile} disabled={loading}>
          Simpan profil organisasi
        </button>
      </div>
    </div>
  );
};
