import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Students() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/courses');
        if (!cancelled) setCourses(data.courses || []);
      } catch {
        if (!cancelled) setError('Could not load courses.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalLearners = courses.reduce(
    (n, c) => n + (c.studentsEnrolled?.length || 0),
    0
  );

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-white">Students overview</h1>
      <p className="mt-1 text-[#a3a1af]">
        Enrollment counts per course across the catalog ({totalLearners} total seats filled).
      </p>

      {loading && <p className="mt-8 text-[#a3a1af]">Loading…</p>}
      {error && <p className="mt-8 text-sm text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-[#363544] bg-[#21202e] shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#363544] bg-[#171620] text-[#a3a1af]">
              <tr>
                <th className="px-4 py-3 font-semibold">Course</th>
                <th className="px-4 py-3 font-semibold">Instructor</th>
                <th className="px-4 py-3 text-right font-semibold">Enrolled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#363544]">
              {courses.map((c) => (
                <tr key={c._id} className="text-white">
                  <td className="px-4 py-3">
                    <Link
                      to={`/courses/${c._id}`}
                      className="font-medium text-[#b282fd] hover:underline"
                    >
                      {c.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[#a3a1af]">{c.instructor?.name || '—'}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-white">
                    {c.studentsEnrolled?.length ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
