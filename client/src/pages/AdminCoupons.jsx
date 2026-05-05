import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function AdminCoupons() {
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('10');
  const [usageLimit, setUsageLimit] = useState('100');
  const [expiresAt, setExpiresAt] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setBusy(true);
    try {
      await api.post('/coupons', {
        code: code.trim().toUpperCase(),
        discountPercentage: Number(discountPercentage),
        usageLimit: Number(usageLimit),
        expiresAt: new Date(expiresAt).toISOString(),
      });
      const label = code.trim().toUpperCase();
      setMessage(`Coupon ${label} created.`);
      toast.success(`Coupon ${label} created`);
      setCode('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create coupon.');
      toast.error(err.response?.data?.message || 'Could not create coupon.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-white">Coupons</h1>
      <p className="mt-1 text-[#a3a1af]">
        Create discount codes learners can apply at checkout (mock payment).
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-[#363544] bg-[#21202e] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)] sm:p-8"
      >
        {message && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
            {message}
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
        <label className="block">
          <span className="text-sm font-medium text-white">Code</span>
          <input
            required
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="SAVE20"
            className="mt-1 w-full rounded-xl border border-[#363544] bg-[#171620] px-4 py-2.5 font-mono text-white focus:border-[#8c51f4] focus:outline-none focus:ring-2 focus:ring-[#8c51f4]/25"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-white">Discount %</span>
          <input
            required
            type="number"
            min="1"
            max="100"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#363544] bg-[#171620] px-4 py-2.5 text-white focus:border-[#8c51f4] focus:outline-none focus:ring-2 focus:ring-[#8c51f4]/25"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-white">Usage limit</span>
          <input
            required
            type="number"
            min="1"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#363544] bg-[#171620] px-4 py-2.5 text-white focus:border-[#8c51f4] focus:outline-none focus:ring-2 focus:ring-[#8c51f4]/25"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-white">Expires</span>
          <input
            required
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#363544] bg-[#171620] px-4 py-2.5 text-white focus:border-[#8c51f4] focus:outline-none focus:ring-2 focus:ring-[#8c51f4]/25"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-[#8c51f4] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7b44e2] disabled:opacity-60"
        >
          {busy ? 'Saving…' : 'Create coupon'}
        </button>
      </form>
    </div>
  );
}
