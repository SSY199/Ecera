import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import api from '../services/api';

export default function MyLearning() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/courses');
        const all = data.courses || [];
        const id = user?._id != null ? String(user._id) : '';
        const enrolled = all.filter((c) =>
          (c.studentsEnrolled || []).some((s) => String(s) === id)
        );
        if (!cancelled) setCourses(enrolled);
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
      <h1 className="text-2xl font-bold text-white">My learning</h1>
      <p className="mt-1 text-[#a3a1af]">Courses you have enrolled in.</p>

      {loading && <p className="mt-8 text-[#a3a1af]">Loading…</p>}
      {!loading && courses.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-[#363544] bg-[#21202e] p-12 text-center text-[#a3a1af]">
          You have not enrolled in any courses yet.{' '}
          <Link to="/courses" className="font-medium text-[#b282fd] hover:underline">
            Browse the catalog
          </Link>
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
