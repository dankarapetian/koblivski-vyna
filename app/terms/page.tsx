import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <article className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.06] p-7 md:p-12">
        <Link href="/" className="text-sm font-bold text-red-300 hover:text-red-200">← Повернутися до магазину</Link>
        <h1 className="mt-8 text-4xl font-black">Умови замовлення</h1>
        <div className="mt-8 space-y-6 leading-7 text-white/70">
          <section><h2 className="text-xl font-bold text-white">Оформлення</h2><p className="mt-2">Надсилання форми є заявкою на замовлення. Замовлення вважається підтвердженим після нашого зв’язку з покупцем та уточнення наявності й умов отримання.</p></section>
          <section><h2 className="text-xl font-bold text-white">Вік покупця</h2><p className="mt-2">Алкогольні напої продаються лише особам, яким виповнилося 18 років. Вік може перевірятися додатково під час підтвердження та передачі замовлення.</p></section>
          <section><h2 className="text-xl font-bold text-white">Ціна та наявність</h2><p className="mt-2">Актуальна ціна відображається на сайті. Остаточна наявність товару підтверджується під час зв’язку з покупцем.</p></section>
          <section><h2 className="text-xl font-bold text-white">Отримання</h2><p className="mt-2">Спосіб, вартість і строки доставки або самовивозу погоджуються під час підтвердження замовлення.</p></section>
        </div>
      </article>
    </main>
  );
}
