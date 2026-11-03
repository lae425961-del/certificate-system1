import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import StudentForm from "../components/StudentForm";
import { GEO, PROVINCES, fmtBirth } from "../laos";

export default function Admin() {
  const [data, setData] = useState({ total: 0, byProvince: [], items: [] });
  const [q, setQ] = useState({ search: "", province: "", district: "" });
  const [edit, setEdit] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addError, setAddError] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminSaving, setAdminSaving] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminForm, setAdminForm] = useState({ username: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(q).filter(([, v]) => v));
    try {
      const { data } = await api.get("/students", { params });
      setData(data);
    } catch {}
    setLoading(false);
  }, [q]);
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const exportXlsx = async () => {
    const params = Object.fromEntries(Object.entries(q).filter(([, v]) => v));
    const { data } = await api.get("/students/export", {
      params,
      responseType: "blob",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(data);
    a.download = "students.xlsx";
    a.click();
  };
  const addStudent = async (student) => {
    setSaving(true);
    setAddError("");
    try {
      await api.post("/students", student);
      setAddOpen(false);
      setQ({ search: "", province: "", district: "" });
      setMsg("ເພີ່ມຂໍ້ມູນນັກສຶກສາສຳເລັດແລ້ວ");
    } catch (e) {
      setAddError(
        e.response?.data?.message || "ບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ, ກະລຸນາລອງໃໝ່",
      );
    } finally {
      setSaving(false);
    }
  };
  const addAdmin = async (event) => {
    event.preventDefault();
    setAdminError("");
    if (adminForm.password !== adminForm.confirmPassword) {
      setAdminError("ລະຫັດຜ່ານຢືນຢັນບໍ່ກົງກັນ");
      return;
    }

    setAdminSaving(true);
    try {
      await api.post("/admins", {
        username: adminForm.username,
        password: adminForm.password,
      });
      setAdminOpen(false);
      setAdminForm({ username: "", password: "", confirmPassword: "" });
      setMsg("ສ້າງບັນຊີຜູ້ດູແລລະບົບສຳເລັດແລ້ວ");
    } catch (e) {
      setAdminError(e.response?.data?.message || "ບໍ່ສາມາດສ້າງບັນຊີໄດ້, ກະລຸນາລອງໃໝ່");
    } finally {
      setAdminSaving(false);
    }
  };
  const save = async (v) => {
    await api.put(`/students/${edit._id}`, v);
    setEdit(null);
    setMsg("ແກ້ໄຂຂໍ້ມູນແລ້ວ");
    load();
  };
  const del = async (s) => {
    if (confirm(`ລຶບ ${s.firstName} ${s.lastName} ?`)) {
      await api.delete(`/students/${s._id}`);
      setMsg("ລຶບຂໍ້ມູນແລ້ວ");
      load();
    }
  };
  const top = data.byProvince[0];

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold tracking-widest text-blue-600">
            ADMIN DASHBOARD
          </span>
          <h1 className="mt-1 font-serif text-xl font-bold sm:text-2xl">
            ພາບລວມຂໍ້ມູນນັກສຶກສາ
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/"
            className="btn-ghost !rounded-lg !px-3 !py-2 print:hidden"
          >
            <span aria-hidden="true">←</span>
            ກັບໜ້າເວັບໄຊ
          </Link>
          <Link
            to="/admin/accounts"
            className="btn-ghost !rounded-lg !px-3 !py-2 print:hidden"
          >
            ລາຍງານຜູ້ດູແລ
          </Link>
          <button
            onClick={() => {
              setAdminError("");
              setAdminForm({ username: "", password: "", confirmPassword: "" });
              setAdminOpen(true);
            }}
            className="btn-ghost !rounded-lg !px-3 !py-2 print:hidden"
          >
            + ເພີ່ມຜູ້ດູແລ
          </button>
          <button
            onClick={() => {
              setAddError("");
              setAddOpen(true);
            }}
            className="btn-primary !rounded-lg !px-3 !py-2 print:hidden"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              +
            </span>
            ເພີ່ມນັກສຶກສາ
          </button>
          
          <button
            onClick={exportXlsx}
            className="btn-primary !rounded-lg !px-3 !py-2 print:hidden"
          >
            ສົ່ງອອກ Excel
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-900/[.04] sm:p-5">
          <div>
            <p className="text-sm text-slate-500">ລົງທະບຽນທັງໝົດ</p>
            <p className="mt-1 font-serif text-2xl font-bold text-slate-800">
              {data.total}
            </p>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0H5Zm14-9a3 3 0 1 0-2.8-4 5.8 5.8 0 0 1 0 4 3 3 0 0 0 2.8 0Zm-1.8 2a7 7 0 0 1 3.8 6h-3a8.8 8.8 0 0 0-.8-6Z" />
            </svg>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-900/[.04] sm:p-5">
          <div>
            <p className="text-sm text-slate-500">ແຂວງທີ່ມີການລົງທະບຽນ</p>
            <p className="mt-1 font-serif text-2xl font-bold text-amber-600">
              {data.byProvince.length}
            </p>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
            </svg>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-900/[.04] sm:p-5">
          <div>
            <p className="text-sm text-slate-500">ແຂວງທີ່ລົງທະບຽນຫຼາຍສຸດ</p>
            <p className="mt-1 font-serif text-2xl font-bold text-emerald-600">
              {top?.count ?? 0}
              <span className="ml-1 text-sm font-normal text-slate-500">
                ຄົນ
              </span>
            </p>
            {top && <p className="mt-0.5 text-xs text-slate-500">{top._id}</p>}
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path d="M3 19h18v2H3v-2Zm2-2V9h3v8H5Zm5 0V4h3v13h-3Zm5 0v-6h3v6h-3Z" />
            </svg>
          </div>
        </div>
      </div>

      {msg && (
        <div className="mb-3 rounded-lg bg-ink/5 p-3 text-sm print:hidden">
          {msg}
        </div>
      )}

      <div className="surface mb-4 grid gap-3 p-4 sm:grid-cols-3 print:hidden">
        <input
          className="field"
          placeholder="ຄົ້ນຫາ ຊື່, ນາມສະກຸນ, ບ້ານ"
          value={q.search}
          onChange={(e) => setQ({ ...q, search: e.target.value })}
        />
        <select
          className="field"
          value={q.province}
          onChange={(e) =>
            setQ({ ...q, province: e.target.value, district: "" })
          }
        >
          <option value="">ທຸກແຂວງ</option>
          {PROVINCES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <select
          className="field"
          disabled={!q.province}
          value={q.district}
          onChange={(e) => setQ({ ...q, district: e.target.value })}
        >
          <option value="">ທຸກເມືອງ</option>
          {(GEO[q.province] || []).map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      {data.byProvince.length > 0 && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {data.byProvince.map((p) => (
            <span
              key={p._id}
              className="shrink-0 rounded-full border border-gold/30 bg-white/80 px-3 py-1.5 text-sm shadow-sm"
            >
              {p._id} <b className="ml-1 text-gold">{p.count}</b>
            </span>
          ))}
        </div>
      )}

      {loading ? (
        <p className="py-10 text-center text-ink/60">ກຳລັງໂຫຼດ...</p>
      ) : data.items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line py-12 text-center text-ink/60">
          ຍັງບໍ່ມີຂໍ້ມູນ. ແບ່ງປັນລິ້ງໜ້າລົງທະບຽນໃຫ້ນັກສຶກສາ.
        </p>
      ) : (
        <>
          {/* ຕາຕະລາງ (desktop) */}
          <div className="hidden overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-xl shadow-ink/[.06] md:block">
            <table className="w-full text-left">
              <thead className="bg-ink text-white">
                <tr>
                  {[
                    "ລ/ດ",
                    "ຊື່ ແລະ ນາມສະກຸນ",
                    "ວັນເດືອນປີເກີດ",
                    "ບ້ານ",
                    "ເມືອງ",
                    "ແຂວງ",
                    "",
                  ].map((h) => (
                    <th key={h} className="px-3 py-4 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.items.map((s, i) => (
                  <tr
                    key={s._id}
                    className="border-t border-line/70 transition-colors hover:bg-paper/80"
                  >
                    <td className="px-3 py-3">{i + 1}</td>
                    <td className="px-3 py-3 font-medium">
                      {s.firstName} {s.lastName}
                    </td>
                    <td className="px-3 py-3">{fmtBirth(s)}</td>
                    <td className="px-3 py-3">{s.village}</td>
                    <td className="px-3 py-3">{s.district}</td>
                    <td className="px-3 py-3">{s.province}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right print:hidden">
                      <button
                        onClick={() => setEdit(s)}
                        className="mr-3 text-ink underline"
                      >
                        ແກ້ໄຂ
                      </button>
                      <button
                        onClick={() => del(s)}
                        className="text-seal underline"
                      >
                        ລຶບ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* ບັດ (ມືຖື) */}
          <div className="space-y-3 md:hidden">
            {data.items.map((s) => (
              <div key={s._id} className="surface p-4">
                <div className="font-serif text-lg font-bold">
                  {s.firstName} {s.lastName}
                </div>
                <dl className="mt-2 space-y-1 text-sm text-ink/80">
                  <div>ເກີດ: {fmtBirth(s)}</div>
                  <div>
                    ບ້ານ {s.village}, ເມືອງ {s.district}, ແຂວງ {s.province}
                  </div>
                </dl>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setEdit(s)}
                    className="btn-ghost flex-1 !py-2"
                  >
                    ແກ້ໄຂ
                  </button>
                  <button
                    onClick={() => del(s)}
                    className="btn-ghost flex-1 !py-2 text-seal"
                  >
                    ລຶບ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {addOpen && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center bg-ink/55 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving)
              setAddOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-student-title"
            className="max-h-[94vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl shadow-ink/30 sm:max-w-3xl sm:rounded-3xl sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-line/70 pb-5">
              <div>
                <h2
                  id="add-student-title"
                  className="font-serif text-xl font-bold sm:text-2xl"
                >
                  ເພີ່ມຂໍ້ມູນນັກສຶກສາ
                </h2>
                <p className="mt-1 text-sm text-ink/55">
                  ກອກຂໍ້ມູນລົງທະບຽນໃໝ່ໃຫ້ຄົບຖ້ວນ
                </p>
              </div>
              <button
                type="button"
                aria-label="ປິດແບບຟອມ"
                disabled={saving}
                onClick={() => setAddOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-paper text-xl text-ink/70 transition hover:bg-blue-50 hover:text-ink disabled:opacity-50"
              >
                ×
              </button>
            </div>
            {addError && (
              <div
                role="alert"
                className="mb-4 rounded-xl bg-seal/10 p-3 text-sm text-seal"
              >
                {addError}
              </div>
            )}
            <StudentForm
              onSubmit={addStudent}
              busy={saving}
              submitLabel="ບັນທຶກນັກສຶກສາ"
            />
          </section>
        </div>
      )}

      {adminOpen && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-ink/55 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !adminSaving)
              setAdminOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-admin-title"
            className="w-full rounded-t-3xl bg-white p-5 shadow-2xl shadow-ink/30 sm:max-w-lg sm:rounded-3xl sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-line/70 pb-5">
              <div>
                <h2 id="add-admin-title" className="font-serif text-xl font-bold sm:text-2xl">
                  ເພີ່ມຜູ້ດູແລລະບົບ
                </h2>
                <p className="mt-1 text-sm text-ink/55">
                  ສ້າງບັນຊີໃໝ່ສຳລັບເຂົ້າຈັດການລະບົບ
                </p>
              </div>
              <button
                type="button"
                aria-label="ປິດແບບຟອມຜູ້ດູແລ"
                disabled={adminSaving}
                onClick={() => setAdminOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-paper text-xl text-ink/70 transition hover:bg-blue-50 hover:text-ink disabled:opacity-50"
              >
                ×
              </button>
            </div>
            {adminError && (
              <div role="alert" className="mb-4 rounded-xl bg-seal/10 p-3 text-sm text-seal">
                {adminError}
              </div>
            )}
            <form onSubmit={addAdmin} className="space-y-4">
              <div>
                <label className="label" htmlFor="new-admin-username">ຊື່ຜູ້ໃຊ້</label>
                <input
                  id="new-admin-username"
                  required
                  minLength={3}
                  maxLength={32}
                  autoComplete="username"
                  className="field"
                  placeholder="ຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ"
                  value={adminForm.username}
                  onChange={(event) => setAdminForm({ ...adminForm, username: event.target.value })}
                />
              </div>
              <div>
                <label className="label" htmlFor="new-admin-password">ລະຫັດຜ່ານ</label>
                <input
                  id="new-admin-password"
                  required
                  minLength={8}
                  maxLength={72}
                  type="password"
                  autoComplete="new-password"
                  className="field"
                  placeholder="ຢ່າງໜ້ອຍ 8 ຕົວອັກສອນ"
                  value={adminForm.password}
                  onChange={(event) => setAdminForm({ ...adminForm, password: event.target.value })}
                />
              </div>
              <div>
                <label className="label" htmlFor="new-admin-confirm-password">ຢືນຢັນລະຫັດຜ່ານ</label>
                <input
                  id="new-admin-confirm-password"
                  required
                  minLength={8}
                  maxLength={72}
                  type="password"
                  autoComplete="new-password"
                  className="field"
                  placeholder="ປ້ອນລະຫັດຜ່ານອີກຄັ້ງ"
                  value={adminForm.confirmPassword}
                  onChange={(event) => setAdminForm({ ...adminForm, confirmPassword: event.target.value })}
                />
              </div>
              <button disabled={adminSaving} className="btn-primary w-full !bg-blue-600 hover:!bg-blue-700">
                {adminSaving ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກຜູ້ດູແລ"}
              </button>
            </form>
          </section>
        </div>
      )}

      {edit && (
        <div
          className="fixed inset-0 z-20 flex items-end justify-center bg-ink/50 sm:items-center"
          onClick={() => setEdit(null)}
        >
          <div
            className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 sm:max-w-2xl sm:rounded-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold">ແກ້ໄຂຂໍ້ມູນ</h2>
              <button
                onClick={() => setEdit(null)}
                aria-label="ປິດ"
                className="text-2xl"
              >
                ×
              </button>
            </div>
            <StudentForm
              initial={edit}
              onSubmit={save}
              submitLabel="ບັນທຶກການແກ້ໄຂ"
            />
          </div>
        </div>
      )}
    </main>
  );
}
