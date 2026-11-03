import { useEffect, useState } from "react";
import api from "../api";
import StudentForm from "../components/StudentForm";

const iconPaths = {
  form: "M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm6 1.5V9h4.5L13 4.5ZM9 12h8v1.5H9V12Zm0 4h8v1.5H9V16Z",
  report:
    "M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm2 13h2v3H6v-3Zm5-5h2v8h-2v-8Zm5-4h2v12h-2V7Z",
  search:
    "M10.5 3a7.5 7.5 0 1 0 4.58 13.44l4.24 4.24 1.42-1.42-4.24-4.24A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z",
};

function Icon({ name, className = "h-6 w-6" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

export default function Landing() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const [err, setErr] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (!formOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && !busy) setFormOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [formOpen, busy]);

  const submit = async (data) => {
    setBusy(true);
    setErr("");
    try {
      await api.post("/students", data);
      setDone(data);
      setFormOpen(false);
      document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" });
    } catch (e) {
      setErr(e.response?.data?.message || "ບໍ່ສາມາດບັນທຶກໄດ້, ກະລຸນາລອງໃໝ່");
    } finally {
      setBusy(false);
    }
  };

  const openForm = () => {
    setErr("");
    setFormOpen(true);
  };

  return (
    <main className="overflow-hidden bg-slate-50 text-slate-800">
      <section
        id="home"
        className="relative flex min-h-[620px] scroll-mt-20 items-center px-4 py-20 text-white sm:px-6 lg:min-h-[690px]"
        style={{
          backgroundColor: "#172554",
          backgroundImage:
            "radial-gradient(circle at 78% 24%, rgba(96,165,250,.32), transparent 28rem), radial-gradient(circle at 92% 88%, rgba(250,204,21,.14), transparent 22rem), radial-gradient(rgba(255,255,255,.09) 1px, transparent 1px), linear-gradient(115deg, #0f172a, #1e3a8a 64%, #1d4ed8)",
          backgroundPosition: "center, center, right 32px top 32px, center",
          backgroundSize: "auto, auto, 28px 28px, auto",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-blue-950/30 to-transparent"
        />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-10">
          <div className="mx-auto max-w-4xl space-y-7 text-center lg:mx-0 lg:max-w-3xl lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/30 bg-blue-500/20 px-4 py-2 text-sm font-medium text-amber-200 shadow-lg backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              ລະບົບລົງທະບຽນອອນລາຍ
            </div>
            <h1 className="font-serif text-3xl font-extrabold leading-relaxed tracking-normal sm:text-5xl lg:text-6xl">
              ລົງທະບຽນຮັບ
              <br className="hidden sm:inline" />
              <br />
              <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent mt-2rem">
                ໃບຢັ້ງຢືນຈົບການສຶກສາ
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-8 text-blue-50/90 sm:text-xl lg:mx-0">
              ລົງທະບຽນຂໍ້ມູນຜູ້ຮຽນຜ່ານລະບົບອອນລາຍ. ຂໍ້ມູນຈະຖືກນຳໄປໃຊ້ໃນການຈັດການ
              ແລະ ກຽມອອກໃບຢັ້ງຢືນ.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row lg:justify-start">
              <a
                href="#enroll"
                className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-4 font-bold text-slate-950 shadow-lg shadow-amber-500/25 transition hover:-translate-y-0.5 hover:from-amber-300 hover:to-amber-400 sm:w-auto"
              >
                ເລີ່ມລົງທະບຽນນັກສຶກສາ <span aria-hidden="true">→</span>
              </a>
              <a
                href="#about"
                className="w-full rounded-xl border border-white/25 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:w-auto"
              >
                ຮູ້ຈັກລະບົບເພີ່ມເຕີມ
              </a>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="hidden shrink-0 rounded-full bg-white/95 p-4 shadow-2xl shadow-slate-950/30 ring-8 ring-white/10 lg:block"
          >
            <img
              src="/education-emblem.png"
              alt=""
              className="h-56 w-56 rounded-full object-contain xl:h-72 xl:w-72"
            />
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-12 bg-slate-50 [clip-path:polygon(0_100%,100%_100%,100%_0)] sm:h-16"
        />
      </section>

      <section
        aria-label="ຈຸດເດັ່ນ"
        className="relative z-10 mx-auto -mt-7 max-w-7xl px-4 sm:px-6 lg:-mt-10"
      >
        <div className="grid gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-900/[.07] sm:grid-cols-3 sm:p-7">
          {[
            {
              icon: "form",
              title: "ລົງທະບຽນອອນລາຍ",
              text: "ປ້ອນຂໍ້ມູນສ່ວນຕົວ ແລະ ທີ່ຢູ່ຜ່ານແບບຟອມດຽວ",
              color: "bg-blue-50 text-blue-600",
            },
            {
              icon: "report",
              title: "ຈັດການຂໍ້ມູນຄົບ",
              text: "ເຈົ້າໜ້າທີ່ສາມາດຄົ້ນຫາ, ແກ້ໄຂ ແລະ ສົ່ງອອກລາຍງານ",
              color: "bg-amber-50 text-amber-600",
            },
            {
              icon: "search",
              title: "ກວດສອບຂໍ້ມູນງ່າຍ",
              text: "ກັ່ນຕອງລາຍຊື່ຕາມແຂວງ ແລະ ເມືອງໄດ້",
              color: "bg-emerald-50 text-emerald-600",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-slate-50 sm:p-4"
            >
              <div
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${item.color}`}
              >
                <Icon name={item.icon} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">{item.title}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="about"
        className="mx-auto grid max-w-7xl scroll-mt-24 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28"
      >
        <div className="relative mx-auto w-full max-w-lg">
          <div className="relative z-10 flex min-h-[350px] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-8 shadow-xl sm:min-h-[430px]">
            <div
              aria-hidden="true"
              className="absolute -left-16 -top-20 h-56 w-56 rounded-full bg-blue-300/30 blur-3xl"
            />
            <img
              src="/education-emblem.png"
              alt="ສັນຍາລັກການສຶກສາ"
              className="relative h-64 w-64 rounded-full object-contain shadow-2xl shadow-blue-900/10 sm:h-80 sm:w-80"
            />
          </div>
          <div className="absolute -bottom-5 -right-3 z-20 max-w-[230px] rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:-right-5">
            <p className="text-sm font-bold text-blue-700">
              ຂໍ້ມູນຖືກຕ້ອງ ການຈັດການວ່ອງໄວ
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              ລະບົບຊ່ວຍຈັດເກັບ ແລະ ຄົ້ນຫາຂໍ້ມູນລົງທະບຽນ
            </p>
          </div>
        </div>
        <div className="space-y-5">
          <span className="inline-block rounded-md bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
            ກ່ຽວກັບລະບົບ
          </span>
          <h2 className="font-serif text-3xl font-bold leading-relaxed text-slate-900 sm:text-4xl">
            ຈັດການຂໍ້ມູນຮັບໃບຢັ້ງຢືນ
            <br className="hidden sm:inline" />{" "}
            <span className="text-blue-600">ໄດ້ຢ່າງມີລະບົບ</span>
          </h2>
          <p className="leading-8 text-slate-600">
            ລະບົບນີ້ຊ່ວຍໃຫ້ຜູ້ຮຽນລົງທະບຽນຂໍ້ມູນທີ່ຈຳເປັນສຳລັບການຮັບໃບຢັ້ງຢືນຈົບການສຶກສາ.
            ຝ່າຍເຈົ້າໜ້າທີ່ສາມາດຈັດການ, ຄົ້ນຫາ, ກັ່ນຕອງ ແລະ
            ສົ່ງອອກລາຍຊື່ເພື່ອນຳໄປໃຊ້ງານ.
          </p>
          <div className="grid gap-4 pt-2 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 font-bold text-blue-600">
                01
              </span>
              <div>
                <h3 className="font-bold text-slate-800">ຂໍ້ມູນຊັດເຈນ</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  ລວມຂໍ້ມູນວັນເກີດ ແລະ ທີ່ຢູ່ໄວ້ບ່ອນດຽວ
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 font-bold text-amber-600">
                02
              </span>
              <div>
                <h3 className="font-bold text-slate-800">ຈັດການສະດວກ</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  ຄົ້ນຫາ ແລະ ສົ່ງອອກຂໍ້ມູນເມື່ອຈຳເປັນ
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="curriculum"
        className="scroll-mt-20 bg-blue-50/70 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center sm:mb-16">
            <span className="inline-block rounded-md bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
              ຄວາມສາມາດຂອງລະບົບ
            </span>
            <h2 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              ທຸກຂັ້ນຕອນ ຄົບຈົບໃນລະບົບດຽວ
            </h2>
            <p className="leading-7 text-slate-600">
              ເຄື່ອງມືສຳຄັນສຳລັບການຮັບລົງທະບຽນ ແລະ ຈັດການລາຍຊື່ຜູ້ຮຽນ
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "form",
                title: "ຟອມລົງທະບຽນຄົບຖ້ວນ",
                text: "ບັນທຶກຊື່, ນາມສະກຸນ, ວັນເກີດ ແລະ ທີ່ຢູ່ຂອງຜູ້ລົງທະບຽນ.",
              },
              {
                icon: "search",
                title: "ຄົ້ນຫາ ແລະ ກັ່ນຕອງ",
                text: "ຄົ້ນຫາຕາມຊື່ ຫຼື ບ້ານ ແລະ ກັ່ນຕອງຕາມແຂວງ, ເມືອງ.",
              },
              {
                icon: "report",
                title: "ລາຍງານ ແລະ ສົ່ງອອກ",
                text: "ເບິ່ງລາຍງານ, ພິມລາຍຊື່ ຫຼື ສົ່ງອອກເປັນ Excel.",
              },
            ].map((item, index) => (
              <article
                key={item.title}
                className={`group rounded-2xl border bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${index === 1 ? "border-blue-300 shadow-blue-900/10" : "border-slate-100"}`}
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-100 text-blue-600 transition group-hover:scale-105">
                  <Icon name={item.icon} className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-serif text-xl font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
                <a
                  href="#enroll"
                  className="mt-6 inline-flex items-center gap-2 border-t border-slate-100 pt-4 text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  ເລີ່ມໃຊ້ງານ <span aria-hidden="true">→</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="activities"
        className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24"
      >
        <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
          <span className="inline-block rounded-md bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
            ຂັ້ນຕອນການລົງທະບຽນ
          </span>
          <h2 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            ເລີ່ມຕົ້ນງ່າຍໆ ພຽງ 3 ຂັ້ນຕອນ
          </h2>
          <p className="leading-7 text-slate-600">
            ກຽມຂໍ້ມູນສ່ວນຕົວໃຫ້ກົງກັບເອກະສານ ແລ້ວດຳເນີນການຕາມຂັ້ນຕອນ
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["01", "ກອກຂໍ້ມູນ", "ປ້ອນຊື່, ວັນເກີດ ແລະ ທີ່ຢູ່ໃຫ້ຄົບຖ້ວນ."],
            [
              "02",
              "ກວດສອບ ແລະ ສົ່ງ",
              "ກວດຄວາມຖືກຕ້ອງຕາມເອກະສານ ກ່ອນກົດບັນທຶກ.",
            ],
            [
              "03",
              "ລໍຖ້າການແຈ້ງຂ່າວ",
              "ເມື່ອໃບຢັ້ງຢືນພ້ອມ ທາງໂຮງຮຽນຈະແຈ້ງໃຫ້ຊາບ.",
            ],
          ].map(([number, title, text]) => (
            <article
              key={number}
              className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <span className="font-serif text-5xl font-extrabold text-blue-100">
                {number}
              </span>
              <h3 className="mt-3 font-serif text-xl font-bold text-slate-900">
                {title}
              </h3>
              <p className="mt-2 leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="enroll" className="scroll-mt-24 px-4 pb-20 sm:px-6 sm:pb-24">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-blue-950/10 lg:grid-cols-12">
          <div className="flex flex-col justify-between bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 p-7 text-white sm:p-10 lg:col-span-5 lg:p-12">
            <div>
              <span className="inline-block rounded-md bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider text-amber-200">
                ເປີດລົງທະບຽນ
              </span>
              <h2 className="mt-5 font-serif text-3xl font-bold leading-relaxed">
                ພ້ອມແລ້ວບໍ?
                <br />
                ເລີ່ມກອກຟອມໄດ້ເລີຍ
              </h2>
              <p className="mt-4 text-sm leading-7 text-blue-100">
                ກະລຸນາກອກຂໍ້ມູນໃຫ້ກົງກັບເອກະສານ. ຂໍ້ມູນຈະຖືກນຳໄປກຽມອອກໃບຢັ້ງຢືນ.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3 border-t border-white/15 pt-5 text-sm text-blue-100">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-amber-300">
                ✓
              </span>
              <span>ກວດຂໍ້ມູນໃຫ້ຄົບກ່ອນສົ່ງແບບຟອມ</span>
            </div>
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:col-span-7 lg:p-14">
            {done ? (
              <div className="text-center">
                <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-3xl text-emerald-700 ring-1 ring-emerald-100">
                  ✓
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">
                  ບັນທຶກສຳເລັດແລ້ວ
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {done.firstName} {done.lastName} ຢູ່ໃນບັນຊີລໍຖ້າຮັບໃບປະກາດ.
                  ເມື່ອໃບຢັ້ງຢືນພ້ອມ, ທາງໂຮງຮຽນຈະແຈ້ງໃຫ້ຊາບ.
                </p>
                <button
                  className="btn-primary mt-6"
                  onClick={() => {
                    setDone(null);
                    openForm();
                  }}
                >
                  ລົງທະບຽນຄົນຕໍ່ໄປ <span aria-hidden="true">→</span>
                </button>
              </div>
            ) : (
              <>
                <span className="text-sm font-semibold text-blue-600">
                  ຂັ້ນຕອນສຸດທ້າຍ
                </span>
                <h3 className="mt-2 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
                  ເລີ່ມລົງທະບຽນຂອງທ່ານ
                </h3>
                <p className="mt-3 max-w-lg leading-7 text-slate-600">
                  ໃຊ້ເວລາພຽງບໍ່ດົນ ໃນການກອກຂໍ້ມູນ. ກະລຸນາກຽມຂໍ້ມູນວັນເກີດ ແລະ
                  ທີ່ຢູ່ປັດຈຸບັນ.
                </p>
                {err && (
                  <div
                    role="alert"
                    className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700"
                  >
                    {err}
                  </div>
                )}
                <button
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:w-auto"
                  onClick={openForm}
                >
                  ເປີດແບບຟອມລົງທະບຽນ <span aria-hidden="true">→</span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-12 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-2">
            <a href="#home" className="flex items-center gap-3">
              <img
                src="/education-emblem.png"
                alt=""
                className="h-11 w-11 rounded-full bg-white object-contain"
              />
              <span className="font-serif font-bold text-white">
                ລະບົບອອກໃບຢັ້ງຢືນການສຶກສາ
              </span>
            </a>
            <p className="max-w-md text-sm leading-7 text-slate-400">
              ລະບົບສຳລັບລົງທະບຽນ ແລະ
              ຈັດການຂໍ້ມູນຜູ້ລໍຖ້າຮັບໃບຢັ້ງຢືນຈົບການສຶກສາ.
            </p>
          </div>
          <div>
            <h3 className="mb-4 border-l-4 border-blue-500 pl-3 font-bold text-white">
              ລິ້ງດ່ວນ
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#home" className="transition hover:text-white">
                  ໜ້າຫຼັກ
                </a>
              </li>
              <li>
                <a href="#about" className="transition hover:text-white">
                  ກ່ຽວກັບລະບົບ
                </a>
              </li>
              <li>
                <a href="#activities" className="transition hover:text-white">
                  ຂັ້ນຕອນ
                </a>
              </li>
              <li>
                <a href="#enroll" className="transition hover:text-white">
                  ລົງທະບຽນ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 border-l-4 border-amber-500 pl-3 font-bold text-white">
              ສຳລັບເຈົ້າໜ້າທີ່
            </h3>
            <p className="mb-4 text-sm leading-6 text-slate-400">
              ເຂົ້າສູ່ລະບົບເພື່ອຈັດການລາຍຊື່ ແລະ ລາຍງານ.
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition hover:text-white"
            >
              ເຂົ້າສູ່ລະບົບ <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-4 pt-6 text-center text-xs text-slate-500 sm:px-6">
          © {new Date().getFullYear()} ລະບົບລົງທະບຽນຮັບໃບຢັ້ງຢືນຈົບການສຶກສາ
        </div>
      </footer>

      {formOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busy)
              setFormOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-form-title"
            className="max-h-[94vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl shadow-slate-950/30 sm:max-w-3xl sm:rounded-3xl sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <h2
                  id="registration-form-title"
                  className="font-serif text-xl font-bold sm:text-2xl"
                >
                  ຂໍ້ມູນຜູ້ລົງທະບຽນ
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  ກະລຸນາກອກຂໍ້ມູນໃຫ້ຄົບຖ້ວນ
                </p>
              </div>
              <button
                type="button"
                aria-label="ປິດແບບຟອມ"
                disabled={busy}
                onClick={() => setFormOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-xl text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
              >
                ×
              </button>
            </div>
            {err && (
              <div
                role="alert"
                className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {err}
              </div>
            )}
            <StudentForm
              onSubmit={submit}
              busy={busy}
              submitLabel="ສົ່ງຂໍ້ມູນລົງທະບຽນ"
            />
          </section>
        </div>
      )}
    </main>
  );
}
