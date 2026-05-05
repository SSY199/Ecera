import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import api from '../services/api';

function uid(x) {
  return x != null ? String(x) : '';
}

export default function MyCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/courses');
        const all = data.courses || [];
        const id = uid(user?._id);
        const mine = all.filter((c) => uid(c.instructor?._id || c.instructor) === id);
        if (!cancelled) setCourses(mine);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?._id]);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold text-white">My teaching</h1>
      <p className="mt-1 text-[#a3a1af]">Courses where you are listed as the instructor.</p>

      {loading && <p className="mt-8 text-[#a3a1af]">Loading…</p>}
      {!loading && courses.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-[#363544] bg-[#21202e] p-12 text-center text-[#a3a1af]">
          You are not teaching any courses yet.
          {user?.role === 'admin' && (
            <Link
              to="/add-course"
              className="mt-4 block font-medium text-[#b282fd] hover:underline"
            >
              Create a course
            </Link>
          )}
        </div>
      )}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}
