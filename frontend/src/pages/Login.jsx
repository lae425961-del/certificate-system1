import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
export default function Login() {
  const nav = useNavigate();
  const [f, setF] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const { data } = await api.post("/auth/login", f);
      localStorage.setItem("token", data.token);
      nav("/admin");
    } catch (e) {
      setErr(e.response?.data?.message || "ເຊື່ອມຕໍ່ເຊີເວີບໍ່ໄດ້");
    }
    setBusy(false);
  };
  return (
    <main className="mx-auto max-w-md px-4 py-10 sm:px-6 sm:py-16">
      <Link
        to="/"
        className="mb-2 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
      >
        <span aria-hidden="true">←</span>
        ກັບໜ້າເວັບໄຊ
      </Link>
      <form onSubmit={submit} className="surface space-y-5 p-6 sm:p-9">
        <div className="mb-2 text-center">
          <img
            src="/education-emblem.png"
            alt="ສັນຍາລັກການສຶກສາ"
            className="mx-auto mb-4 h-28 w-28 rounded-full object-contain shadow-lg shadow-ink/10 sm:h-32 sm:w-32"
          />
          <h2 className="font-serif text-lg font-bold text-ink">
            ລະບົບອອກໃບຢັ້ງຢືນການສຶກສາ
          </h2>
          <span className="text-xs font-semibold tracking-widest text-gold">
            STAFF PORTAL
          </span>
          <h1 className="mt-2 font-serif text-2xl font-bold">ເຂົ້າສູ່ລະບົບ</h1>
          <p className="mt-2 text-sm leading-6 text-ink/60">
            ສຳລັບເຈົ້າໜ້າທີ່ເພື່ອເບິ່ງ, ແກ້ໄຂ ແລະສົ່ງອອກຂໍ້ມູນ.
          </p>
        </div>
        {err && (
          <div
            role="alert"
            className="rounded-lg bg-seal/10 p-3 text-sm text-seal"
          >
            {err}
          </div>
        )}
        <div>
          <label className="label">ຊື່ຜູ້ໃຊ້</label>
          <input
            required
            autoComplete="username"
            className="field"
            placeholder="ປ້ອນຊື່ຜູ້ໃຊ້"
            value={f.username}
            onChange={(e) => setF({ ...f, username: e.target.value })}
          />
        </div>
        <div>
          <label className="label">ລະຫັດຜ່ານ</label>
          <input
            required
            type="password"
            autoComplete="current-password"
            className="field"
            placeholder="••••••••"
            value={f.password}
            onChange={(e) => setF({ ...f, password: e.target.value })}
          />
        </div>
        <button disabled={busy} className="btn-primary w-full">
          {busy ? "ກຳລັງກວດສອບ..." : "ເຂົ້າສູ່ລະບົບ"}
          <span aria-hidden="true">→</span>
        </button>
      </form>
    </main>
  );
}
