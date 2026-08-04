"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ageVerifiedUntil";
const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

export default function AgeGate() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const verifiedUntil = Number(localStorage.getItem(STORAGE_KEY));

    if (!verifiedUntil || Date.now() >= verifiedUntil) {
      localStorage.removeItem(STORAGE_KEY);
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function confirmAge() {
    const expiresAt = Date.now() + THREE_DAYS;

    localStorage.setItem(STORAGE_KEY, expiresAt.toString());
    setIsVisible(false);
    document.body.style.overflow = "";
  }

  function rejectAge() {
    window.location.href = "https://www.google.com/";
  }

  if (!isVisible) return null;

  return (
    <div className="ageGate">
      <div className="ageGateBox">
        <div className="ageGateLogo">🍷</div>

        <h2>Вам вже виповнилося 18 років?</h2>

        <p>
          Цей сайт містить інформацію про алкогольну продукцію та
          призначений лише для повнолітніх осіб.
        </p>

        <button className="ageYes" onClick={confirmAge}>
          Так, мені вже є 18 років
        </button>

        <button className="ageNo" onClick={rejectAge}>
          Ні, мені ще немає 18 років
        </button>
      </div>
    </div>
  );
}
