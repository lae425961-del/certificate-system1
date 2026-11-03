import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
export default function Header() {
  const nav = useNavigate();
  const location = useLocation();
  const authed = !!localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);
  if (location.pathname === "/") {
    const closeMenu = () => setMenuOpen(false);
    return (
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 text-slate-700 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
          <a href="#home" className="group flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 text-white shadow-md transition-transform group-hover:scale-105 sm:h-12 sm:w-12">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-7 w-7"
              >
                <path d="m2 8 10-5 10 5-10 5L2 8Zm3 3.2 7 3.5 7-3.5V16c-4.1 3.2-9.9 3.2-14 0v-4.8ZM20 9l2-1v7h-2V9Z" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block truncate font-serif text-sm font-bold leading-tight text-slate-900 sm:text-lg">
                ລະບົບອອກໃບຢັ້ງຢືນການສຶກສາ
              </span>
              <span className="mt-1 hidden text-[10px] font-semibold tracking-wide text-blue-600 sm:block sm:text-xs">
                CERTIFICATE &amp; STUDENT MANAGEMENT
              </span>
            </span>
          </a>
          <nav className="hidden items-center gap-5 font-medium lg:flex xl:gap-7">
            <a
              href="#home"
              className="border-b-2 border-transparent py-2 transition hover:border-blue-600 hover:text-blue-600"
            >
              ໜ້າຫຼັກ
            </a>
            <a
              href="#about"
              className="border-b-2 border-transparent py-2 transition hover:border-blue-600 hover:text-blue-600"
            >
              ກ່ຽວກັບລະບົບ
            </a>
            <a
              href="#curriculum"
              className="border-b-2 border-transparent py-2 transition hover:border-blue-600 hover:text-blue-600"
            >
              ຄວາມສາມາດ
            </a>
            <a
              href="#activities"
              className="border-b-2 border-transparent py-2 transition hover:border-blue-600 hover:text-blue-600"
            >
              ຂັ້ນຕອນ
            </a>
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="#enroll"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              ລົງທະບຽນນັກສຶກສາ
            </a>
            <Link
              to="/login"
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
            >
              ເຂົ້າສູ່ລະບົບ
            </Link>
          </div>
          <button
            type="button"
            aria-label={menuOpen ? "ປິດເມນູ" : "ເປີດເມນູ"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100 lg:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              {menuOpen ? (
                <path d="m18.3 5.7-1.4-1.4L12 9.2 7.1 4.3 5.7 5.7l4.9 4.9-4.9 4.9 1.4 1.4 4.9-4.9 4.9 4.9 1.4-1.4-4.9-4.9 4.9-4.9Z" />
              ) : (
                <path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" />
              )}
            </svg>
          </button>
        </div>
        {menuOpen && (
          <nav className="space-y-1 border-t border-slate-100 bg-white px-4 pb-5 pt-3 lg:hidden">
            {[
              ["#home", "ໜ້າຫຼັກ"],
              ["#about", "ກ່ຽວກັບລະບົບ"],
              ["#curriculum", "ຄວາມສາມາດ"],
              ["#activities", "ຂັ້ນຕອນ"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={closeMenu}
                className="block rounded-lg px-3 py-2.5 font-medium transition hover:bg-blue-50 hover:text-blue-700"
              >
                {label}
              </a>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/login"
                onClick={closeMenu}
                className="rounded-xl border border-slate-200 px-3 py-3 text-center text-sm font-semibold text-slate-700"
              >
                ເຈົ້າໜ້າທີ່
              </Link>
              <a
                href="#enroll"
                onClick={closeMenu}
                className="rounded-xl bg-blue-600 px-3 py-3 text-center text-sm font-semibold text-white"
              >
                ລົງທະບຽນ
              </a>
            </div>
          </nav>
        )}
      </header>
    );
  }
  return (
    <header className="sticky top-0 z-10 border-b border-blue-300/20 bg-gradient-to-r from-[#263477] via-[#303b91] to-[#245bd2] text-white shadow-lg shadow-blue-950/15">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div to="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/10 text-2xl text-yellow-300 shadow-inner">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-7 w-7"
            >
              <path d="M2.4 8.3 12 3l9.6 5.3L12 13.6 2.4 8.3Zm3.1 3.2 6.5 3.6 6.5-3.6v4.1c-3.7 3.2-9.3 3.2-13 0v-4.1Zm14.1-1.6 1.4-.8v5.1h-1.4V9.9Z" />
            </svg>
          </span>
          <span className="min-w-0 font-serif text-sm font-bold leading-tight sm:text-base">
            ລະບົບອອກໃບຢັ້ງຢືນການສຶກສາ
            <span className="mt-1 hidden truncate text-[11px] font-normal tracking-wide text-blue-100/80 sm:block">
              Certificate Issuance &amp; Student Management System
            </span>
          </span>
        </div>
        
        <nav className="flex shrink-0 items-center gap-2 text-[11px] sm:text-sm">
          {authed ? (
            <>
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-2 font-medium text-white transition hover:bg-white/20"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                <span className="hidden sm:inline">ຈັດການຂໍ້ມູນ</span>
                <span className="sm:hidden">Admin</span>
              </Link>
              <button
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-3 py-2 font-semibold text-white shadow-sm transition hover:bg-blue-400"
                onClick={() => {
                  localStorage.removeItem("token");
                  nav("/login");
                }}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M10 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H10v-2h9V5h-9V3Zm1.7 5.3L16.4 13l-4.7 4.7-1.4-1.4 2.3-2.3H3v-2h9.6l-2.3-2.3 1.4-1.4Z" />
                </svg>
                <span className="hidden sm:inline">ອອກຈາກລະບົບ</span>
                <span className="sm:hidden">ອອກ</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-3 py-2 font-semibold text-white shadow-sm transition hover:bg-blue-400"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M12 2a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 0 1 6 0v3H9Zm3 4a2 2 0 0 1 1 3.7V19h-2v-1.3a2 2 0 0 1 1-3.7Z" />
              </svg>
              ເຂົ້າສູ່ລະບົບ
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
