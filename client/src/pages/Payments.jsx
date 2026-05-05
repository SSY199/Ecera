import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { formatMoney } from '../utils/format';

function formatDate(d) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return '—';
  }
}

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/payments/history');
        if (!cancelled) setPayments(data.payments || []);
      } catch {
        if (!cancelled) setError('Could not load payment history.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-white">Payment history</h1>
      <p className="mt-1 text-[#a3a1af]">Your completed enrollments and transactions.</p>

      {loading && <p className="mt-8 text-[#a3a1af]">Loading…</p>}
      {error && <p className="mt-8 text-sm text-red-400">{error}</p>}

      {!loading && !error && payments.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-[#363544] bg-[#21202e] p-12 text-center text-[#a3a1af]">
          No payments yet.{' '}
          <Link to="/courses" className="font-medium text-[#b282fd] hover:underline">
            Enroll in a course
          </Link>
        </div>
      )}

      {!loading && payments.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-[#363544] bg-[#21202e] shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#363544] bg-[#171620] text-[#a3a1af]">
              <tr>
                <th className="px-4 py-3 font-semibold">Course</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Transaction</th>
                <th className="px-4 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#363544]">
              {payments.map((p) => (
                <tr key={p._id} className="text-white">
                  <td className="px-4 py-3">
                    {p.course?.title ? (
                      <Link
                        to={`/courses/${p.course._id}`}
                        className="font-medium text-[#b282fd] hover:underline"
                      >
                        {p.course.title}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3">{formatMoney(p.amountPaid)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#a3a1af]">{p.transactionId}</td>
                  <td className="px-4 py-3 text-[#a3a1af]">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
