import { useEffect, useState } from 'react';
import { getMembers } from '@/services/organization';
import type { PersonRecord } from '@/types/organization';

export const MembersPage = () => {
  const [members, setMembers] = useState<PersonRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMembers();
        setMembers(data);
      } catch (error) {
        console.error('Gagal memuat data anggota:', error);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Database</p>
          <h1 className="mt-1 text-3xl font-bold text-navy-900">Pengurus dan Anggota</h1>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">NIM</th>
                <th className="px-4 py-3">Fakultas</th>
                <th className="px-4 py-3">Prodi</th>
                <th className="px-4 py-3">Angkatan</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Memuat data anggota...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Belum ada data anggota yang masuk.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id ?? member.name} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-medium text-slate-800">{member.name}</td>
                    <td className="px-4 py-3 text-slate-700">{member.nim ?? '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{member.faculty ?? '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{member.studyProgram ?? '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{member.batch ?? '-'}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                        {member.status ?? 'Aktif'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
