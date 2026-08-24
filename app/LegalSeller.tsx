"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function LegalSeller() {
  const [target, setTarget] = useState<Element | null>(null);

  useEffect(() => {
    const footer = document.querySelector("footer#kontakt");
    if (!footer) return;

    const sections = Array.from(footer.querySelectorAll(":scope > div > div"));
    const importantInfo = sections.find((section) =>
      Array.from(section.querySelectorAll("p")).some(
        (paragraph) => paragraph.textContent?.trim() === "Важлива інформація"
      )
    );

    if (importantInfo) setTarget(importantInfo);
  }, []);

  if (!target) return null;

  return createPortal(
    <div className="mt-4 border-t border-white/10 pt-4 text-xs leading-5 text-white/45">
      <p className="font-bold text-white/75">Ліцензія та продавець</p>
      <div className="mt-2 space-y-1.5">
        <p><span className="text-white/60">Продавець:</span> ФОП КАРАПЕТЯН ІШХАН МЕСРОПОВИЧ</p>
        <p><span className="text-white/60">РНОКПП:</span> 2903102012</p>
        <p><span className="text-white/60">Ліцензія:</span> на право роздрібної торгівлі алкогольними напоями</p>
        <p><span className="text-white/60">Реєстраційний номер:</span> 14030308202501505</p>
        <p><span className="text-white/60">Статус:</span> діє</p>
        <p><span className="text-white/60">Дата початку дії:</span> 14.06.2025</p>
        <p>
          <span className="text-white/60">Місце роздрібної торгівлі:</span> Миколаївська область,
          Миколаївський район, с. Коблеве, вул. Степова, 1
        </p>
        <p>
          <span className="text-white/60">Місцезнаходження ліцензіата:</span> Україна, 57453,
          Миколаївська область, Миколаївський район, Коблівська ТГ, с. Коблеве,
          вул. Набережна, буд. 16
        </p>
        <p>
          <span className="text-white/60">Орган ліцензування:</span> Головне управління ДПС у
          Миколаївській області
        </p>
      </div>

      <div className="mt-3 space-y-1.5 text-white/40">
        <p>Сайт приймає заявки на замовлення. Продаж здійснюється продавцем з ліцензованого місця роздрібної торгівлі.</p>
        <p>Вартість доставки не включена у вартість замовлення та розраховується окремо.</p>
      </div>
    </div>,
    target
  );
}
