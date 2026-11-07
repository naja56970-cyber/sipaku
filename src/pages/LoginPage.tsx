import { FormEvent, useState } from 'react';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { auth } from '@/config/firebase';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Masukkan email terlebih dahulu');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Link reset password telah dikirim');
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengirim link');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-navy-900 text-lg font-bold text-white">
            S
          </div>
          <h1 className="text-2xl font-bold text-navy-900">SIPAKU</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sistem Informasi dan Pengelolaan Administrasi Komisariat
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={handleResetPassword}
            className="font-medium text-green-600 hover:text-green-500"
          >
            Lupa password?
          </button>
          <Link to="/register" className="font-medium text-navy-800 hover:text-navy-700">
            Daftar akun
          </Link>
        </div>
      </div>
    </div>
  );
};
