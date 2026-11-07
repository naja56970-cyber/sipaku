import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { createBudget, createFinanceEntry, listBudgets, listFinanceEntries, type BudgetEntry, type FinanceDirection, type FinanceEntry } from '@/services/finance';
import type { UserRole } from '@/types/user';

const FINANCE_ROLES: UserRole[] = ['super_admin', 'bendahara'];
const rupiah = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

export const FinancePage = () => {
  const { user } = useAuth();
  const canManage = Boolean(user && FINANCE_ROLES.includes(user.role));
  const [periodId, setPeriodId] = useState('');
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [budgets, setBudgets] = useState<BudgetEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Operasional');
  const [direction, setDirection] = useState<FinanceDirection>('income');
  const [amount, setAmount] = useState('');
  const [occurredOn, setOccurredOn] = useState(new Date().toISOString().slice(0, 10));
  const [budgetTitle, setBudgetTitle] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  const refresh = async (selectedPeriod: string) => {
    if (!selectedPeriod.trim()) {
      setEntries([]);
      setBudgets([]);
      return;
    }
    setLoading(true);
    try {
      const [transactionRows, budgetRows] = await Promise.all([
        listFinanceEntries(selectedPeriod.trim()),
        listBudgets(selectedPeriod.trim()),
      ]);
      setEntries(transactionRows);
      setBudgets(budgetRows);
    } catch (error) {
      console.error('Gagal memuat data keuangan:', error);
      toast.error('Data keuangan gagal dimuat. Periksa periode dan hak akses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (periodId) void refresh(periodId);
  }, [periodId]);

  const balance = useMemo(() => entries.reduce((sum, item) => sum + (item.direction === 'income' ? item.amount : -item.amount), 0), [entries]);

  const submitTransaction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManage) return toast.error('Hanya Bendahara atau Super Admin yang dapat mencatat transaksi.');
    const parsedAmount = Number(amount);
    if (!Number.isSafeInteger(parsedAmount) || parsedAmount <= 0) return toast.error('Nominal harus bilangan bulat positif.');
    setSaving(true);
    try {
      await createFinanceEntry({
        periodId: periodId.trim(),
        description: description.trim(),
        category: category.trim(),
        direction,
        amount: parsedAmount,
        occurredOn,
      });
      setDescription('');
      setAmount('');
      await refresh(periodId);
      toast.success('Transaksi tercatat. Koreksi dilakukan dengan transaksi pembalik, bukan menghapus riwayat.');
    } catch (error) {
      console.error(error);
      toast.error('Transaksi gagal disimpan. Pastikan periode valid dan akun berwenang.');
    } finally {
      setSaving(false);
    }
  };

  const submitBudget = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManage) return toast.error('Hanya Bendahara atau Super Admin yang dapat membuat anggaran.');
    const parsedAmount = Number(budgetAmount);
    if (!Number.isSafeInteger(parsedAmount) || parsedAmount <= 0) return toast.error('Nominal anggaran harus bilangan bulat positif.');
    setSaving(true);
    try {
      await createBudget({ periodId: periodId.trim(), title: budgetTitle.trim(), amount: parsedAmount });
      setBudgetTitle('');
      setBudgetAmount('');
      await refresh(periodId);
      toast.success('Anggaran berhasil dicatat');
    } catch (error) {
      console.error(error);
      toast.error('Anggaran gagal disimpan. Pastikan periode valid dan akun berwenang.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="space-y-6 p-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Administrasi</p>
        <h1 className="mt-1 text-3xl font-bold text-navy-900">Keuangan & Anggaran</h1>
        <p className="mt-2 text-sm text-slate-600">Catatan transaksi bersifat append-only dan seluruh perubahan administratif tercatat di audit log.</p>
      </header>

      <section className="card p-6">
        <label className="block max-w-xl text-sm font-medium text-slate-700">ID periode
          <input className="input mt-1" value={periodId} onChange={(event) => setPeriodId(event.target.value)} placeholder="Pilih/masukkan ID dokumen periode" />
        </label>
        {!periodId && <p className="mt-2 text-sm text-amber-700">Masukkan ID dokumen periode yang sudah dibuat untuk melihat data keuangan.</p>}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card p-5"><p className="text-sm text-slate-500">Saldo periode</p><p className="mt-2 text-2xl font-bold text-navy-900">{rupiah(balance)}</p></div>
        <div className="card p-5"><p className="text-sm text-slate-500">Pemasukan</p><p className="mt-2 text-xl font-bold text-green-700">{rupiah(entries.filter((item) => item.direction === 'income').reduce((sum, item) => sum + item.amount, 0))}</p></div>
        <div className="card p-5"><p className="text-sm text-slate-500">Pengeluaran</p><p className="mt-2 text-xl font-bold text-rose-700">{rupiah(entries.filter((item) => item.direction === 'expense').reduce((sum, item) => sum + item.amount, 0))}</p></div>
      </section>

      {canManage && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card p-6">
            <h2 className="text-xl font-bold text-navy-900">Catat transaksi</h2>
            <form className="mt-4 space-y-3" onSubmit={submitTransaction}>
              <label className="block text-sm font-medium text-slate-700">Keterangan<input className="input mt-1" value={description} onChange={(e) => setDescription(e.target.value)} required maxLength={160} /></label>
              <label className="block text-sm font-medium text-slate-700">Kategori<input className="input mt-1" value={category} onChange={(e) => setCategory(e.target.value)} required maxLength={80} /></label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">Jenis<select className="input mt-1" value={direction} onChange={(e) => setDirection(e.target.value as FinanceDirection)}><option value="income">Pemasukan</option><option value="expense">Pengeluaran</option></select></label>
                <label className="block text-sm font-medium text-slate-700">Tanggal<input className="input mt-1" type="date" value={occurredOn} onChange={(e) => setOccurredOn(e.target.value)} required /></label>
              </div>
              <label className="block text-sm font-medium text-slate-700">Nominal (rupiah)<input className="input mt-1" type="number" min="1" step="1" value={amount} onChange={(e) => setAmount(e.target.value)} required /></label>
              <button className="btn-primary" disabled={saving || !periodId} type="submit">{saving ? 'Menyimpan...' : 'Simpan transaksi'}</button>
            </form>
          </section>
          <section className="card p-6">
            <h2 className="text-xl font-bold text-navy-900">Catat anggaran</h2>
            <form className="mt-4 space-y-3" onSubmit={submitBudget}>
              <label className="block text-sm font-medium text-slate-700">Nama anggaran<input className="input mt-1" value={budgetTitle} onChange={(e) => setBudgetTitle(e.target.value)} required maxLength={120} /></label>
              <label className="block text-sm font-medium text-slate-700">Nominal (rupiah)<input className="input mt-1" type="number" min="1" step="1" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} required /></label>
              <button className="btn-primary" disabled={saving || !periodId} type="submit">{saving ? 'Menyimpan...' : 'Simpan anggaran'}</button>
            </form>
          </section>
        </div>
      )}

      <section className="card overflow-hidden p-6">
        <h2 className="text-xl font-bold text-navy-900">Riwayat transaksi</h2>
        {loading ? <p className="mt-4 text-sm text-slate-500">Memuat transaksi...</p> : entries.length === 0 ? <p className="mt-4 text-sm text-slate-500">Belum ada transaksi untuk periode ini.</p> : (
          <div className="mt-4 overflow-x-auto"><table className="min-w-full text-left text-sm"><thead><tr className="border-b text-slate-500"><th className="py-2 pr-4">Tanggal</th><th className="py-2 pr-4">Keterangan</th><th className="py-2 pr-4">Kategori</th><th className="py-2 pr-4">Jenis</th><th className="py-2 text-right">Nominal</th></tr></thead><tbody>
            {entries.map((item) => <tr key={item.id} className="border-b border-slate-100"><td className="py-3 pr-4">{item.occurredOn}</td><td className="py-3 pr-4">{item.description}</td><td className="py-3 pr-4">{item.category}</td><td className="py-3 pr-4">{item.direction === 'income' ? 'Pemasukan' : 'Pengeluaran'}</td><td className="py-3 text-right font-medium">{rupiah(item.amount)}</td></tr>)}
          </tbody></table></div>
        )}
      </section>

      <section className="card overflow-hidden p-6">
        <h2 className="text-xl font-bold text-navy-900">Anggaran periode</h2>
        {budgets.length === 0 ? <p className="mt-4 text-sm text-slate-500">Belum ada anggaran untuk periode ini.</p> : (
          <ul className="mt-4 divide-y divide-slate-100">{budgets.map((item) => <li key={item.id} className="flex justify-between gap-4 py-3"><span className="font-medium text-slate-700">{item.title}</span><span className="font-semibold text-navy-900">{rupiah(item.amount)}</span></li>)}</ul>
        )}
      </section>
    </main>
  );
};
