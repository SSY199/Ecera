import { Link } from 'react-router-dom';
import { formatMoney } from '../utils/format';

export default function CourseCard({ course }) {
  const instructorName = course.instructor?.name || 'Instructor';

  return (
    <Link
      to={`/courses/${course._id}`}
      className="group flex flex-col rounded-2xl border border-[#363544] bg-[#21202e] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-shadow hover:border-[#8c51f4]/40 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
    >
      {course.thumbnail ? (
        <img
          src={course.thumbnail}
          alt=""
          className="mb-4 h-36 w-full rounded-xl bg-[#171620] object-cover"
        />
      ) : (
        <div className="mb-4 flex h-36 w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#6c31f4]/40 to-[#3e129e]/40 text-sm font-medium text-[#a3a1af]">
          Course
        </div>
      )}
      <h3 className="line-clamp-2 text-lg font-semibold text-white group-hover:text-[#b282fd]">
        {course.title}
      </h3>
      <p className="mt-2 line-clamp-2 flex-1 text-sm text-[#a3a1af]">{course.description}</p>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-[#a3a1af]">{instructorName}</span>
        <span className="font-semibold text-[#8c51f4]">{formatMoney(course.price)}</span>
      </div>
    </Link>
  );
}
