import Link from "next/link";

export default function LegalSeller() {
  return (
    <section className="border-t border-white/10 bg-[#080808] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-300">
              Ліцензія та інформація про продавця
            </p>
            <h2 className="mt-3 text-2xl font-black md:text-3xl">
              ФОП КАРАПЕТЯН ІШХАН МЕСРОПОВИЧ
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/60">
              Продаж алкогольних напоїв здійснюється ФОП КАРАПЕТЯН ІШХАН МЕСРОПОВИЧ
              з ліцензованого місця роздрібної торгівлі. Сайт приймає заявки на
              замовлення; наявність, умови отримання та продаж підтверджуються продавцем.
            </p>
          </div>

          <span className="w-fit rounded-full border border-emerald-400/25 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-200">
            Ліцензія діє
          </span>
        </div>

        <div className="mt-8 grid gap-4 text-sm md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-white/45">РНОКПП</p>
            <p className="mt-2 font-semibold text-white/85">2903102012</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-white/45">Вид ліцензії</p>
            <p className="mt-2 font-semibold leading-6 text-white/85">
              На право роздрібної торгівлі алкогольними напоями
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-white/45">Реєстраційний номер ліцензії</p>
            <p className="mt-2 break-all font-semibold text-white/85">14030308202501505</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-white/45">Дата початку дії</p>
            <p className="mt-2 font-semibold text-white/85">14.06.2025</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5 md:col-span-2">
            <p className="text-white/45">Місце роздрібної торгівлі</p>
            <p className="mt-2 font-semibold leading-6 text-white/85">
              Миколаївська область, Миколаївський район, с. Коблеве, вул. Степова, 1
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5 md:col-span-2">
            <p className="text-white/45">Місцезнаходження ліцензіата</p>
            <p className="mt-2 font-semibold leading-6 text-white/85">
              Україна, 57453, Миколаївська область, Миколаївський район, Коблівська ТГ,
              с. Коблеве, вул. Набережна, буд. 16
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-white/45">Орган ліцензування</p>
            <p className="mt-2 font-semibold leading-6 text-white/85">
              Головне управління ДПС у Миколаївській області
            </p>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 border-t border-white/10 pt-6 text-xs text-white/50">
          <span>Продаж алкогольних напоїв — лише особам 18+</span>
          <span>Вартість доставки не включена у вартість замовлення та розраховується окремо.</span>
          <Link href="/terms" className="font-semibold text-white/70 hover:text-white">
            Умови замовлення
          </Link>
          <Link href="/privacy" className="font-semibold text-white/70 hover:text-white">
            Політика конфіденційності
          </Link>
        </div>
      </div>
    </section>
  );
}
