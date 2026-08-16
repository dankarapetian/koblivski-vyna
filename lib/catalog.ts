export type CatalogProduct = {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  sort: string;
  description: string;
  image: string;
  price: number;
};

export const catalogProducts: CatalogProduct[] = [
  {
    id: "bile-vyno-classic",
    name: "Біле вино Classic",
    category: "Білі вина",
    categoryId: "weisswein",
    sort: "Classic",
    description: "Свіже, витончене вино для рибних страв, сиру та легких перекусів.",
    image: "/images/bile-vyno.jpg",
    price: 1299,
  },
  {
    id: "bile-vyno-trocken",
    name: "Біле вино Trocken",
    category: "Білі вина",
    categoryId: "weisswein",
    sort: "Trocken",
    description: "Сухе біле вино з яскравою свіжістю та тонким ароматом.",
    image: "/images/bile-vyno.jpg",
    price: 1399,
  },
  {
    id: "bile-vyno-halbtrocken",
    name: "Біле вино Halbtrocken",
    category: "Білі вина",
    categoryId: "weisswein",
    sort: "Halbtrocken",
    description: "М’яке біле вино з легкою фруктовістю та комфортною солодкістю.",
    image: "/images/bile-vyno.jpg",
    price: 1399,
  },
  {
    id: "krasne-vino-classic",
    name: "Червоне вино Classic",
    category: "Червоні вина",
    categoryId: "rotwein",
    sort: "Classic",
    description: "Повне, м’якше та ароматне вино для особливих вечорів.",
    image: "/images/krasne-vino.jpg",
    price: 1399,
  },
  {
    id: "krasne-vino-reserve",
    name: "Червоне вино Reserve",
    category: "Червоні вина",
    categoryId: "rotwein",
    sort: "Reserve",
    description: "Міцне червоне вино з глибоким характером і витонченим фіналом.",
    image: "/images/krasne-vino.jpg",
    price: 1699,
  },
  {
    id: "roze-vino-classic",
    name: "Рожеве вино Classic",
    category: "Рожеві вина",
    categoryId: "rose",
    sort: "Classic",
    description: "Легке, фруктове та сучасне вино для літа та свят.",
    image: "/images/roze-vino.jpg",
    price: 1199,
  },
  {
    id: "igriste-vino-brut",
    name: "Ігристе вино Brut",
    category: "Ігристі вина",
    categoryId: "schaumwein",
    sort: "Brut",
    description: "Ніжна перлівка, свіжість і святковий настрій у кожній келиху.",
    image: "/images/igriste-vino.jpg",
    price: 1499,
  },
  {
    id: "igriste-vino-demisec",
    name: "Ігристе вино Demi-Sec",
    category: "Ігристі вина",
    categoryId: "schaumwein",
    sort: "Demi-Sec",
    description: "Напівсухе ігристе вино з м’якою фруктовістю.",
    image: "/images/igriste-vino.jpg",
    price: 1599,
  },
  {
    id: "chacha-classic",
    name: "Чача Classic",
    category: "Спиртні напої",
    categoryId: "spirituosen",
    sort: "Classic",
    description: "Традиційна спеціальність з яскравим характером і глибоким смаком.",
    image: "/images/chacha.jpg",
    price: 1899,
  },
  {
    id: "konjak-classic",
    name: "Коньяк Classic",
    category: "Спиртні напої",
    categoryId: "spirituosen",
    sort: "Classic",
    description: "Елегантний, теплий і м’який у фіналі напій для особливих моментів.",
    image: "/images/konjak.jpg",
    price: 2499,
  },
  {
    id: "rom-classic",
    name: "Ром Classic",
    category: "Спиртні напої",
    categoryId: "spirituosen",
    sort: "Classic",
    description: "Солодкувата пряність з глибиною і приємним ароматом.",
    image: "/images/rom.jpg",
    price: 2199,
  },
];

export function getCatalogProductById(id: string) {
  return catalogProducts.find((product) => product.id === id) ?? null;
}

export function getCatalogProductsForCategory(categoryId: string) {
  return catalogProducts.filter((product) => product.categoryId === categoryId);
}
