"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ageVerifiedAt";
const EXPIRE_MS = 3 * 24 * 60 * 60 * 1000;

function isVerifiedRecently(value: string | null) {
  if (!value) {
    return false;
  }

  const timestamp = Number(value);
  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    return false;
  }

  return Date.now() - timestamp < EXPIRE_MS;
}

export default function AgeGate() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isVerifiedRecently(stored)) return;

    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => setVisible(true), 0);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  function handleYes() {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    document.body.style.overflow = "";
    setVisible(false);
  }

  function handleNo() {
    if (typeof window === "undefined") {
      return;
    }

    window.location.href = "https://www.google.com";
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 px-4 py-8 text-white">
      <div className="max-w-2xl rounded-3xl border border-white/10 bg-black/95 p-8 shadow-2xl shadow-black/50">
        <div className="space-y-6 text-center">
          <p className="text-3xl">🍷</p>
          <h2 className="text-3xl font-black">Вам вже виповнилося 18 років?</h2>
          <p className="max-w-2xl text-base text-white/70">
            Цей сайт містить інформацію про алкогольну продукцію та призначений лише для повнолітніх осіб.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={handleYes}
              className="rounded-full bg-red-700 px-6 py-4 text-sm font-bold transition hover:bg-red-800"
            >
              Так, мені є 18 років
            </button>
            <button
              onClick={handleNo}
              className="rounded-full border border-white/20 bg-white/5 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Ні, мені немає 18 років
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
