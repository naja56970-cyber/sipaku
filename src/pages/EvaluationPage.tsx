import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { createEvaluation, listEvaluations } from '@/services/evaluation';
import type { EvaluationRecord } from '@/types/evaluation';
import type { UserRole } from '@/types/user';

const CAN_SUBMIT: UserRole[] = [
  'super_admin', 'ketua_ipnu', 'ketua_ippnu', 'wakil_ketua', 'sekretaris', 'koordinator_departemen',
];

export const EvaluationPage = () => {
  const { user } = useAuth();
  const canSubmit = Boolean(user && CAN_SUBMIT.includes(user.role));
  const [periodId, setPeriodId] = useState('');
  const [programId, setProgramId] = useState('');
  const [target, setTarget] = useState('');
  const [achievement, setAchievement] = useState('0');
  const [blockers, setBlockers] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [rows, setRows] = useState<EvaluationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const refresh = async (id: string) => {
    if (!id.trim()) {
      setRows([]);
      return;
    }
    setLoading(true);
    try {
      setRows(await listEvaluations(id.trim()));
    } catch (error) {
      console.error('Gagal memuat evaluasi:', error);
      toast.error('Evaluasi gagal dimuat. Pastikan ID periode benar dan akses tersedia.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (periodId) void refresh(periodId);
  }, [periodId]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      toast.error('Role Anda tidak memiliki izin mengirim evaluasi.');
      return;
    }
    const score = Number(achievement);
    if (!Number.isInteger(score) || score < 0 || score > 100) {
      toast.error('Capaian harus berupa bilangan bulat 0–100.');
      return;
    }
    setSaving(true);
    try {
      await createEvaluation({
        periodId: periodId.trim(),
        programId: programId.trim(),
        target: target.trim(),
        achievement: score,
        blockers: blockers.trim(),
        followUp: followUp.trim(),
      });
      setTarget('');
      setAchievement('0');
      setBlockers('');
      setFollowUp('');
      await refresh(periodId);
      toast.success('Evaluasi tersimpan dan tercatat pada audit log.');
    } catch (error) {
      console.error(error);
      toast.error('Evaluasi gagal disimpan. Periksa ID program/periode dan kewenangan akun.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="space-y-6 p-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Monitoring</p>
        <h1 className="mt-1 text-3xl font-bold text-navy-900">Monitoring & Evaluasi</h1>
        <p className="mt-2 text-sm text-slate-600">Capaian dinilai 0–100 dan dikaitkan dengan program serta periode agar riwayat tetap terjaga.</p>
      </header>

      <section className="card p-6">
        <label className="block max-w-xl text-sm font-medium text-slate-700">ID periode untuk melihat evaluasi
          <input className="input mt-1" value={periodId} onChange={(event) => setPeriodId(event.target.value)} required placeholder="ID dokumen periods" />
        </label>
      </section>

      {canSubmit && <section className="card p-6">
        <h2 className="text-xl font-bold text-navy-900">Catat evaluasi program</h2>
        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <label className="text-sm font-medium text-slate-700">ID program
            <input className="input mt-1" value={programId} onChange={(event) => setProgramId(event.target.value)} required />
          </label>
          <label className="text-sm font-medium text-slate-700">Target terukur
            <input className="input mt-1" value={target} onChange={(event) => setTarget(event.target.value)} required maxLength={180} placeholder="Contoh: 40 peserta hadir" />
          </label>
          <label className="text-sm font-medium text-slate-700">Capaian (%)
            <input className="input mt-1" type="number" min="0" max="100" step="1" value={achievement} onChange={(event) => setAchievement(event.target.value)} required />
          </label>
          <label className="text-sm font-medium text-slate-700">Kendala
            <textarea className="input mt-1" rows={3} value={blockers} onChange={(event) => setBlockers(event.target.value)} maxLength={1000} />
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">Tindak lanjut
            <textarea className="input mt-1" rows={3} value={followUp} onChange={(event) => setFollowUp(event.target.value)} maxLength={1000} required />
          </label>
          <button className="btn-primary md:col-span-2" type="submit" disabled={saving || !periodId.trim()}>{saving ? 'Menyimpan...' : 'Simpan evaluasi'}</button>
        </form>
      </section>}

      <section className="card p-6">
        <h2 className="text-xl font-bold text-navy-900">Riwayat evaluasi</h2>
        {loading ? <p className="mt-4 text-sm text-slate-500">Memuat data...</p> : rows.length === 0 ? <p className="mt-4 text-sm text-slate-500">Belum ada evaluasi untuk periode ini.</p> : (
          <div className="mt-4 space-y-3">{rows.map((row) => <article key={row.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold text-navy-900">Target: {row.target}</h3><p className="mt-1 text-sm text-slate-600">Program {row.programId} · {row.status}</p></div><span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-800">{row.achievement}%</span></div>
            <p className="mt-3 text-sm text-slate-700"><b>Kendala:</b> {row.blockers || 'Tidak dicatat'}</p>
            <p className="mt-1 text-sm text-slate-700"><b>Tindak lanjut:</b> {row.followUp}</p>
          </article>)}</div>
        )}
      </section>
    </main>
  );
};
