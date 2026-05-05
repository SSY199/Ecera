import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-[#8c51f4]/20 text-white'
      : 'text-[#a3a1af] hover:bg-[#363544]/60 hover:text-white'
  }`;

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="lg:w-64 lg:shrink-0">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#363544] bg-[#21202e] px-4 lg:hidden">
        <span className="font-bold text-white">
          Ecera<span className="text-[#8c51f4]">LMS</span>
        </span>
        <button
          type="button"
          className="rounded-lg border border-[#363544] bg-[#171620] px-3 py-1.5 text-sm font-medium text-white"
          onClick={() => setMobileOpen(true)}
          aria-expanded={mobileOpen}
          aria-label="Open menu"
        >
          Menu
        </button>
      </header>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close menu"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex min-h-screen w-64 flex-col border-r border-[#363544] bg-[#21202e] shadow-[0_10px_40px_rgba(0,0,0,0.45)]
          transition-transform duration-200 lg:static lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex h-16 shrink-0 items-center border-b border-[#363544] px-6">
          <NavLink
            to="/"
            className="text-xl font-bold tracking-tight text-white"
            onClick={closeMobile}
          >
            Ecera<span className="text-[#8c51f4]">LMS</span>
          </NavLink>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          <NavLink to="/" end className={linkClass} onClick={closeMobile}>
            Dashboard
          </NavLink>
          <NavLink to="/courses" className={linkClass} onClick={closeMobile}>
            Browse courses
          </NavLink>
          <NavLink to="/my-learning" className={linkClass} onClick={closeMobile}>
            My learning
          </NavLink>
          <NavLink to="/my-courses" className={linkClass} onClick={closeMobile}>
            My teaching
          </NavLink>
          <NavLink to="/payments" className={linkClass} onClick={closeMobile}>
            Payments
          </NavLink>

          {isAdmin && (
            <>
              <p className="px-4 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-[#a3a1af]/80">
                Admin
              </p>
              <NavLink to="/add-course" className={linkClass} onClick={closeMobile}>
                Add course
              </NavLink>
              <NavLink to="/admin/coupons" className={linkClass} onClick={closeMobile}>
                Coupons
              </NavLink>
              <NavLink to="/students" className={linkClass} onClick={closeMobile}>
                Students
              </NavLink>
            </>
          )}
        </nav>

        <div className="shrink-0 space-y-3 border-t border-[#363544] p-4">
          <div className="px-2">
            <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
            <p className="text-xs capitalize text-[#a3a1af]">{user?.role}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              closeMobile();
              logout();
            }}
            className="w-full rounded-xl border border-[#363544] bg-[#171620] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-[#8c51f4]/50"
          >
            Log out
          </button>
        </div>
      </aside>
    </div>
  );
}
