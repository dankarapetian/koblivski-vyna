"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Plus, Minus, Trash2, Wine, X, ShieldCheck, Truck, MessageCircle } from "lucide-react";
import { catalogProducts, type CatalogProduct } from "@/lib/catalog";

type Product = CatalogProduct;

type CartItem = Product & {
  qty: number;
};

const products: Product[] = catalogProducts;

const categories = [
  {
    id: "weisswein",
    icon: "🍾",
    name: "Білі вина",
  },
  {
    id: "rotwein",
    icon: "🍷",
    name: "Червоні вина",
  },
  {
    id: "rose",
    icon: "🌹",
    name: "Рожеві вина",
  },
  {
    id: "schaumwein",
    icon: "🥂",
    name: "Ігристі вина",
  },
  {
    id: "spirituosen",
    icon: "🥃",
    name: "Спиртні напої",
  },
];

function formatPrice(cents: number) {
  return `${(cents / 100).toFixed(2).replace(".", ",")} грн`;
}

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("weisswein");
  const [deliveryType, setDeliveryType] = useState<"nova-poshta" | "pickup">("nova-poshta");
  const [customerName, setCustomerName] = useState("");
  const [customerSurname, setCustomerSurname] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [region, setRegion] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [street, setStreet] = useState("");
  const [notes, setNotes] = useState("");

  const visibleProducts = useMemo(() => {
    return products.filter((product) => product.categoryId === activeCategory);
  }, [activeCategory]);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  const itemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function addToCart(product: Product) {
    setCart((oldCart) => {
      const existing = oldCart.find((item) => item.id === product.id);

      if (existing) {
        return oldCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [...oldCart, { ...product, qty: 1 }];
    });

    setCartOpen(true);
  }

  function increaseQty(id: string) {
    setCart((oldCart) =>
      oldCart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  }

  function decreaseQty(id: string) {
    setCart((oldCart) =>
      oldCart.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty - 1) } : item
      )
    );
  }

  function removeFromCart(id: string) {
    setCart((oldCart) => oldCart.filter((item) => item.id !== id));
  }

  async function submitOrder() {
    if (cart.length === 0 || honeypot) {
      return;
    }

    const trimmedName = customerName.trim();
    const trimmedPhone = customerPhone.trim();
    const trimmedAddress =
      deliveryType === "nova-poshta"
        ? [region.trim(), district.trim(), city.trim(), street.trim(), warehouse.trim()].filter(Boolean).join(", ")
        : "Самовивіз";

    if (!trimmedName || !trimmedPhone) {
      window.alert("Будь ласка, вкажіть ім’я та телефон.");
      return;
    }

    if (!trimmedAddress || trimmedAddress === "Самовивіз") {
      if (deliveryType === "nova-poshta") {
        window.alert("Будь ласка, заповніть адресу доставки для Нової Пошти.");
        return;
      }
    }

    if (total <= 0) {
      window.alert("Сума замовлення має бути більшою за нуль.");
      return;
    }

    const deliveryText =
      deliveryType === "nova-poshta"
        ? [
            "Доставка: Нова Пошта",
            region ? `Область: ${region}` : "Область: не вказано",
            district ? `Район: ${district}` : "Район: не вказано",
            city ? `Місто: ${city}` : "Місто: не вказано",
            street ? `Вулиця: ${street}` : "Вулиця: не вказано",
            warehouse ? `Відділення: ${warehouse}` : "Відділення: не вказано",
          ].join("\n")
        : "Доставка: Самовивіз";

    const paymentText = [
      "Оплата: переказ на картку",
      "Реквізити для переказу: уточнимо після оформлення замовлення.",
    ].join("\n");

    const lines = cart.map((item) => `• ${item.name} × ${item.qty} — ${formatPrice(item.price * item.qty)}`);
    const message = [
      "Нове замовлення з сайту Коблівські Вина",
      "",
      `Клієнт: ${customerName || "не вказано"} ${customerSurname || ""}`.trim(),
      `Телефон: ${customerPhone || "не вказано"}`,
      "",
      ...lines,
      "",
      `Загальна сума: ${formatPrice(total)}`,
      "",
      deliveryText,
      paymentText,
      notes ? `\nПримітка: ${notes}` : "",
      "",
      "Будь ласка, зв’яжіться зі мною для підтвердження доставки.",
    ]
      .filter(Boolean)
      .join("\n");

    const payload = {
      message,
      total,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
      })),
      deliveryType,
      ...(customerName.trim() ? { customerName: customerName.trim() } : {}),
      ...(customerSurname.trim() ? { customerSurname: customerSurname.trim() } : {}),
      ...(customerPhone.trim() ? { customerPhone: customerPhone.trim() } : {}),
      ...(deliveryType === "nova-poshta"
        ? {
            ...(region.trim() ? { region: region.trim() } : {}),
            ...(district.trim() ? { district: district.trim() } : {}),
            ...(city.trim() ? { city: city.trim() } : {}),
            ...(street.trim() ? { street: street.trim() } : {}),
            ...(warehouse.trim() ? { warehouse: warehouse.trim() } : {}),
          }
        : {}),
      ...(notes.trim() ? { notes: notes.trim() } : {}),
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        window.alert(data?.error || "Не вдалося надіслати замовлення. Спробуйте ще раз.");
        return;
      }

      if (data?.telegramUrl) {
        window.open(data.telegramUrl, "_blank", "noopener,noreferrer");
        window.alert("Замовлення підготовлено. Відкриваємо Telegram.");
        return;
      }

      window.alert("Замовлення відправлено. Ми зв’яжемося з вами найближчим часом.");
    } catch {
      window.alert("Не вдалося надіслати замовлення. Спробуйте ще раз.");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-900">
              <Wine size={24} />
            </div>

            <div>
              <p className="text-lg font-black tracking-wide md:text-xl">Коблівські Вина</p>
              <p className="text-xs text-white/60">Українські вина та спеціальності</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <button onClick={() => scrollToSection("produkty")} className="hover:text-white">
              Продукти
            </button>
            <button onClick={() => scrollToSection("perevagy")} className="hover:text-white">
              Переваги
            </button>
            <button onClick={() => scrollToSection("kontakt")} className="hover:text-white">
              Контакт
            </button>
          </nav>

          <button
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold text-black hover:bg-red-100"
          >
            <ShoppingCart size={18} />
            Кошик {itemCount > 0 ? `(${itemCount})` : ""}
          </button>
        </div>
      </header>

      <section
        className="relative flex min-h-screen items-center bg-cover bg-center pt-24"
        style={{ backgroundImage: "url('/images/hero-wine.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-6 py-24 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="mb-5 inline-block rounded-full border border-red-400/30 bg-red-900/40 px-4 py-2 text-sm text-red-100">
              Premium винний асортимент
            </p>

            <h1 className="max-w-3xl text-5xl font-black leading-tight md:text-8xl">
              Коблівські Вина
            </h1>

            <p className="mt-6 max-w-xl text-lg text-white/75 md:text-xl">
              Оберіть улюблені напої, додайте їх до кошика і замовте через Telegram без зайвих кроків.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection("produkty")}
                className="rounded-full bg-red-700 px-8 py-4 font-bold hover:bg-red-800"
              >
                Переглянути асортимент
              </button>

              <button
                onClick={() => setCartOpen(true)}
                className="rounded-full border border-white/20 bg-white/10 px-8 py-4 font-bold hover:bg-white/20"
              >
                Відкрити кошик
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="hidden md:block"
          >
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl">
              <div
                className="h-[460px] rounded-3xl bg-cover bg-center"
                style={{ backgroundImage: "url('/images/fon_bile.jpg')" }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section id="perevagy" className="mx-auto grid max-w-7xl gap-5 px-6 py-16 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6">
          <ShieldCheck className="mb-4 text-red-300" />
          <h3 className="text-xl font-bold">Надійний підбір</h3>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Ми допомагаємо обрати вино під ваші уподобання, свято або вечір.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-6">
          <Truck className="mb-4 text-red-300" />
          <h3 className="text-xl font-bold">Швидка комунікація</h3>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Замовлення оформлюється просто: обираєте товари й пишете нам у Telegram.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-6">
          <MessageCircle className="mb-4 text-red-300" />
          <h3 className="text-xl font-bold">Зручне замовлення</h3>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Після натискання на кнопку ваш Telegram відкриється з готовим текстом замовлення.
          </p>
        </div>
      </section>

      <section id="produkty" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-widest text-red-300">Магазин</p>
          <h2 className="mt-3 text-4xl font-black md:text-5xl">Наші категорії</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            Оберіть категорію й дізнайтеся про доступні позиції.
          </p>
        </div>

        <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`group flex flex-col items-center justify-center gap-3 rounded-3xl border p-6 text-center transition ${
                activeCategory === category.id
                  ? "border-red-500 bg-red-700 text-white"
                  : "border-white/10 bg-white/10 text-white/70 hover:border-red-500 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                {category.icon}
              </div>
              <span className="text-sm font-bold">{category.name}</span>
            </button>
          ))}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 220 }}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-xl"
            >
              <div
                className="h-72 bg-cover bg-center"
                style={{ backgroundImage: `url('${product.image}')` }}
              />

              <div className="p-5">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-black/40 px-3 py-1 text-xs text-white/70">
                    {product.category}
                  </span>
                  <span className="rounded-full bg-red-900/60 px-3 py-1 text-xs text-red-100">
                    {product.sort}
                  </span>
                </div>

                <h3 className="text-2xl font-bold">{product.name}</h3>

                <p className="mt-2 min-h-16 text-sm leading-6 text-white/60">
                  {product.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="text-xl font-black">{formatPrice(product.price)}</span>

                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-2 rounded-full bg-red-700 px-5 py-3 font-bold hover:bg-red-800"
                  >
                    <Plus size={16} />
                    Додати
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-950/50 to-black p-8 text-center">
          <p className="text-sm uppercase tracking-widest text-red-300">Замовлення</p>
          <h2 className="mt-3 text-4xl font-black md:text-5xl">Пишіть у Telegram</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            Оберіть товари, натисніть кнопку нижче, і ми одразу отримаємо ваше замовлення у готовому форматі.
          </p>
          <button
            onClick={() => setCartOpen(true)}
            className="mt-8 rounded-full bg-red-700 px-8 py-4 font-bold hover:bg-red-800"
          >
            Відкрити кошик для замовлення
          </button>
        </div>
      </section>

      <footer id="kontakt" className="border-t border-white/10 px-6 py-12 text-center text-sm text-white/50">
        <p className="font-bold text-white">Коблівські Вина</p>
        <p className="mt-2">© 2026 · Контакти · Telegram · Замовлення</p>
      </footer>

      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
            />

            <motion.aside
              initial={{ x: 450 }}
              animate={{ x: 0 }}
              exit={{ x: 450 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-[#110808] p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-black">Кошик</h2>

                <button
                  onClick={() => setCartOpen(false)}
                  className="rounded-full bg-white/10 p-2 hover:bg-white/20"
                >
                  <X />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/10 p-8 text-center">
                  <ShoppingCart className="mx-auto mb-4 text-white/40" />
                  <p className="text-white/60">Ваш кошик поки порожній.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 rounded-3xl bg-white/10 p-4">
                      <div
                        className="h-24 w-24 shrink-0 rounded-2xl bg-cover bg-center"
                        style={{ backgroundImage: `url('${item.image}')` }}
                      />

                      <div className="flex-1">
                        <h3 className="font-bold">{item.name}</h3>

                        <p className="text-sm text-white/50">{formatPrice(item.price)}</p>

                        <p className="text-xs text-white/40">
                          {item.category} · {item.sort}
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() => decreaseQty(item.id)}
                            className="rounded-lg border border-white/20 p-2 hover:bg-white/10"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="w-8 text-center font-bold">{item.qty}</span>

                          <button
                            onClick={() => increaseQty(item.id)}
                            className="rounded-lg border border-white/20 p-2 hover:bg-white/10"
                          >
                            <Plus size={14} />
                          </button>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto rounded-lg p-2 text-red-300 hover:bg-red-950"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5">
                    <div className="flex justify-between text-xl font-black">
                      <span>Разом</span>
                      <span>{formatPrice(total)}</span>
                    </div>

                    <div className="mt-5 space-y-4 rounded-3xl border border-white/10 bg-black/20 p-4">
                      <div className="grid gap-3">
                        <input
                          value={customerName}
                          onChange={(event) => setCustomerName(event.target.value)}
                          placeholder="Ім’я"
                          className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                        />
                        <input
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          value={honeypot}
                          onChange={(event) => setHoneypot(event.target.value)}
                          className="absolute left-[-9999px] h-0 w-0 opacity-0"
                          aria-hidden="true"
                        />
                        <input
                          value={customerSurname}
                          onChange={(event) => setCustomerSurname(event.target.value)}
                          placeholder="Прізвище"
                          className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                        />
                        <input
                          value={customerPhone}
                          onChange={(event) => setCustomerPhone(event.target.value)}
                          placeholder="Телефон"
                          className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                        />
                      </div>

                      <div className="grid gap-3">
                        <label className="text-sm text-white/70">Спосіб доставки</label>
                        <select
                          value={deliveryType}
                          onChange={(event) => setDeliveryType(event.target.value as "nova-poshta" | "pickup")}
                          className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none"
                        >
                          <option value="nova-poshta" className="text-black">Нова Пошта</option>
                          <option value="pickup" className="text-black">Самовивіз</option>
                        </select>
                      </div>

                      {deliveryType === "nova-poshta" && (
                        <div className="grid gap-3">
                          <input
                            value={region}
                            onChange={(event) => setRegion(event.target.value)}
                            placeholder="Область"
                            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                          />

                          <input
                            value={district}
                            onChange={(event) => setDistrict(event.target.value)}
                            placeholder="Район / район міста"
                            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                          />

                          <input
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                            placeholder="Місто"
                            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                          />

                          <input
                            value={street}
                            onChange={(event) => setStreet(event.target.value)}
                            placeholder="Вулиця, номер будинку"
                            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                          />

                          <input
                            value={warehouse}
                            onChange={(event) => setWarehouse(event.target.value)}
                            placeholder="Відділення Нової Пошти"
                            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                          />
                        </div>
                      )}

                      <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4">
                        <p className="text-sm font-semibold text-amber-300">Оплата переказом на картку</p>
                        <p className="mt-1 text-sm text-white/70">
                          Після оформлення замовлення ми надішлемо реквізити для переказу та уточнимо деталі.
                        </p>
                      </div>

                      <textarea
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        placeholder="Додаткові примітки до замовлення"
                        rows={3}
                        className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                      />
                    </div>

                    <button
                      onClick={() => void submitOrder()}
                      className="mt-5 w-full rounded-full bg-red-700 py-4 font-black hover:bg-red-800"
                    >
                      Замовити
                    </button>

                    <p className="mt-3 text-xs text-white/40">
                      Після натискання відкриється Telegram із готовим текстом замовлення та адресою доставки.
                    </p>
                  </div>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
