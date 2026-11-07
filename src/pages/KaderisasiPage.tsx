import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { createKader, createKaderTraining, listKader, listKaderTraining } from '@/services/kaderisasi';

export const KaderisasiPage = () => {
  const [kaders, setKaders] = useState<any[]>([]);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [personId, setPersonId] = useState('');
  const [level, setLevel] = useState<'Pemula' | 'Dasar' | 'Lanjutan' | 'Mahir'>('Pemula');
  const [status, setStatus] = useState<'Aktif' | 'Calon' | 'Alumni' | 'Tidak aktif'>('Aktif');
  const [cohort, setCohort] = useState('');
  const [notes, setNotes] = useState('');

  const [trainingTitle, setTrainingTitle] = useState('');
  const [trainingDate, setTrainingDate] = useState(new Date().toISOString().slice(0, 10));
  const [trainer, setTrainer] = useState('');

  const refresh = async () => {
    try {
      const [kaderRows, trainingRows] = await Promise.all([listKader(), listKaderTraining()]);
      setKaders(kaderRows);
      setTrainings(trainingRows);
    } catch (error) {
      console.error('Gagal memuat kaderisasi:', error);
      toast.error('Data kaderisasi gagal dimuat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const submitKader = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await createKader({
        personId: personId.trim() || 'demo-person',
        name: name.trim(),
        level,
        status,
        cohort: cohort.trim(),
        notes: notes.trim(),
      });
      setName('');
      setPersonId('');
      setLevel('Pemula');
      setStatus('Aktif');
      setCohort('');
      setNotes('');
      await refresh();
      toast.success('Data kader berhasil disimpan');
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan data kader');
    } finally {
      setSaving(false);
    }
  };

  const submitTraining = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (!personId.trim()) {
        toast.error('Pilih atau isi personId kader sebelum menyimpan pelatihan.');
        return;
      }
      await createKaderTraining({
        kaderId: personId.trim(),
        title: trainingTitle.trim(),
        date: trainingDate,
        trainer: trainer.trim(),
        notes: notes.trim(),
      });
      setTrainingTitle('');
      setTrainingDate(new Date().toISOString().slice(0, 10));
      setTrainer('');
      await refresh();
      toast.success('Pelatihan kader berhasil dicatat');
    } catch (error) {
      console.error(error);
      toast.error('Gagal mencatat pelatihan kader');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="space-y-6 p-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Kaderisasi</p>
        <h1 className="mt-1 text-3xl font-bold text-navy-900">Kader & Pelatihan</h1>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-navy-900">Tambah kader</h2>
          <form onSubmit={submitKader} className="mt-4 space-y-3">
            <label className="block text-sm font-medium text-slate-700">Nama kader<input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} required /></label>
            <label className="block text-sm font-medium text-slate-700">Person ID<input className="input mt-1" value={personId} onChange={(e) => setPersonId(e.target.value)} /></label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">Level<select className="input mt-1" value={level} onChange={(e) => setLevel(e.target.value as any)}><option>Pemula</option><option>Dasar</option><option>Lanjutan</option><option>Mahir</option></select></label>
              <label className="block text-sm font-medium text-slate-700">Status<select className="input mt-1" value={status} onChange={(e) => setStatus(e.target.value as any)}><option>Aktif</option><option>Calon</option><option>Alumni</option><option>Tidak aktif</option></select></label>
            </div>
            <label className="block text-sm font-medium text-slate-700">Kohort<input className="input mt-1" value={cohort} onChange={(e) => setCohort(e.target.value)} /></label>
            <label className="block text-sm font-medium text-slate-700">Catatan<textarea className="input mt-1" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
            <button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan kader'}</button>
          </form>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-navy-900">Catat pelatihan</h2>
          <form onSubmit={submitTraining} className="mt-4 space-y-3">
            <label className="block text-sm font-medium text-slate-700">Judul pelatihan<input className="input mt-1" value={trainingTitle} onChange={(e) => setTrainingTitle(e.target.value)} required /></label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">Tanggal<input className="input mt-1" type="date" value={trainingDate} onChange={(e) => setTrainingDate(e.target.value)} required /></label>
              <label className="block text-sm font-medium text-slate-700">Trainer<input className="input mt-1" value={trainer} onChange={(e) => setTrainer(e.target.value)} /></label>
            </div>
            <label className="block text-sm font-medium text-slate-700">Catatan<textarea className="input mt-1" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
            <button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan pelatihan'}</button>
          </form>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-navy-900">Daftar kader</h2>
          {loading ? <p className="mt-4 text-sm text-slate-500">Memuat data kader...</p> : kaders.length === 0 ? <p className="mt-4 text-sm text-slate-500">Belum ada data kader.</p> : <ul className="mt-4 space-y-3">{kaders.map((item) => <li key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3"><p className="font-semibold text-navy-900">{item.name}</p><p className="mt-1 text-sm text-slate-600">{item.level} · {item.status}</p></li>)}</ul>}
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-navy-900">Riwayat pelatihan</h2>
          {loading ? <p className="mt-4 text-sm text-slate-500">Memuat pelatihan...</p> : trainings.length === 0 ? <p className="mt-4 text-sm text-slate-500">Belum ada riwayat pelatihan.</p> : <ul className="mt-4 space-y-3">{trainings.map((item) => <li key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3"><p className="font-semibold text-navy-900">{item.title}</p><p className="mt-1 text-sm text-slate-600">{item.date} · {item.trainer || 'Trainer belum diisi'}</p></li>)}</ul>}
        </div>
      </section>
    </main>
  );
};
