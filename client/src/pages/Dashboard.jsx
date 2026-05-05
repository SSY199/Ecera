import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function uid(u) {
  return u?._id != null ? String(u._id) : '';
}

export default function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/courses');
        if (!cancelled) setCourses(data.courses || []);
      } catch {
        if (!cancelled) setCourses([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const id = uid(user);
  const teaching = courses.filter((c) => uid(c.instructor) === id);
  const learning = courses.filter((c) =>
    (c.studentsEnrolled || []).some((s) => String(s) === id)
  );

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-2 text-[#a3a1af]">
          Explore courses, track enrollments, and manage your teaching from one place.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[#363544] bg-[#21202e] p-12 text-center text-[#a3a1af] shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          Loading overview…
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#363544] bg-[#21202e] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            <p className="text-sm font-medium text-[#a3a1af]">Catalog</p>
            <p className="mt-2 text-3xl font-bold text-white">{courses.length}</p>
            <p className="mt-1 text-sm text-[#a3a1af]">Published courses</p>
          </div>
          <div className="rounded-2xl border border-[#363544] bg-[#21202e] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            <p className="text-sm font-medium text-[#a3a1af]">My learning</p>
            <p className="mt-2 text-3xl font-bold text-[#8c51f4]">{learning.length}</p>
            <Link
              to="/my-learning"
              className="mt-2 inline-block text-sm font-medium text-[#b282fd] hover:underline"
            >
              View enrollments
            </Link>
          </div>
          <div className="rounded-2xl border border-[#363544] bg-[#21202e] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            <p className="text-sm font-medium text-[#a3a1af]">My teaching</p>
            <p className="mt-2 text-3xl font-bold text-white">{teaching.length}</p>
            <Link
              to="/my-courses"
              className="mt-2 inline-block text-sm font-medium text-[#b282fd] hover:underline"
            >
              Manage courses
            </Link>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-[#363544] bg-[#21202e] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        <h2 className="text-lg font-semibold text-white">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/courses"
            className="rounded-xl bg-[#8c51f4] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7b44e2]"
          >
            Browse catalog
          </Link>
          <Link
            to="/payments"
            className="rounded-xl border border-[#363544] bg-[#171620] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-[#8c51f4]"
          >
            Payment history
          </Link>
          {user?.role === 'admin' && (
            <Link
              to="/add-course"
              className="rounded-xl border border-[#8c51f4]/40 bg-[#171620] px-5 py-2.5 text-sm font-semibold text-[#b282fd] transition-colors hover:bg-[#363544]/50"
            >
              New course
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
