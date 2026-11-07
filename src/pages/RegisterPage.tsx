import { FormEvent, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { auth, db } from '@/config/firebase';
import type { AppUser } from '@/types/user';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const profile: AppUser = {
        uid: result.user.uid,
        email,
        username: name.trim(),
        role: 'anggota',
        status: 'pending',
        organizationId: 'default',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', result.user.uid), profile);
      await sendEmailVerification(result.user);

      toast.success('Registrasi berhasil. Silakan cek email untuk verifikasi.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-navy-900">Daftar SIPAKU</h1>
          <p className="mt-2 text-sm text-slate-500">
            Ajukan akun pengurus untuk menunggu persetujuan admin.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Nama Lengkap</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Mendaftar...' : 'Daftar Akun'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
};
