import { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard';
import api from '../services/api';

export default function Courses() {
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

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Browse courses</h1>
        <p className="mt-1 text-[#a3a1af]">Choose a course to view details and enroll.</p>
      </div>

      {loading && <p className="text-[#a3a1af]">Loading…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {!loading && !error && courses.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#363544] bg-[#21202e] p-12 text-center text-[#a3a1af]">
          No courses yet. Admins can add courses from the sidebar.
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}
