"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function LicenseMenuPortal() {
  const [target, setTarget] = useState<Element | null>(null);

  useEffect(() => {
    const footerInfo = document.querySelector(
      "footer#kontakt > div:first-child > div:nth-child(3) > div"
    );
    setTarget(footerInfo);
  }, []);

  if (!target) return null;

  return createPortal(
    <>
      <details className="group mt-1 border-t border-white/10 pt-3">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-white/60 transition hover:text-white [&::-webkit-details-marker]:hidden">
          <span>Ліцензія</span>
          <span className="text-base transition-transform duration-200 group-open:rotate-45">+</span>
        </summary>

        <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs leading-5 text-white/50 sm:text-sm sm:leading-6">
          <p><span className="font-semibold text-white/70">Продавець:</span> ФОП КАРАПЕТЯН ІШХАН МЕСРОПОВИЧ</p>
          <p><span className="font-semibold text-white/70">РНОКПП:</span> 2903102012</p>
          <p><span className="font-semibold text-white/70">Ліцензія:</span> на право роздрібної торгівлі алкогольними напоями</p>
          <p><span className="font-semibold text-white/70">Реєстраційний номер:</span> 14030308202501505</p>
          <p><span className="font-semibold text-white/70">Статус:</span> діє</p>
          <p><span className="font-semibold text-white/70">Дата початку дії:</span> 14.06.2025</p>
          <p><span className="font-semibold text-white/70">Місце роздрібної торгівлі:</span> Миколаївська область, Миколаївський район, с. Коблеве, вул. Степова, 1</p>
          <p><span className="font-semibold text-white/70">Місцезнаходження ліцензіата:</span> Україна, 57453, Миколаївська область, Миколаївський район, Коблівська ТГ, с. Коблеве, вул. Набережна, буд. 16</p>
          <p><span className="font-semibold text-white/70">Орган ліцензування:</span> Головне управління ДПС у Миколаївській області</p>
          <p className="border-t border-white/10 pt-3">Сайт приймає заявки на замовлення. Продаж здійснюється продавцем з ліцензованого місця роздрібної торгівлі.</p>
          <p>Вартість доставки не включена у вартість замовлення та розраховується окремо.</p>
        </div>
      </details>

      <details className="group mt-3 border-t border-white/10 pt-3">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-white/60 transition hover:text-white [&::-webkit-details-marker]:hidden">
          <span>Авторські права</span>
          <span className="text-base transition-transform duration-200 group-open:rotate-45">+</span>
        </summary>

        <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs leading-5 text-white/50 sm:text-sm sm:leading-6">
          <p className="font-semibold text-white/75">© 2026 Koblivski Vyna. Усі права захищені.</p>
          <p>
            Код, дизайн, структура, тексти, графічні матеріали, елементи інтерфейсу та інший вміст цього сайту охороняються авторським правом.
          </p>
          <p>
            Копіювання, відтворення, модифікація, поширення, створення дзеркал або похідних версій сайту, а також комерційне використання його матеріалів без попереднього письмового дозволу правовласника заборонені.
          </p>
          <p>
            Репозиторій і програмний код поширюються як пропрієтарні матеріали за принципом All Rights Reserved / UNLICENSED, якщо прямо не зазначено інше для окремих сторонніх компонентів.
          </p>
        </div>
      </details>

      <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-5 text-white/40">
        © 2026 Koblivski Vyna. Усі права захищені. Копіювання матеріалів сайту без письмового дозволу заборонено.
      </p>
    </>,
    target
  );
}
