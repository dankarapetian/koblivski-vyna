import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <article className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.06] p-7 md:p-12">
        <Link href="/" className="text-sm font-bold text-red-300 hover:text-red-200">← Повернутися до магазину</Link>
        <h1 className="mt-8 text-4xl font-black">Політика конфіденційності</h1>
        <div className="mt-8 space-y-6 leading-7 text-white/70">
          <p>Ми використовуємо дані, які ви добровільно вводите під час оформлення заявки або звернення через сайт, лише для обробки заявки, зв’язку з вами та організації отримання товару.</p>
          <section>
            <h2 className="text-xl font-bold text-white">Володілець персональних даних</h2>
            <p className="mt-2">ФІЗИЧНА ОСОБА-ПІДПРИЄМЕЦЬ КАРАПЕТЯН ІШХАН МЕСРОПОВИЧ, РНОКПП 2903102012. Місцезнаходження: Україна, 57453, Миколаївська область, Миколаївський район, Коблівська територіальна громада, с. Коблеве, вул. Набережна, буд. 16.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white">Які дані обробляються</h2>
            <p className="mt-2">Ім’я, прізвище, номер телефону, обрана адреса або відділення доставки, склад заявки на замовлення та додаткові примітки, які ви добровільно надаєте.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white">Для чого потрібні дані</h2>
            <p className="mt-2">Для підтвердження заявки, уточнення наявності, зв’язку з покупцем, організації доставки або самовивозу та відповіді на запитання.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white">Передача даних</h2>
            <p className="mt-2">Дані можуть передаватися службі доставки та іншим особам лише в обсязі, необхідному для виконання підтвердженого замовлення та організації його отримання. Ми не продаємо персональні дані третім особам.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white">Строк зберігання</h2>
            <p className="mt-2">Дані зберігаються протягом часу, необхідного для опрацювання заявки, виконання підтвердженого замовлення та дотримання обов’язків, установлених законодавством.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white">Права користувача</h2>
            <p className="mt-2">Ви можете звернутися з питанням щодо обробки своїх даних, а також просити уточнення або видалення даних у випадках, передбачених законодавством.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white">Зв’язок</h2>
            <p className="mt-2">З питаннями щодо персональних даних звертайтеся через контактну форму на сайті або за номером телефону, зазначеним на головній сторінці.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
