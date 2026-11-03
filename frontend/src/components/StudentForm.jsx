import { useEffect, useState } from "react";
import api from "../api";
import { DAYS, MONTHS, YEARS, GEO, PROVINCES } from "../laos";
const empty = {
  firstName: "",
  lastName: "",
  birthDay: "",
  birthMonth: "",
  birthYear: "",
  village: "",
  province: "",
  district: "",
};

const sectionIcons = {
  personal: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0H5Z",
  birthday: "M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V2Zm13 8H4v10h16V10ZM4 6v2h16V6H4Z",
  address:
    "M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z",
};

function SectionIcon({ path }) {
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d={path} />
      </svg>
    </span>
  );
}

export default function StudentForm({
  initial,
  onSubmit,
  submitLabel = "ບັນທຶກຂໍ້ມູນ",
  busy,
}) {
  const [f, setF] = useState(initial || empty);
  const [villageOptions, setVillageOptions] = useState([]);
  const [villageOptionsError, setVillageOptionsError] = useState("");
  useEffect(() => {
    if (!f.province || !f.district) {
      setVillageOptions([]);
      setVillageOptionsError("");
      return undefined;
    }

    const controller = new AbortController();
    setVillageOptions([]);
    setVillageOptionsError("");
    api.get("/students/villages", {
      params: { province: f.province, district: f.district },
      signal: controller.signal,
    }).then(({ data }) => {
      setVillageOptions(data.villages);
    }).catch((error) => {
      if (error.code !== "ERR_CANCELED") {
        setVillageOptionsError("ໂຫຼດລາຍຊື່ບ້ານແນະນຳບໍ່ສຳເລັດ; ຍັງສາມາດພິມຊື່ບ້ານເອງໄດ້");
      }
    });

    return () => controller.abort();
  }, [f.province, f.district]);

  const set = (k) => (e) => {
    const value = e.target.value;
    setF((previous) => ({
      ...previous,
      [k]: value,
      ...(k === "province" ? { district: "", village: "" } : {}),
      ...(k === "district" ? { village: "" } : {}),
    }));
  };
  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...f,
      birthDay: +f.birthDay,
      birthMonth: +f.birthMonth,
      birthYear: +f.birthYear,
    });
  };
  const Sel = ({ k, id, ph, opts, disabled }) => (
    <select
      id={id}
      required
      disabled={disabled}
      className="field"
      value={f[k]}
      onChange={set(k)}
    >
      <option value="">{ph}</option>
      {opts.map((o) => (
        <option key={o.v ?? o} value={o.v ?? o}>
          {o.t ?? o}
        </option>
      ))}
    </select>
  );
  return (
    <form onSubmit={submit} className="space-y-4 sm:space-y-5">
      <p className="text-sm text-slate-500">
        ກະລຸນາກອກຂໍ້ມູນຕາມເອກະສານ. <span className="font-semibold text-blue-600">*</span> ຈຳເປັນຕ້ອງກອກ
      </p>

      <fieldset className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/[.03] transition hover:border-blue-200 sm:p-5">
        <legend className="sr-only">ຂໍ້ມູນສ່ວນຕົວ</legend>
        <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
          <SectionIcon path={sectionIcons.personal} />
          <div><h3 className="font-serif font-bold text-slate-900">ຂໍ້ມູນສ່ວນຕົວ</h3><p className="mt-0.5 text-xs text-slate-500">ຊື່ ແລະ ນາມສະກຸນຕາມເອກະສານ</p></div>
          <span className="ml-auto text-xs font-semibold tracking-wider text-blue-500">01</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="student-first-name">ຊື່ <span className="text-blue-600">*</span></label>
            <input id="student-first-name" required autoComplete="given-name" className="field" value={f.firstName} onChange={set("firstName")} placeholder="ຕົວຢ່າງ: ສົມພອນ" />
          </div>
          <div>
            <label className="label" htmlFor="student-last-name">ນາມສະກຸນ <span className="text-blue-600">*</span></label>
            <input id="student-last-name" required autoComplete="family-name" className="field" value={f.lastName} onChange={set("lastName")} placeholder="ຕົວຢ່າງ: ວົງສາ" />
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/[.03] transition hover:border-blue-200 sm:p-5">
        <legend className="sr-only">ວັນເດືອນປີເກີດ</legend>
        <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
          <SectionIcon path={sectionIcons.birthday} />
          <div><h3 className="font-serif font-bold text-slate-900">ວັນເດືອນປີເກີດ</h3><p className="mt-0.5 text-xs text-slate-500">ເລືອກວັນເດືອນປີເກີດໃຫ້ຄົບ</p></div>
          <span className="ml-auto text-xs font-semibold tracking-wider text-blue-500">02</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="label" htmlFor="student-birth-day">ວັນ <span className="text-blue-600">*</span></label><Sel k="birthDay" id="student-birth-day" ph="ວັນ" opts={DAYS} /></div>
          <div><label className="label" htmlFor="student-birth-month">ເດືອນ <span className="text-blue-600">*</span></label><Sel k="birthMonth" id="student-birth-month" ph="ເດືອນ" opts={MONTHS.map((t, i) => ({ v: i + 1, t }))} /></div>
          <div><label className="label" htmlFor="student-birth-year">ປີ <span className="text-blue-600">*</span></label><Sel k="birthYear" id="student-birth-year" ph="ປີ" opts={YEARS} /></div>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/[.03] transition hover:border-blue-200 sm:p-5">
        <legend className="sr-only">ທີ່ຢູ່ປັດຈຸບັນ</legend>
        <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
          <SectionIcon path={sectionIcons.address} />
          <div><h3 className="font-serif font-bold text-slate-900">ທີ່ຢູ່ປັດຈຸບັນ</h3><p className="mt-0.5 text-xs text-slate-500">ລະບຸບ້ານ, ເມືອງ ແລະ ແຂວງ</p></div>
          <span className="ml-auto text-xs font-semibold tracking-wider text-blue-500">03</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="student-province">ແຂວງ <span className="text-blue-600">*</span></label>
            <Sel k="province" id="student-province" ph="ເລືອກແຂວງ" opts={PROVINCES} />
          </div>
          <div>
            <label className="label" htmlFor="student-district">ເມືອງ <span className="text-blue-600">*</span></label>
            <Sel k="district" id="student-district" ph={f.province ? "ເລືອກເມືອງ" : "ເລືອກແຂວງກ່ອນ"} opts={GEO[f.province] || []} disabled={!f.province} />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="student-village">ບ້ານ <span className="text-blue-600">*</span></label>
            <input id="student-village" required autoComplete="address-level4" list="student-village-options" className="field" value={f.village} onChange={set("village")} placeholder={f.district ? "ເລືອກ ຫຼື ພິມຊື່ບ້ານ" : "ເລືອກແຂວງ ແລະ ເມືອງກ່ອນ"} disabled={!f.district} />
            <datalist id="student-village-options">
              {villageOptions.map((village) => <option key={village} value={village} />)}
            </datalist>
            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              {villageOptionsError || (villageOptions.length ? "ເລືອກຈາກລາຍຊື່ທີ່ເຄີຍບັນທຶກ ຫຼື ພິມຊື່ບ້ານໃໝ່" : f.district ? "ຍັງບໍ່ມີບ້ານແນະນຳໃນເມືອງນີ້; ພິມຊື່ບ້ານໄດ້" : "ເລືອກແຂວງ ແລະ ເມືອງກ່ອນ")}
            </p>
          </div>
        </div>
      </fieldset>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between sm:pt-5">
        <p className="text-xs leading-5 text-slate-500">ກະລຸນາກວດສອບຄວາມຖືກຕ້ອງກ່ອນບັນທຶກ</p>
        <button disabled={busy} className="btn-primary w-full !rounded-xl !bg-blue-600 !py-3.5 !shadow-blue-600/20 hover:!bg-blue-700 sm:w-auto sm:min-w-52">
          {busy ? "ກຳລັງບັນທຶກ..." : submitLabel}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );
}
