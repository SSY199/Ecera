import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatMoney } from '../utils/format';

function uid(x) {
  return x != null ? String(x) : '';
}

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionBusy, setActionBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        if (!cancelled) setCourse(data.course);
      } catch {
        if (!cancelled) setError('Course not found.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const userId = uid(user?._id);
  const instructorId = uid(course?.instructor?._id || course?.instructor);
  const isInstructor = userId && instructorId === userId;
  const isEnrolled =
    course && (course.studentsEnrolled || []).some((s) => String(s) === userId);
  const isAdmin = user?.role === 'admin';

  const handleEnroll = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionBusy(true);
    try {
      await api.post('/payments/process', {
        courseId: course._id,
        ...(couponCode.trim() ? { couponCode: couponCode.trim() } : {}),
      });
      toast.success('Enrolled successfully');
      navigate('/my-learning');
    } catch (err) {
      setActionError(err.response?.data?.message || 'Enrollment failed.');
    } finally {
      setActionBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    setActionBusy(true);
    setActionError('');
    try {
      await api.delete(`/courses/${id}`);
      toast.success('Course deleted');
      navigate('/courses');
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not delete course.');
    } finally {
      setActionBusy(false);
    }
  };

  if (loading) {
    return <p className="text-[#a3a1af]">Loading course…</p>;
  }
  if (error || !course) {
    return (
      <div className="rounded-2xl border border-[#363544] bg-[#21202e] p-8 text-center shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        <p className="text-red-400">{error || 'Not found'}</p>
        <Link
          to="/courses"
          className="mt-4 inline-block font-medium text-[#b282fd] hover:underline"
        >
          Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/courses" className="text-sm font-medium text-[#b282fd] hover:underline">
        ← Back to catalog
      </Link>

      <article className="mt-6 overflow-hidden rounded-2xl border border-[#363544] bg-[#21202e] shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt="" className="h-56 w-full bg-[#171620] object-cover" />
        ) : (
          <div className="h-56 w-full bg-gradient-to-br from-[#6c31f4]/50 to-[#3e129e]/50" />
        )}
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{course.title}</h1>
              <p className="mt-2 text-[#a3a1af]">
                Instructor:{' '}
                <span className="font-medium text-white">{course.instructor?.name || '—'}</span>
              </p>
            </div>
            <p className="text-2xl font-bold text-[#8c51f4]">{formatMoney(course.price)}</p>
          </div>

          <div className="mt-6 max-w-none">
            <h2 className="text-lg font-semibold text-white">About this course</h2>
            <p className="mt-2 whitespace-pre-wrap leading-relaxed text-[#a3a1af]">
              {course.description}
            </p>
          </div>

          {actionError && (
            <div className="mt-6 rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {actionError}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {isEnrolled && (
              <span className="inline-flex items-center rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-4 py-2 text-sm font-medium text-emerald-300">
                You are enrolled
              </span>
            )}
            {!isEnrolled && !isInstructor && (
              <form onSubmit={handleEnroll} className="flex w-full max-w-md flex-col gap-3">
                <label className="block">
                  <span className="text-xs font-medium uppercase tracking-wide text-[#a3a1af]">
                    Coupon (optional)
                  </span>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="SAVE10"
                    className="mt-1 w-full rounded-xl border border-[#363544] bg-[#171620] px-4 py-2.5 text-white placeholder:text-[#a3a1af] focus:border-[#8c51f4] focus:outline-none focus:ring-2 focus:ring-[#8c51f4]/25"
                  />
                </label>
                <button
                  type="submit"
                  disabled={actionBusy}
                  className="rounded-xl bg-[#8c51f4] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7b44e2] disabled:opacity-60"
                >
                  {actionBusy ? 'Processing…' : 'Enroll & pay'}
                </button>
              </form>
            )}
            {isInstructor && (
              <p className="text-sm text-[#a3a1af]">You are the instructor for this course.</p>
            )}
            {isAdmin && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={actionBusy}
                className="rounded-xl border border-red-500/40 bg-[#171620] px-5 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-950/50 disabled:opacity-60"
              >
                Delete course
              </button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
