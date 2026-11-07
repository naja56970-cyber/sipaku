import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { createAgenda, listAgendas, listMyAttendance, recordAttendance } from '@/services/agenda';

export const AgendaPage = () => {
  const { user } = useAuth();
  const [agendas, setAgendas] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [periodId, setPeriodId] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [location, setLocation] = useState('');

  const refresh = async () => {
    if (!user) return;
    const [agendaRows, attendanceRows] = await Promise.all([
      listAgendas(),
      listMyAttendance(user.uid),
    ]);
    setAgendas(agendaRows);
    setAttendance(attendanceRows);
  };

  useEffect(() => {
    void refresh()
      .catch((error) => {
        console.error('Gagal memuat agenda:', error);
        toast.error('Agenda gagal dimuat. Periksa akses dan konfigurasi Firestore.');
      })
      .finally(() => setLoading(false));
  }, [user]);

  const submitAgenda = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await createAgenda({ title: title.trim(), periodId, startsAt, location: location.trim() }, user.uid);
      setTitle('');
      setPeriodId('');
      setStartsAt('');
      setLocation('');
      await refresh();
      toast.success('Agenda berhasil dibuat');
    } catch (error) {
      console.error(error);
      toast.error('Gagal membuat agenda. Pastikan role Anda memiliki izin.');
    } finally {
      setSaving(false);
    }
  };

  const markAttendance = async (agendaId: string) => {
    if (!user) return;
    setSaving(true);
    try {
      await recordAttendance({ agendaId, personUid: user.uid, status: 'hadir' }, user.uid);
      await refresh();
      toast.success('Kehadiran berhasil dicatat');
    } catch (error) {
      console.error(error);
      toast.error('Kehadiran gagal dicatat. Minta petugas yang berwenang mencatat presensi.');
    } finally {
      setSaving(false);
    }
  };

  const hasAttendance = (agendaId: string) => attendance.some((entry) => entry.agendaId === agendaId);

  return (
    <main className="space-y-6 p-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Kegiatan</p>
        <h1 className="mt-1 text-3xl font-bold text-navy-900">Agenda & Kehadiran</h1>
      </header>

      <section className="card p-6">
        <h2 className="text-xl font-bold text-navy-900">Buat agenda</h2>
        <p className="mt-1 text-sm text-slate-500">Hanya peran berwenang yang dapat menyimpan agenda.</p>
        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={submitAgenda}>
          <label className="text-sm font-medium text-slate-700">Nama kegiatan
            <input className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={120} />
          </label>
          <label className="text-sm font-medium text-slate-700">ID periode aktif
            <input className="input mt-1" value={periodId} onChange={(e) => setPeriodId(e.target.value.trim())} required />
          </label>
          <label className="text-sm font-medium text-slate-700">Waktu mulai
            <input className="input mt-1" type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} required />
          </label>
          <label className="text-sm font-medium text-slate-700">Lokasi
            <input className="input mt-1" value={location} onChange={(e) => setLocation(e.target.value)} maxLength={160} />
          </label>
          <button className="btn-primary md:col-span-2" type="submit" disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan agenda'}
          </button>
        </form>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-bold text-navy-900">Agenda organisasi</h2>
        {loading ? <p className="mt-4 text-sm text-slate-500">Memuat agenda...</p> : agendas.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Belum ada agenda.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {agendas.map((agenda) => (
              <li key={agenda.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <h3 className="font-semibold text-navy-900">{agenda.title}</h3>
                  <p className="text-sm text-slate-600">{agenda.startsAt} · {agenda.location || 'Lokasi belum ditentukan'}</p>
                </div>
                {hasAttendance(agenda.id) ? <span className="text-sm font-medium text-green-700">Kehadiran tercatat</span> : (
                  <button className="btn-secondary" disabled={saving} onClick={() => void markAttendance(agenda.id)}>Catat kehadiran saya</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};
