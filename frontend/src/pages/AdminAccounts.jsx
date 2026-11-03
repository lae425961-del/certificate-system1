import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const emptyForm = { username: "", password: "", confirmPassword: "" };

export default function AdminAccounts() {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const { data } = await api.get("/admins");
      setAdmins(data.admins);
    } catch (error) {
      setLoadError(error.response?.data?.message || "ໂຫຼດລາຍງານບໍ່ສຳເລັດ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const openEdit = (admin) => {
    setMessage("");
    setFormError("");
    setForm({ username: admin.username, password: "", confirmPassword: "" });
    setEditing(admin);
  };

  const saveAdmin = async (event) => {
    event.preventDefault();
    setFormError("");
    if (form.password && form.password !== form.confirmPassword) {
      setFormError("ລະຫັດຜ່ານຢືນຢັນບໍ່ກົງກັນ");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/admins/${editing._id}`, {
        username: form.username,
        ...(form.password ? { password: form.password } : {}),
      });
      setEditing(null);
      setMessage("ແກ້ໄຂບັນຊີຜູ້ດູແລສຳເລັດແລ້ວ");
      await loadAdmins();
    } catch (error) {
      setFormError(error.response?.data?.message || "ແກ້ໄຂບັນຊີບໍ່ສຳເລັດ");
    } finally {
      setSaving(false);
    }
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.username.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-9">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold tracking-widest text-blue-600">ADMINISTRATION</span>
          <h1 className="mt-1 font-serif text-2xl font-bold text-slate-900">ລາຍງານຜູ້ດູແລລະບົບ</h1>
          <p className="mt-1 text-sm text-slate-500">ເບິ່ງ ແລະ ແກ້ໄຂບັນຊີຜູ້ດູແລ</p>
        </div>
        <Link to="/admin" className="btn-ghost !rounded-lg !px-3 !py-2">
          <span aria-hidden="true">←</span> ກັບໜ້າລາຍງານ
        </Link>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm text-slate-500">ບັນຊີຜູ້ດູແລທັງໝົດ</p>
            <p className="mt-1 font-serif text-3xl font-bold text-slate-800">{admins.length}</p>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600" aria-hidden="true">♙</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm text-slate-500">ຜົນການຄົ້ນຫາ</p>
            <p className="mt-1 font-serif text-3xl font-bold text-blue-600">{filteredAdmins.length}</p>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-indigo-600" aria-hidden="true">⌕</span>
        </div>
      </div>

      {message && <div role="status" className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}

      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-900">ບັນຊີຜູ້ດູແລ</h2>
            <p className="mt-1 text-xs text-slate-500">ລະຫັດຜ່ານຈະບໍ່ສະແດງໃນລາຍງານ</p>
          </div>
          <input
            type="search"
            className="field sm:max-w-xs"
            aria-label="ຄົ້ນຫາຊື່ຜູ້ດູແລ"
            placeholder="ຄົ້ນຫາຊື່ຜູ້ໃຊ້..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loadError && <div role="alert" className="m-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{loadError}</div>}
        {loading ? (
          <p className="py-12 text-center text-sm text-slate-500">ກຳລັງໂຫຼດລາຍງານ...</p>
        ) : filteredAdmins.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-500">{search ? "ບໍ່ພົບບັນຊີທີ່ຄົ້ນຫາ" : "ຍັງບໍ່ມີບັນຊີຜູ້ດູແລ"}</p>
        ) : (
          <>
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-sm text-slate-600">
                  <tr>
                    <th className="px-5 py-3 font-semibold">ລ/ດ</th>
                    <th className="px-5 py-3 font-semibold">ຊື່ຜູ້ໃຊ້</th>
                    <th className="px-5 py-3 font-semibold">ລະຫັດຜ່ານ</th>
                    <th className="px-5 py-3 text-right font-semibold">ຈັດການ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin, index) => (
                    <tr key={admin._id} className="border-t border-slate-100 transition hover:bg-blue-50/40">
                      <td className="px-5 py-4 text-sm text-slate-500">{index + 1}</td>
                      <td className="px-5 py-4 font-medium text-slate-800">{admin.username}</td>
                      <td className="px-5 py-4 text-sm tracking-widest text-slate-400">••••••••</td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => openEdit(admin)} className="btn-ghost !rounded-lg !px-3 !py-2 text-sm">ແກ້ໄຂ</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="divide-y divide-slate-100 sm:hidden">
              {filteredAdmins.map((admin, index) => (
                <div key={admin._id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">ບັນຊີ #{index + 1}</p>
                    <p className="truncate font-semibold text-slate-800">{admin.username}</p>
                    <p className="text-xs tracking-widest text-slate-400">••••••••</p>
                  </div>
                  <button onClick={() => openEdit(admin)} className="btn-ghost !rounded-lg !px-3 !py-2 text-sm">ແກ້ໄຂ</button>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {editing && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) setEditing(null);
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="edit-admin-title" className="w-full rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 id="edit-admin-title" className="font-serif text-xl font-bold text-slate-900">ແກ້ໄຂຜູ້ດູແລ</h2>
                <p className="mt-1 text-sm text-slate-500">ປ່ຽນຊື່ ຫຼື ກຳນົດລະຫັດຜ່ານໃໝ່</p>
              </div>
              <button type="button" aria-label="ປິດ" disabled={saving} onClick={() => setEditing(null)} className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-xl text-slate-600 hover:bg-blue-50 disabled:opacity-50">×</button>
            </div>
            {formError && <div role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{formError}</div>}
            <form onSubmit={saveAdmin} className="space-y-4">
              <div>
                <label className="label" htmlFor="edit-admin-username">ຊື່ຜູ້ໃຊ້</label>
                <input id="edit-admin-username" required minLength={3} maxLength={32} pattern="\S+" className="field" autoComplete="username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="edit-admin-password">ລະຫັດຜ່ານໃໝ່ <span className="font-normal text-slate-400">(ບໍ່ບັງຄັບ)</span></label>
                <input id="edit-admin-password" minLength={8} maxLength={72} type="password" autoComplete="new-password" className="field" placeholder="ປະໄວ້ວ່າງຖ້າບໍ່ປ່ຽນ" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
              </div>
              {form.password && (
                <div>
                  <label className="label" htmlFor="edit-admin-confirm-password">ຢືນຢັນລະຫັດຜ່ານໃໝ່</label>
                  <input id="edit-admin-confirm-password" required minLength={8} maxLength={72} type="password" autoComplete="new-password" className="field" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} />
                </div>
              )}
              <button disabled={saving} className="btn-primary w-full !bg-blue-600 hover:!bg-blue-700">
                {saving ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກການແກ້ໄຂ"}
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
