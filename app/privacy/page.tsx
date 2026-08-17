import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <article className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.06] p-7 md:p-12">
        <Link href="/" className="text-sm font-bold text-red-300 hover:text-red-200">← Повернутися до магазину</Link>
        <h1 className="mt-8 text-4xl font-black">Політика конфіденційності</h1>
        <div className="mt-8 space-y-6 leading-7 text-white/70">
          <p>Ми використовуємо дані, які ви добровільно вводите під час оформлення замовлення, лише для обробки замовлення, зв’язку з вами та організації отримання товару.</p>
          <section><h2 className="text-xl font-bold text-white">Які дані обробляються</h2><p className="mt-2">Ім’я, прізвище, номер телефону, обрана адреса або відділення доставки, склад замовлення та додаткові примітки.</p></section>
          <section><h2 className="text-xl font-bold text-white">Для чого потрібні дані</h2><p className="mt-2">Для підтвердження замовлення, уточнення наявності, доставки та відповіді на ваші запитання.</p></section>
          <section><h2 className="text-xl font-bold text-white">Передача даних</h2><p className="mt-2">Дані можуть передаватися службі доставки лише в обсязі, необхідному для виконання замовлення. Ми не продаємо персональні дані третім особам.</p></section>
          <section><h2 className="text-xl font-bold text-white">Зв’язок</h2><p className="mt-2">З питаннями щодо даних звертайтеся через форму замовлення на сайті.</p></section>
        </div>
      </article>
    </main>
  );
}
