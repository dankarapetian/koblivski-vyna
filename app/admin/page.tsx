"use client";

import { useEffect, useState } from "react";

function getPassword() {
  return typeof window !== "undefined" ? window.localStorage.getItem("admin-password") ?? "" : "";
}

function formatOrderTotal(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "—";
  }

  return `${(value / 100).toFixed(2).replace(".", ",")} грн`;
}

function normalizeOrderTotal(order: Record<string, unknown>) {
  const candidate = order.total ?? order.amount ?? order.total_amount ?? order.grand_total;
  const total = typeof candidate === "number" ? candidate : Number(candidate ?? 0);

  return Number.isFinite(total) ? total : 0;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getPassword()) {
      setPassword(getPassword());
      setAuthorized(true);
    }
  }, []);

  async function loadOrders() {
    setLoading(true);
    const response = await fetch(`/api/admin/orders?password=${encodeURIComponent(password)}`);
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      window.alert(data.error || "Не удалось получить заказы");
      return;
    }

    const normalizedOrders = (data.orders || []).map((order: Record<string, unknown>) => ({
      ...order,
      total: normalizeOrderTotal(order),
    }));

    setOrders(normalizedOrders);
  }

  function login() {
    if (!password.trim()) {
      window.alert("Введите пароль");
      return;
    }

    window.localStorage.setItem("admin-password", password);
    setAuthorized(true);
  }

  if (!authorized) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/10 p-8">
          <h1 className="text-2xl font-black">Админка</h1>
          <p className="mt-2 text-sm text-white/70">Введите пароль из переменной окружения ADMIN_PASSWORD</p>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-5 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white"
          />
          <button onClick={login} className="mt-4 w-full rounded-full bg-red-700 px-4 py-3 font-bold">
            Войти
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">Заказы</h1>
            <p className="text-sm text-white/60">Панель администратора</p>
          </div>
          <button
            onClick={loadOrders}
            className="rounded-full bg-red-700 px-4 py-3 font-bold"
          >
            {loading ? "Загрузка..." : "Обновить"}
          </button>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-black/20 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Клиент</th>
                <th className="p-3">Телефон</th>
                <th className="p-3">Сумма</th>
                <th className="p-3">Статус</th>
                <th className="p-3">Создан</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-white/10">
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{[order.customer_name, order.customer_surname].filter(Boolean).join(" ") || "—"}</td>
                  <td className="p-3">{order.customer_phone || "—"}</td>
                  <td className="p-3">{formatOrderTotal(normalizeOrderTotal(order))}</td>
                  <td className="p-3">{order.status || "new"}</td>
                  <td className="p-3">{order.created_at ? new Date(order.created_at).toLocaleString("uk-UA") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
