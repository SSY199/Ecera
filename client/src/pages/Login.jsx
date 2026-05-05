import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Signed in successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Check your credentials.';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6c31f4] to-[#3e129e] font-sans px-4 py-12">
      <div className="relative w-full max-w-md rounded-3xl bg-[#21202e] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] text-white flex flex-col">
        <h2 className="text-[28px] font-semibold mb-2 text-left tracking-tight">Log in</h2>
        <p className="text-sm text-[#a3a1af] mb-6">Sign in to Ecera LMS</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-xl border border-[#363544] bg-[#171620] p-4 text-base text-white placeholder-[#a3a1af] focus:border-[#8c51f4] focus:outline-none transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-[#363544] bg-[#171620] p-4 text-base text-white placeholder-[#a3a1af] focus:border-[#8c51f4] focus:outline-none transition-colors"
          />

          <button
            type="submit"
            className="mt-1 w-full rounded-xl bg-[#8c51f4] py-3.5 text-lg font-semibold text-white shadow-lg shadow-[#8c51f4]/20 transition-colors hover:bg-[#7b44e2]"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-[#a3a1af]">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-[#b282fd] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
