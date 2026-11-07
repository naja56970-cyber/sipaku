import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { listAuditLogs } from '@/services/audit';
import type { AuditLogEntry } from '@/types/audit';

const canReadAudit = (role: string | undefined) =>
  role === 'super_admin' || role === 'sekretaris' || role === 'bendahara';

const formatDate = (value: Date | string | null | undefined) => {
  if (!value) return '—';
  if (value instanceof Date) return value.toLocaleString('id-ID');
  return new Date(value).toLocaleString('id-ID');
};

export const AuditLogPage = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const allowed = useMemo(() => canReadAudit(user?.role), [user?.role]);

  useEffect(() => {
    if (!allowed) return;

    const loadLogs = async () => {
      setLoading(true);
      try {
        const nextLogs = await listAuditLogs();
        setLogs(nextLogs);
      } catch (error) {
        console.error('Gagal memuat activity log:', error);
        toast.error('Activity log gagal dimuat.');
      } finally {
        setLoading(false);
      }
    };

    void loadLogs();
  }, [allowed]);

  if (!allowed) {
    return (
      <main className="p-6">
        <div className="card p-6">
          <h1 className="text-2xl font-bold text-navy-900">Activity Log</h1>
          <p className="mt-3 text-sm text-red-600">Anda tidak memiliki izin untuk melihat activity log.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6 p-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Audit</p>
        <h1 className="mt-1 text-3xl font-bold text-navy-900">Activity Log</h1>
        <p className="mt-2 text-sm text-slate-600">Perubahan kritis dalam SIPAKU tercatat secara otomatis untuk pemantauan dan audit.</p>
      </header>

      <section className="card overflow-hidden p-6">
        {loading ? (
          <p className="text-sm text-slate-500">Memuat activity log...</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada aktivitas yang tercatat.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-2 pr-4">Waktu</th>
                  <th className="py-2 pr-4">Aksi</th>
                  <th className="py-2 pr-4">Pelaku</th>
                  <th className="py-2 pr-4">Target</th>
                  <th className="py-2 pr-4">Periode</th>
                  <th className="py-2 pr-4">Detail</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 align-top">
                    <td className="py-3 pr-4 text-slate-600">{formatDate(item.createdAt)}</td>
                    <td className="py-3 pr-4 font-medium text-navy-900">{item.action}</td>
                    <td className="py-3 pr-4 text-slate-700">{item.actorUid ?? 'system'}</td>
                    <td className="py-3 pr-4 text-slate-700">{item.targetId ?? '—'}</td>
                    <td className="py-3 pr-4 text-slate-700">{item.periodId ?? '—'}</td>
                    <td className="py-3 pr-4 text-slate-700">
                      {item.programId ? `Program: ${item.programId}` : ''}
                      {item.amount !== undefined ? ` | Amount: ${item.amount}` : ''}
                      {item.achievement !== undefined ? ` | Capaian: ${item.achievement}%` : ''}
                      {item.description ? ` | ${item.description}` : ''}
                      {!item.programId && item.amount === undefined && item.achievement === undefined && !item.description ? '—' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};
