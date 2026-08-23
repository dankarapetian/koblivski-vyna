"use client";

import AgeGate from "./AgeGate";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Plus, Minus, Trash2, Wine, X, ShieldCheck, Truck, MessageCircle, ArrowRight, Check, Clock3, PackageCheck, Sparkles, Eye, Phone, MapPin, Search } from "lucide-react";
import { catalogProducts, getCatalogProductById, type CatalogProduct } from "@/lib/catalog";

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
  {
    id: "brandy",
    icon: "🏺",
    name: "Коньяки та бренді",
  },
  {
    id: "vermouth",
    icon: "🍸",
    name: "Вермути та коктейлі",
  },
];

const categoryTints: Record<string, string> = {
  weisswein: "rgba(210, 166, 72, 0.24)",
  rotwein: "rgba(145, 15, 48, 0.42)",
  rose: "rgba(214, 66, 116, 0.32)",
  schaumwein: "rgba(72, 78, 170, 0.34)",
  spirituosen: "rgba(126, 61, 18, 0.34)",
  brandy: "rgba(173, 88, 25, 0.38)",
  vermouth: "rgba(9, 116, 103, 0.34)",
};

function productStageStyle(product: Product) {
  const tint = categoryTints[product.categoryId] ?? "rgba(85, 20, 30, 0.28)";
  return {
    backgroundImage: `linear-gradient(${tint}, ${tint}), url('/images/catalog/stage.webp')`,
    backgroundPosition: "center",
    backgroundSize: "100% 100%",
  };
}

function productForegroundImage(product: Product) {
  if (product.id.startsWith("bile-vyno-")) return "/images/catalog/draft-white.webp";
  if (product.id.startsWith("krasne-vino-")) return "/images/catalog/draft-red.webp";
  if (product.id.startsWith("roze-vino-")) return "/images/catalog/draft-rose.webp";
  return product.image.trim();
}

function productForegroundStyle(product: Product) {
  return {
    backgroundImage: `url('${productForegroundImage(product)}')`,
    backgroundPosition: "center",
    backgroundSize: "auto 74%",
    filter: "drop-shadow(0 10px 12px rgba(0, 0, 0, 0.42))",
  };
}

function productCategoryLabel(product: Product) {
  if (/^(bile|krasne|roze)-vyno-/.test(product.id)) {
    return `${product.category.replace(/ · розливне$/, "")} · розливне · ціна за 1 л`;
  }
  return product.category;
}

function isDraftProduct(product: Product) {
  return product.category.includes("розливне") || /^(bile|krasne|roze)-vyno-/.test(product.id);
}

function formatPrice(cents: number) {
  return `${(cents / 100).toFixed(2).replace(".", ",")} грн`;
}


export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("weisswein");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVariantIds, setSelectedVariantIds] = useState<Record<string, string>>({});
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
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactWebsite, setContactWebsite] = useState("");
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState<"idle" | "success" | "error">("idle");
  const formStartedAt = useRef(0);

  useEffect(() => {
    formStartedAt.current = Date.now();
  }, []);

  

  const visibleProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase("uk-UA");
    return products
      .filter((product) => {
        if (!normalizedQuery) return product.categoryId === activeCategory;
        return [product.name, product.category, product.sort, product.description]
          .join(" ")
          .toLocaleLowerCase("uk-UA")
          .includes(normalizedQuery);
      })
      .sort((first, second) => {
        const draftOrder = Number(isDraftProduct(second)) - Number(isDraftProduct(first));
        return draftOrder || first.price - second.price;
      });
  }, [activeCategory, searchQuery]);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  const itemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  function getProductSelection(product: Product) {
    const variantId = selectedVariantIds[product.id] ?? product.variants?.[0]?.id;
    return variantId ? getCatalogProductById(variantId) ?? product : product;
  }

  function changeProductVariant(productId: string, variantId: string) {
    setSelectedVariantIds((current) => ({ ...current, [productId]: variantId }));
  }

  const selectedProductOption = selectedProduct ? getProductSelection(selectedProduct) : null;

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

  async function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (contactSubmitting || contactWebsite) return;

    const name = contactName.trim();
    const phone = contactPhone.trim();
    const message = contactMessage.trim();
    const phoneDigits = phone.replace(/\D/g, "");

    if (!name || phoneDigits.length < 10 || phoneDigits.length > 15 || message.length < 5) {
      setContactStatus("error");
      return;
    }

    try {
      setContactSubmitting(true);
      setContactStatus("idle");
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          requestId: crypto.randomUUID(),
          startedAt: formStartedAt.current,
          website: contactWebsite,
          name,
          phone,
          message,
        }),
      });

      if (!response.ok) {
        setContactStatus("error");
        return;
      }

      setContactStatus("success");
      setContactName("");
      setContactPhone("");
      setContactMessage("");
      formStartedAt.current = Date.now();
    } catch {
      setContactStatus("error");
    } finally {
      setContactSubmitting(false);
    }
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
            <div className="flex h-11 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fff8ed] p-1.5 shadow-[0_8px_24px_rgba(127,29,29,0.24)]">
              <Image
                src="/images/va-logo.webp"
                alt="Логотип VA"
                width={900}
                height={435}
                className="h-full w-full object-contain"
                priority
              />
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
        className="relative flex min-h-[82svh] items-center bg-cover bg-center pt-24 md:min-h-screen"
        style={{ backgroundImage: "url('/images/hero-wine.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-900/40 px-4 py-2 text-sm text-red-100">
              <Sparkles size={16} /> Добірний винний асортимент
            </p>

            <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl md:text-8xl">
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

      <section id="populyarni" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-red-300">Рекомендуємо почати звідси</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl md:text-5xl">Популярні напої</h2>
            <p className="mt-4 max-w-2xl text-white/60">Добірка різних смаків для вечері, подарунка або особливого вечора.</p>
          </div>
          <button onClick={() => scrollToSection("produkty")} className="flex items-center gap-2 font-bold text-red-300 hover:text-red-200">
            Дивитися весь асортимент <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {popularProducts.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.06 }}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] shadow-xl"
            >
              <button onClick={() => openProduct(product)} className="relative block h-36 w-full overflow-hidden sm:h-64" style={productStageStyle(product)} aria-label={`Детальніше про ${product.name}`}>
                <span className="absolute left-2 top-2 z-10 rounded-full bg-red-700 px-2 py-1 text-[10px] font-bold sm:left-4 sm:top-4 sm:px-3 sm:text-xs">Популярне</span>
                <span className="absolute inset-0 bg-no-repeat transition duration-500 group-hover:scale-105" style={productForegroundStyle(product)} />
              </button>
              <div className="p-3 sm:p-5">
                <p className="line-clamp-2 text-[10px] leading-4 text-red-200 sm:text-xs">{productCategoryLabel(product)} · {product.sort}</p>
                <h3 className="mt-1 line-clamp-2 text-base font-bold leading-tight sm:mt-2 sm:text-xl">{product.name}</h3>
                <div className="mt-3 flex items-center justify-between gap-2 sm:mt-5 sm:gap-3">
                  <span className="text-base font-black sm:text-xl">{formatPrice(product.price)}</span>
                  <button onClick={() => addToCart(getProductSelection(product))} className="rounded-full bg-red-700 p-3 hover:bg-red-800" aria-label={`Додати ${product.name} до кошика`}><Plus size={18} /></button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="perevagy" className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-12 sm:gap-5 sm:px-6 sm:py-16 lg:grid-cols-4">
        <motion.div whileHover={{ y: -5 }} className="rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6">
          <ShieldCheck className="mb-4 text-red-300" />
          <h3 className="text-base font-bold sm:text-xl">Допомога з вибором</h3>
          <p className="mt-2 text-xs leading-5 text-white/60 sm:text-sm sm:leading-6">
            Ми допомагаємо обрати вино під ваші уподобання, свято або вечір.
          </p>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6">
          <Truck className="mb-4 text-red-300" />
          <h3 className="text-base font-bold sm:text-xl">Доставка по Україні</h3>
          <p className="mt-2 text-xs leading-5 text-white/60 sm:text-sm sm:leading-6">
            Оберіть Нову Пошту або погодьте самовивіз під час підтвердження.
          </p>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6">
          <MessageCircle className="mb-4 text-red-300" />
          <h3 className="text-base font-bold sm:text-xl">Без реєстрації</h3>
          <p className="mt-2 text-xs leading-5 text-white/60 sm:text-sm sm:leading-6">
            Замовлення одразу надходить нам, після чого ми зв’язуємося для підтвердження.
          </p>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6">
          <Clock3 className="mb-4 text-red-300" />
          <h3 className="text-base font-bold sm:text-xl">Швидкий зв’язок</h3>
          <p className="mt-2 text-xs leading-5 text-white/60 sm:text-sm sm:leading-6">Уточнимо наявність, деталі отримання та відповімо на запитання.</p>
        </motion.div>
      </section>

      <section id="produkty" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-8 text-center sm:mb-12">
          <p className="text-sm uppercase tracking-widest text-red-300">Магазин</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl md:text-5xl">Наші категорії</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            Оберіть категорію й дізнайтеся про доступні позиції.
          </p>
        </div>

        <div className="mx-auto mb-8 max-w-2xl">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/45" size={21} />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Пошук за назвою або смаком…"
              className="w-full rounded-2xl border border-white/15 bg-white/10 py-4 pl-14 pr-12 outline-none placeholder:text-white/35 focus:border-red-400"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white" aria-label="Очистити пошук">
                <X size={18} />
              </button>
            )}
          </label>
          {searchQuery && <p className="mt-3 text-center text-sm text-white/50">Знайдено позицій: {visibleProducts.length}</p>}
        </div>

        <div className="mb-8 flex snap-x gap-2 overflow-x-auto pb-3 sm:mb-10 sm:grid sm:grid-cols-2 sm:gap-3 sm:overflow-visible sm:pb-0 lg:grid-cols-4 xl:grid-cols-7">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => { setActiveCategory(category.id); setSearchQuery(""); }}
              className={`group flex min-w-[142px] snap-start items-center justify-center gap-2 rounded-2xl border p-3 text-center transition sm:min-w-0 sm:flex-col sm:gap-3 sm:rounded-3xl sm:p-6 ${
                activeCategory === category.id
                  ? "border-red-500 bg-red-700 text-white"
                  : "border-white/10 bg-white/10 text-white/70 hover:border-red-500 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg sm:h-16 sm:w-16 sm:rounded-2xl sm:text-2xl">
                {category.icon}
              </div>
              <span className="text-sm font-bold">{category.name}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => {
            const productSelection = getProductSelection(product);
            return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 220 }}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-xl"
            >
              <button onClick={() => openProduct(product)} className="relative block h-36 w-full overflow-hidden sm:h-52" style={productStageStyle(product)} aria-label={`Детальніше про ${product.name}`}>
              <span
                className="absolute inset-0 bg-no-repeat transition duration-500 group-hover:scale-105"
                style={productForegroundStyle(product)}
              />
              <span className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-2 text-xs font-bold opacity-0 backdrop-blur transition group-hover:opacity-100"><Eye size={14} /> Детальніше</span>
              </button>

              <div className="p-3 sm:p-5">
                <div className="mb-2 hidden flex-wrap gap-2 sm:mb-3 sm:flex">
                  <span className="rounded-full bg-black/40 px-3 py-1 text-xs text-white/70">
                    {productCategoryLabel(product)}
                  </span>
                  <span className="rounded-full bg-red-900/60 px-3 py-1 text-xs text-red-100">
                    {product.sort}
                  </span>
                </div>

                <p className="mb-1 line-clamp-2 text-[10px] leading-4 text-red-200 sm:hidden">
                  {productCategoryLabel(product)} · {product.sort}
                </p>

                <h3 className="line-clamp-2 text-base font-bold leading-tight sm:text-2xl">{product.name}</h3>

                <p className="mt-2 hidden min-h-16 text-sm leading-6 text-white/60 sm:block">
                  {product.description}
                </p>

                {product.variants && product.variants.length > 1 && (
                  <label className="mt-3 block text-xs font-semibold text-white/75 sm:mt-4 sm:text-sm">
                    Оберіть об’єм
                    <select
                      value={selectedVariantIds[product.id] ?? product.variants[0].id}
                      onChange={(event) => changeProductVariant(product.id, event.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/15 bg-[#241010] px-2 py-2 text-xs text-white outline-none focus:border-red-400 sm:mt-2 sm:px-4 sm:py-3 sm:text-base"
                    >
                      {product.variants.map((variant) => (
                        <option key={variant.id} value={variant.id}>{variant.label} — {formatPrice(variant.price)}</option>
                      ))}
                    </select>
                  </label>
                )}

                <button onClick={() => openProduct(product)} className="mt-2 text-xs font-semibold text-red-300 hover:text-red-200 sm:mt-3 sm:text-sm">
                  <span className="sm:hidden">Деталі →</span>
                  <span className="hidden sm:inline">Смак і деталі →</span>
                </button>

                <div className="mt-3 flex items-center justify-between gap-2 sm:mt-5 sm:gap-3">
                  <span className="text-base font-black sm:text-xl">{formatPrice(productSelection.price)}</span>

                  <button
                    onClick={() => addToCart(productSelection)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-700 font-bold hover:bg-red-800 sm:h-auto sm:w-auto sm:gap-2 sm:px-5 sm:py-3"
                  >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Додати</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );})}
        </div>
        {visibleProducts.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
            Нічого не знайдено. Спробуйте іншу назву або очистіть пошук.
          </div>
        )}
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

      <section id="contact-form" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] md:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-gradient-to-br from-red-950 via-[#240b0b] to-black p-8 md:p-12">
            <p className="text-sm uppercase tracking-[0.25em] text-red-300">Зв’язатися з нами</p>
            <h2 className="mt-4 text-4xl font-black">Залишилися запитання?</h2>
            <p className="mt-5 max-w-md leading-7 text-white/65">Заповніть контактну форму або зателефонуйте нам — допоможемо зі смаком, наявністю та отриманням.</p>
            <a href="tel:+380679110368" className="mt-6 flex w-fit items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-lg font-black transition hover:border-red-400/50 hover:bg-white/15">
              <Phone className="text-red-300" size={22} /> +380 (67) 911 03 68
            </a>
            <div className="mt-8 space-y-4 text-sm text-white/70">
              <p className="flex items-center gap-3"><MessageCircle className="text-red-300" size={20} /> Відповідь у зручному форматі</p>
              <p className="flex items-center gap-3"><ShieldCheck className="text-red-300" size={20} /> Дані використовуються лише для відповіді</p>
              <p className="flex items-center gap-3"><Clock3 className="text-red-300" size={20} /> Звернення не загубиться серед замовлень</p>
            </div>
          </div>

          <form onSubmit={submitContact} className="space-y-4 p-8 md:p-12">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold"><span>Ваше ім’я</span><input required value={contactName} onChange={(event) => setContactName(event.target.value)} maxLength={80} autoComplete="name" placeholder="Ім’я" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-normal outline-none placeholder:text-white/35 focus:border-red-500" /></label>
              <label className="grid gap-2 text-sm font-semibold"><span>Номер телефону</span><input required value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} maxLength={30} type="tel" inputMode="tel" autoComplete="tel" placeholder="+380…" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-normal outline-none placeholder:text-white/35 focus:border-red-500" /></label>
            </div>
            <input type="text" tabIndex={-1} autoComplete="off" value={contactWebsite} onChange={(event) => setContactWebsite(event.target.value)} name="contact-website" className="absolute left-[-9999px] h-0 w-0 opacity-0" aria-hidden="true" />
            <label className="grid gap-2 text-sm font-semibold"><span>Ваше повідомлення</span><textarea required value={contactMessage} onChange={(event) => setContactMessage(event.target.value)} minLength={5} maxLength={1000} rows={5} placeholder="Напишіть, чим ми можемо допомогти…" className="resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-normal outline-none placeholder:text-white/35 focus:border-red-500" /></label>
            {contactStatus === "success" && <p role="status" className="rounded-2xl border border-emerald-400/30 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-200">Дякуємо! Повідомлення надіслано. Ми зв’яжемося з вами.</p>}
            {contactStatus === "error" && <p role="alert" className="rounded-2xl border border-red-400/30 bg-red-950/50 px-4 py-3 text-sm text-red-200">Перевірте ім’я, телефон і повідомлення або спробуйте ще раз.</p>}
            <button disabled={contactSubmitting} type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-red-700 px-6 py-4 font-bold hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"><MessageCircle size={19} />{contactSubmitting ? "Надсилаємо…" : "Надіслати повідомлення"}</button>
            <p className="text-xs leading-5 text-white/40">Натискаючи кнопку, ви погоджуєтеся на використання введених даних для відповіді на звернення.</p>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="flex flex-col items-center justify-between gap-7 rounded-[2rem] border border-white/10 bg-gradient-to-r from-[#1f0b0b] via-red-950/60 to-[#1f0b0b] p-8 text-center md:flex-row md:p-10 md:text-left">
          <div className="flex flex-col items-center gap-5 md:flex-row">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-300"><MapPin size={30} /></span>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-300">Ми на Google Maps</p>
              <h2 className="mt-2 text-2xl font-black md:text-3xl">Вже завітали до нас?</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">Поділіться враженнями — ваш відгук допомагає нам ставати кращими та допомагає іншим покупцям зробити вибір.</p>
            </div>
          </div>
          <a href="https://maps.app.goo.gl/rJbxy4c5CobvhEcG9?g_st=ic" target="_blank" rel="noopener noreferrer" className="flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-4 font-bold text-black transition hover:bg-red-100">
            Залишити відгук у Google <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <footer id="kontakt" className="border-t border-white/10 px-6 py-12 text-sm text-white/50">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <div><p className="text-lg font-black text-white">Коблівські Вина</p><p className="mt-3 max-w-sm leading-6">Добірні напої, просте оформлення та особиста допомога з вибором.</p></div>
          <div><p className="font-bold text-white">Покупцям</p><div className="mt-3 flex flex-col gap-2"><button onClick={() => scrollToSection('produkty')} className="w-fit hover:text-white">Асортимент</button><button onClick={() => scrollToSection('yak-zamovyty')} className="w-fit hover:text-white">Як замовити</button><button onClick={() => scrollToSection('contact-form')} className="w-fit hover:text-white">Контактна форма</button><button onClick={() => setCartOpen(true)} className="w-fit hover:text-white">Кошик</button></div></div>
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
        {selectedProduct && selectedProductOption && (
          <>
            <motion.button aria-label="Закрити деталі товару" className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} />
            <motion.div role="dialog" aria-modal="true" initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }} className="fixed left-1/2 top-1/2 z-[71] grid max-h-[88vh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[2rem] border border-white/10 bg-[#160909] shadow-2xl md:grid-cols-2">
              <div className="relative min-h-72 overflow-hidden" style={productStageStyle(selectedProduct)}>
                <span className="absolute inset-0 bg-no-repeat" style={productForegroundStyle(selectedProduct)} />
              </div>
              <div className="relative p-7 md:p-9">
                <button onClick={() => setSelectedProduct(null)} className="absolute right-5 top-5 rounded-full bg-white/10 p-2 hover:bg-white/20" aria-label="Закрити"><X size={20} /></button>
                <p className="pr-10 text-sm text-red-300">{productCategoryLabel(selectedProduct)} · {selectedProduct.sort}</p>
                <h2 className="mt-3 text-3xl font-black">{selectedProduct.name}</h2>
                <p className="mt-5 leading-7 text-white/70">{selectedProduct.description}</p>
                {selectedProduct.variants && selectedProduct.variants.length > 1 && (
                  <label className="mt-6 block text-sm font-semibold text-white/75">
                    Оберіть об’єм
                    <select
                      value={selectedVariantIds[selectedProduct.id] ?? selectedProduct.variants[0].id}
                      onChange={(event) => changeProductVariant(selectedProduct.id, event.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-[#241010] px-4 py-3 text-white outline-none focus:border-red-400"
                    >
                      {selectedProduct.variants.map((variant) => (
                        <option key={variant.id} value={variant.id}>{variant.label} — {formatPrice(variant.price)}</option>
                      ))}
                    </select>
                  </label>
                )}
                <div className="mt-8 flex items-center justify-between gap-4"><span className="text-2xl font-black">{formatPrice(selectedProductOption.price)}</span><button onClick={() => { addToCart(selectedProductOption); setSelectedProduct(null); }} className="flex items-center gap-2 rounded-full bg-red-700 px-5 py-3 font-bold hover:bg-red-800"><Plus size={17} /> Додати</button></div>
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
                        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl"
                        style={productStageStyle(item)}
                      >
                        <span className="absolute inset-0 bg-no-repeat" style={productForegroundStyle(item)} />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold">{item.name}</h3>

                        <p className="text-sm text-white/50">{formatPrice(item.price)}</p>

                        <p className="text-xs text-white/40">
                          {productCategoryLabel(item)} · {item.sort}
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
                    <p className="mt-2 text-sm font-semibold text-amber-300">
                      Ціна вказана без урахування вартості доставки.
                    </p>

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
                          Після оформлення ми зв’яжемося з вами та уточнимо всі деталі. Вартість доставки
                          сплачується окремо та не входить у загальну суму замовлення.
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
