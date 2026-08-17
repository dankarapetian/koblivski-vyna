"use client";

import AgeGate from "./AgeGate";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Plus, Minus, Trash2, Wine, X, ShieldCheck, Truck, MessageCircle, ArrowRight, Check, Clock3, PackageCheck, Sparkles, Eye } from "lucide-react";
import { catalogProducts, type CatalogProduct } from "@/lib/catalog";

type Product = CatalogProduct;

type CartItem = Product & {
  qty: number;
};

const products: Product[] = catalogProducts;
const popularProductIds = [
  "krasne-vino-alzanska-dolina",
  "bile-vyno-shato-de-win",
  "krasne-vino-izabella",
  "roze-vino-chornomorska-perlyna",
];
const popularProducts = popularProductIds
  .map((id) => products.find((product) => product.id === id))
  .filter((product): product is Product => Boolean(product));

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
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedProductName, setAddedProductName] = useState("");
  const formStartedAt = useRef(0);

  useEffect(() => {
    formStartedAt.current = Date.now();
  }, []);

  

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
          item.id === product.id ? { ...item, qty: Math.min(20, item.qty + 1) } : item
        );
      }

      return [...oldCart, { ...product, qty: 1 }];
    });

    setAddedProductName(product.name);
    window.setTimeout(() => setAddedProductName(""), 2200);
  }

  function openProduct(product: Product) {
    setSelectedProduct(product);
  }

  function increaseQty(id: string) {
    setCart((oldCart) =>
      oldCart.map((item) =>
        item.id === id ? { ...item, qty: Math.min(20, item.qty + 1) } : item
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
    if (cart.length === 0 || honeypot || submitting) {
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

    const phoneDigits = trimmedPhone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      window.alert("Будь ласка, перевірте номер телефону.");
      return;
    }

    if (!privacyAccepted) {
      window.alert("Потрібна згода на обробку даних для оформлення замовлення.");
      return;
    }

    if (!ageConfirmed) {
      window.alert("Підтвердіть, що вам виповнилося 18 років.");
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

    const payload = {
      requestId: crypto.randomUUID(),
      startedAt: formStartedAt.current,
      website: honeypot,
      items: cart.map((item) => ({
        id: item.id,
        qty: item.qty,
      })),
      deliveryType,
      ageConfirmed,
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
      setSubmitting(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "same-origin",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        window.alert(data?.error || "Не вдалося надіслати замовлення. Спробуйте ще раз.");
        return;
      }

      if (data?.telegramUrl) {
        window.open(data.telegramUrl, "_blank", "noopener,noreferrer");
        window.alert("Замовлення підготовлено. Відкриваємо Telegram.");
        setCart([]);
        return;
      }

      window.alert("Замовлення відправлено. Ми зв’яжемося з вами найближчим часом.");
      setCart([]);
      setNotes("");
    } catch {
      window.alert("Не вдалося надіслати замовлення. Спробуйте ще раз.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
  <AgeGate />
    <main className="min-h-screen bg-black text-white">
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-900">
              <Wine size={24} />
            </div>

            <div>
              <p className="text-lg font-black tracking-wide md:text-xl">Коблевські Вина</p>
              <p className="text-xs text-white/60">Українські вина </p>
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
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-900/40 px-4 py-2 text-sm text-red-100">
              <Sparkles size={16} /> Добірний винний асортимент
            </p>

            <h1 className="max-w-3xl text-5xl font-black leading-tight md:text-8xl">
              Коблевські Вина
            </h1>

            <p className="mt-6 max-w-xl text-lg text-white/75 md:text-xl">
              Оберіть улюблений напій та оформіть замовлення з доставкою по Україні без реєстрації.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection("produkty")}
                className="rounded-full bg-red-700 px-8 py-4 font-bold hover:bg-red-800"
              >
                Переглянути асортимент
              </button>

              <button
                onClick={() => scrollToSection("populyarni")}
                className="rounded-full border border-white/20 bg-white/10 px-8 py-4 font-bold hover:bg-white/20"
              >
                Популярні напої
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70">
              {['Натуральний смак', 'Зручне замовлення', 'Швидкий зв’язок'].map((item) => (
                <span key={item} className="flex items-center gap-2"><Check size={16} className="text-red-300" />{item}</span>
              ))}
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

      <section id="populyarni" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-red-300">Рекомендуємо почати звідси</p>
            <h2 className="mt-3 text-4xl font-black md:text-5xl">Популярні напої</h2>
            <p className="mt-4 max-w-2xl text-white/60">Добірка різних смаків для вечері, подарунка або особливого вечора.</p>
          </div>
          <button onClick={() => scrollToSection("produkty")} className="flex items-center gap-2 font-bold text-red-300 hover:text-red-200">
            Дивитися весь асортимент <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popularProducts.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.06 }}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] shadow-xl"
            >
              <button onClick={() => openProduct(product)} className="relative block h-64 w-full overflow-hidden bg-white" aria-label={`Детальніше про ${product.name}`}>
                <span className="absolute left-4 top-4 z-10 rounded-full bg-red-700 px-3 py-1 text-xs font-bold">Популярне</span>
                <span className="block h-full bg-contain bg-center bg-no-repeat transition duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${product.image}')` }} />
              </button>
              <div className="p-5">
                <p className="text-xs text-red-200">{product.category} · {product.sort}</p>
                <h3 className="mt-2 text-xl font-bold">{product.name}</h3>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="text-xl font-black">{formatPrice(product.price)}</span>
                  <button onClick={() => addToCart(product)} className="rounded-full bg-red-700 p-3 hover:bg-red-800" aria-label={`Додати ${product.name} до кошика`}><Plus size={18} /></button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="perevagy" className="mx-auto grid max-w-7xl gap-5 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div whileHover={{ y: -5 }} className="rounded-3xl border border-white/10 bg-white/10 p-6">
          <ShieldCheck className="mb-4 text-red-300" />
          <h3 className="text-xl font-bold">Допомога з вибором</h3>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Ми допомагаємо обрати вино під ваші уподобання, свято або вечір.
          </p>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="rounded-3xl border border-white/10 bg-white/10 p-6">
          <Truck className="mb-4 text-red-300" />
          <h3 className="text-xl font-bold">Доставка по Україні</h3>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Оберіть Нову Пошту або погодьте самовивіз під час підтвердження.
          </p>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="rounded-3xl border border-white/10 bg-white/10 p-6">
          <MessageCircle className="mb-4 text-red-300" />
          <h3 className="text-xl font-bold">Без реєстрації</h3>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Замовлення одразу надходить нам, після чого ми зв’язуємося для підтвердження.
          </p>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="rounded-3xl border border-white/10 bg-white/10 p-6">
          <Clock3 className="mb-4 text-red-300" />
          <h3 className="text-xl font-bold">Швидкий зв’язок</h3>
          <p className="mt-2 text-sm leading-6 text-white/60">Уточнимо наявність, деталі отримання та відповімо на запитання.</p>
        </motion.div>
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
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 220 }}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-xl"
            >
              <button onClick={() => openProduct(product)} className="relative block h-52 w-full overflow-hidden bg-white" aria-label={`Детальніше про ${product.name}`}>
              <span
                className="block h-full bg-contain bg-center bg-no-repeat transition duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${product.image}')` }}
              />
              <span className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-2 text-xs font-bold opacity-0 backdrop-blur transition group-hover:opacity-100"><Eye size={14} /> Детальніше</span>
              </button>

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

                <button onClick={() => openProduct(product)} className="mt-3 text-sm font-semibold text-red-300 hover:text-red-200">Смак і деталі →</button>

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

      <section id="yak-zamovyty" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-red-300">Три прості кроки</p>
          <h2 className="mt-3 text-4xl font-black md:text-5xl">Як оформити замовлення</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { number: '01', icon: Wine, title: 'Оберіть напої', text: 'Перегляньте категорії, смак і опис та додайте бажані позиції до кошика.' },
            { number: '02', icon: ShoppingCart, title: 'Заповніть дані', text: 'Вкажіть контактний номер і зручний спосіб отримання замовлення.' },
            { number: '03', icon: PackageCheck, title: 'Отримайте підтвердження', text: 'Ми отримаємо замовлення та зв’яжемося з вами для уточнення деталей.' },
          ].map((step) => (
            <motion.div key={step.number} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-7">
              <span className="absolute right-6 top-5 text-4xl font-black text-white/10">{step.number}</span>
              <step.icon className="text-red-300" size={28} />
              <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">{step.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] border border-red-500/20 bg-gradient-to-br from-red-950/70 via-[#180909] to-black p-8 text-center md:p-12">
          <p className="text-sm uppercase tracking-widest text-red-300">Готові обрати?</p>
          <h2 className="mt-3 text-3xl font-black md:text-5xl">Ваше замовлення — без зайвих кроків</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/60">Додайте напої до кошика, а ми допоможемо завершити оформлення та відповімо на запитання.</p>
          <button onClick={() => setCartOpen(true)} className="mt-8 rounded-full bg-red-700 px-8 py-4 font-bold hover:bg-red-800">Відкрити кошик</button>
        </div>
      </section>

      <footer id="kontakt" className="border-t border-white/10 px-6 py-12 text-sm text-white/50">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <div><p className="text-lg font-black text-white">Коблівські Вина</p><p className="mt-3 max-w-sm leading-6">Добірні напої, просте оформлення та особиста допомога з вибором.</p></div>
          <div><p className="font-bold text-white">Покупцям</p><div className="mt-3 flex flex-col gap-2"><button onClick={() => scrollToSection('produkty')} className="w-fit hover:text-white">Асортимент</button><button onClick={() => scrollToSection('yak-zamovyty')} className="w-fit hover:text-white">Як замовити</button><button onClick={() => setCartOpen(true)} className="w-fit hover:text-white">Кошик і зв’язок</button></div></div>
          <div><p className="font-bold text-white">Важлива інформація</p><div className="mt-3 flex flex-col gap-2"><a href="/privacy" className="hover:text-white">Політика конфіденційності</a><a href="/terms" className="hover:text-white">Умови замовлення</a><span>Продаж алкогольних напоїв лише особам 18+</span></div></div>
        </div>
        <p className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6">© 2026 Коблівські Вина</p>
      </footer>

      <AnimatePresence>
        {addedProductName && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="fixed left-1/2 top-24 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-950/95 px-5 py-3 text-sm font-bold shadow-2xl backdrop-blur">
            <Check size={18} className="text-emerald-300" /> {addedProductName} додано до кошика
          </motion.div>
        )}
      </AnimatePresence>

      {itemCount > 0 && !cartOpen && (
        <button onClick={() => setCartOpen(true)} className="fixed bottom-4 left-4 right-4 z-40 flex items-center justify-between rounded-2xl bg-red-700 px-5 py-4 font-bold shadow-2xl md:hidden">
          <span className="flex items-center gap-2"><ShoppingCart size={20} /> Кошик · {itemCount}</span><span>{formatPrice(total)}</span>
        </button>
      )}

      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.button aria-label="Закрити деталі товару" className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} />
            <motion.div role="dialog" aria-modal="true" initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }} className="fixed left-1/2 top-1/2 z-[71] grid max-h-[88vh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[2rem] border border-white/10 bg-[#160909] shadow-2xl md:grid-cols-2">
              <div className="min-h-72 bg-white bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url('${selectedProduct.image}')` }} />
              <div className="relative p-7 md:p-9">
                <button onClick={() => setSelectedProduct(null)} className="absolute right-5 top-5 rounded-full bg-white/10 p-2 hover:bg-white/20" aria-label="Закрити"><X size={20} /></button>
                <p className="pr-10 text-sm text-red-300">{selectedProduct.category} · {selectedProduct.sort}</p>
                <h2 className="mt-3 text-3xl font-black">{selectedProduct.name}</h2>
                <p className="mt-5 leading-7 text-white/70">{selectedProduct.description}</p>
                <div className="mt-8 flex items-center justify-between gap-4"><span className="text-2xl font-black">{formatPrice(selectedProduct.price)}</span><button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="flex items-center gap-2 rounded-full bg-red-700 px-5 py-3 font-bold hover:bg-red-800"><Plus size={17} /> Додати</button></div>
                <p className="mt-5 text-xs leading-5 text-white/40">Наявність та деталі отримання уточнюються під час підтвердження замовлення.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                          autoComplete="given-name"
                          maxLength={80}
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
                          name="website"
                        />
                        <input
                          value={customerSurname}
                          onChange={(event) => setCustomerSurname(event.target.value)}
                          placeholder="Прізвище"
                          autoComplete="family-name"
                          maxLength={80}
                          className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                        />
                        <input
                          value={customerPhone}
                          onChange={(event) => setCustomerPhone(event.target.value)}
                          placeholder="Телефон"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          maxLength={30}
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
                            maxLength={100}
                            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                          />

                          <input
                            value={district}
                            onChange={(event) => setDistrict(event.target.value)}
                            placeholder="Район / район міста"
                            maxLength={100}
                            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                          />

                          <input
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                            placeholder="Місто"
                            maxLength={100}
                            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                          />

                          <input
                            value={street}
                            onChange={(event) => setStreet(event.target.value)}
                            placeholder="Вулиця, номер будинку"
                            maxLength={160}
                            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                          />

                          <input
                            value={warehouse}
                            onChange={(event) => setWarehouse(event.target.value)}
                            placeholder="Відділення Нової Пошти"
                            maxLength={120}
                            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                          />
                        </div>
                      )}

                      <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4">
                        <p className="text-sm font-semibold text-amber-300">Підтвердження замовлення</p>
                        <p className="mt-1 text-sm text-white/70">
                          Після оформлення ми зв’яжемося з вами та уточнимо всі деталі.
                        </p>
                      </div>

                      <textarea
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        placeholder="Додаткові примітки до замовлення"
                        rows={3}
                        maxLength={500}
                        className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                      />

                      <label className="flex items-start gap-3 text-xs text-white/60">
                        <input
                          type="checkbox"
                          checked={privacyAccepted}
                          onChange={(event) => setPrivacyAccepted(event.target.checked)}
                          className="mt-0.5"
                        />
                        <span>
                          Погоджуюся на використання введених даних лише для обробки цього замовлення.
                        </span>
                      </label>

                      <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
                        <input
                          type="checkbox"
                          checked={ageConfirmed}
                          onChange={(event) => setAgeConfirmed(event.target.checked)}
                          className="h-5 w-5 shrink-0 accent-red-700"
                        />
                        <span>Підтверджую, що мені виповнилося 18 років</span>
                      </label>
                    </div>

                    <button
                      onClick={() => void submitOrder()}
                      disabled={submitting || !ageConfirmed}
                      className="mt-5 w-full rounded-full bg-red-700 py-4 font-black hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? "Надсилаємо..." : "Замовити"}
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
    </>);
}
