"use client";

import { useEffect, useRef, useState } from "react";

type TurnstileWidgetId = string;

type TurnstileOptions = {
  sitekey: string;
  action: string;
  theme: "dark";
  language: "uk";
  size: "flexible";
  "response-field": false;
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => boolean;
  "unsupported-callback": () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileOptions) => TurnstileWidgetId;
  reset: (widgetId: TurnstileWidgetId) => void;
  remove: (widgetId: TurnstileWidgetId) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type TurnstileProps = {
  action: "checkout" | "contact";
  ready: boolean;
  resetSignal: number;
  onVerify: (token: string) => void;
};

export default function Turnstile({ action, ready, resetSignal, onVerify }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<TurnstileWidgetId | null>(null);
  const onVerifyRef = useRef(onVerify);
  const [siteKey, setSiteKey] = useState<string | null>(null);

  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    const controller = new AbortController();

    void fetch("/api/turnstile/config", {
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: { siteKey?: unknown }) => {
        setSiteKey(typeof data.siteKey === "string" ? data.siteKey.trim() : "");
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setSiteKey("");
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const turnstile = window.turnstile;

    if (!ready || !siteKey || !container || !turnstile) return;

    widgetIdRef.current = turnstile.render(container, {
      sitekey: siteKey,
      action,
      theme: "dark",
      language: "uk",
      size: "flexible",
      "response-field": false,
      callback: (token) => onVerifyRef.current(token),
      "expired-callback": () => onVerifyRef.current(""),
      "error-callback": () => {
        onVerifyRef.current("");
        return true;
      },
      "unsupported-callback": () => onVerifyRef.current(""),
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
      onVerifyRef.current("");
    };
  }, [action, ready, siteKey]);

  useEffect(() => {
    if (resetSignal < 1 || !widgetIdRef.current || !window.turnstile) return;
    onVerifyRef.current("");
    window.turnstile.reset(widgetIdRef.current);
  }, [resetSignal]);

  if (siteKey === null) {
    return <div className="min-h-[65px] w-full animate-pulse rounded-xl bg-white/5" aria-label="Завантаження перевірки Cloudflare" />;
  }

  if (!siteKey) {
    return (
      <p role="alert" className="rounded-2xl border border-red-400/30 bg-red-950/50 px-4 py-3 text-sm text-red-200">
        Перевірка Cloudflare тимчасово недоступна.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-white/60">Перевірка безпеки</p>
      <div ref={containerRef} className="min-h-[65px] w-full overflow-hidden rounded-xl" />
    </div>
  );
}
