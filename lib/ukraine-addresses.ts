export type WarehouseCity = {
  id: string;
  name: string;
  warehouses: string[];
};

export type AddressDistrict = {
  id: string;
  name: string;
  cities: WarehouseCity[];
};

export type AddressRegion = {
  id: string;
  name: string;
  districts: AddressDistrict[];
};

const createCity = (id: string, name: string, warehouses: string[]) => ({ id, name, warehouses });

export const ukraineAddressData: AddressRegion[] = [
  {
    id: "vinnytska",
    name: "Вінницька",
    districts: [
      {
        id: "vinnytskyi",
        name: "Вінницький",
        cities: [
          createCity("vinnytsia", "Вінниця", ["Відділення №101", "Відділення №102", "Відділення №103"]),
          createCity("zhmerinka", "Жмеринка", ["Відділення №104", "Відділення №105"]),
          createCity("mohyliv-podilskyi", "Могилів-Подільський", ["Відділення №106", "Відділення №107"]),
          createCity("kozyatyn", "Козятин", ["Відділення №108", "Відділення №109"]),
          createCity("gaisin", "Гайсин", ["Відділення №110", "Відділення №111"]),
        ],
      },
    ],
  },
  {
    id: "volynska",
    name: "Волинська",
    districts: [
      {
        id: "lutskyi",
        name: "Луцький",
        cities: [
          createCity("lutsk", "Луцьк", ["Відділення №201", "Відділення №202", "Відділення №203"]),
          createCity("kovel", "Ковель", ["Відділення №204", "Відділення №205"]),
          createCity("novovolynsk", "Нововолинськ", ["Відділення №206", "Відділення №207"]),
          createCity("rozhysche", "Рожище", ["Відділення №208", "Відділення №209"]),
        ],
      },
    ],
  },
  {
    id: "dnipropetrovska",
    name: "Дніпропетровська",
    districts: [
      {
        id: "dniprovskyi",
        name: "Дніпровський",
        cities: [
          createCity("dnipro", "Дніпро", ["Відділення №301", "Відділення №302", "Відділення №303", "Відділення №304"]),
          createCity("kryvyi-rih", "Кривий Ріг", ["Відділення №305", "Відділення №306", "Відділення №307"]),
          createCity("kamyanske", "Кам’янське", ["Відділення №308", "Відділення №309"]),
          createCity("nikopol", "Нікополь", ["Відділення №310", "Відділення №311"]),
          createCity("marganets", "Марганець", ["Відділення №312", "Відділення №313"]),
        ],
      },
    ],
  },
  {
    id: "donetska",
    name: "Донецька",
    districts: [
      {
        id: "donetskyi",
        name: "Донецький",
        cities: [
          createCity("kramatorsk", "Краматорськ", ["Відділення №401", "Відділення №402", "Відділення №403"]),
          createCity("sloviansk", "Слов’янськ", ["Відділення №404", "Відділення №405"]),
          createCity("mariupol", "Маріуполь", ["Відділення №406", "Відділення №407"]),
          createCity("bakhmut", "Бахмут", ["Відділення №408", "Відділення №409"]),
        ],
      },
    ],
  },
  {
    id: "zhytomyrska",
    name: "Житомирська",
    districts: [
      {
        id: "zhytomyrskyi",
        name: "Житомирський",
        cities: [
          createCity("zhytomyr", "Житомир", ["Відділення №501", "Відділення №502", "Відділення №503"]),
          createCity("berdychiv", "Бердичів", ["Відділення №504", "Відділення №505"]),
          createCity("korosten", "Коростень", ["Відділення №506", "Відділення №507"]),
          createCity("novohrad-volynskyi", "Новоград-Волинський", ["Відділення №508", "Відділення №509"]),
        ],
      },
    ],
  },
  {
    id: "zakarpatska",
    name: "Закарпатська",
    districts: [
      {
        id: "uzhhorodskyi",
        name: "Ужгородський",
        cities: [
          createCity("uzhhorod", "Ужгород", ["Відділення №601", "Відділення №602", "Відділення №603"]),
          createCity("mukachevo", "Мукачево", ["Відділення №604", "Відділення №605"]),
          createCity("khust", "Хуст", ["Відділення №606", "Відділення №607"]),
          createCity("berehove", "Берегове", ["Відділення №608", "Відділення №609"]),
        ],
      },
    ],
  },
  {
    id: "zaporizka",
    name: "Запорізька",
    districts: [
      {
        id: "zaporizkyi",
        name: "Запорізький",
        cities: [
          createCity("zaporizhzhia", "Запоріжжя", ["Відділення №701", "Відділення №702", "Відділення №703", "Відділення №704"]),
          createCity("melitopol", "Мелітополь", ["Відділення №705", "Відділення №706"]),
          createCity("berdyansk", "Бердянськ", ["Відділення №707", "Відділення №708"]),
          createCity("enerhodar", "Енергодар", ["Відділення №709", "Відділення №710"]),
        ],
      },
    ],
  },
  {
    id: "ivano-frankivska",
    name: "Івано-Франківська",
    districts: [
      {
        id: "ivano-frankivskyi",
        name: "Івано-Франківський",
        cities: [
          createCity("ivano-frankivsk", "Івано-Франківськ", ["Відділення №801", "Відділення №802", "Відділення №803"]),
          createCity("kolomyia", "Коломия", ["Відділення №804", "Відділення №805"]),
          createCity("kalush", "Калуш", ["Відділення №806", "Відділення №807"]),
          createCity("nadvirna", "Надвірна", ["Відділення №808", "Відділення №809"]),
        ],
      },
    ],
  },
  {
    id: "kyivska",
    name: "Київська",
    districts: [
      {
        id: "kyivskyi",
        name: "Київський",
        cities: [
          createCity("kyiv", "Київ", ["Відділення №901", "Відділення №902", "Відділення №903", "Відділення №904", "Відділення №905"]),
          createCity("boryspil", "Бориспіль", ["Відділення №906", "Відділення №907"]),
          createCity("brovary", "Бровари", ["Відділення №908", "Відділення №909"]),
          createCity("irpin", "Ірпінь", ["Відділення №910", "Відділення №911"]),
          createCity("bila-tserkva", "Біла Церква", ["Відділення №912", "Відділення №913"]),
        ],
      },
    ],
  },
  {
    id: "kirovohradska",
    name: "Кіровоградська",
    districts: [
      {
        id: "kirovohradskyi",
        name: "Кропивницький",
        cities: [
          createCity("kropyvnytskyi", "Кропивницький", ["Відділення №1001", "Відділення №1002", "Відділення №1003"]),
          createCity("oleksandriia", "Олександрія", ["Відділення №1004", "Відділення №1005"]),
          createCity("svitlovodsk", "Світловодськ", ["Відділення №1006", "Відділення №1007"]),
          createCity("dolynska", "Долинська", ["Відділення №1008", "Відділення №1009"]),
        ],
      },
    ],
  },
  {
    id: "luhanska",
    name: "Луганська",
    districts: [
      {
        id: "luhanskyi",
        name: "Луганський",
        cities: [
          createCity("severodonetsk", "Сєверодонецьк", ["Відділення №1101", "Відділення №1102", "Відділення №1103"]),
          createCity("lysychansk", "Лисичанськ", ["Відділення №1104", "Відділення №1105"]),
          createCity("rubizhne", "Рубіжне", ["Відділення №1106", "Відділення №1107"]),
          createCity("alchevsk", "Алчевськ", ["Відділення №1108", "Відділення №1109"]),
        ],
      },
    ],
  },
  {
    id: "lvivska",
    name: "Львівська",
    districts: [
      {
        id: "lvivskyi",
        name: "Львівський",
        cities: [
          createCity("lviv", "Львів", ["Відділення №1201", "Відділення №1202", "Відділення №1203", "Відділення №1204"]),
          createCity("drogobych", "Дрогобич", ["Відділення №1205", "Відділення №1206"]),
          createCity("stryj", "Стрий", ["Відділення №1207", "Відділення №1208"]),
          createCity("chervonohrad", "Червоноград", ["Відділення №1209", "Відділення №1210"]),
          createCity("truskavets", "Трускавець", ["Відділення №1211", "Відділення №1212"]),
        ],
      },
    ],
  },
  {
    id: "mykolaivska",
    name: "Миколаївська",
    districts: [
      {
        id: "mykolaivskyi",
        name: "Миколаївський",
        cities: [
          createCity("mykolaiv", "Миколаїв", ["Відділення №1301", "Відділення №1302", "Відділення №1303"]),
          createCity("voznesensk", "Вознесенськ", ["Відділення №1304", "Відділення №1305"]),
          createCity("pervomaisk", "Первомайськ", ["Відділення №1306", "Відділення №1307"]),
          createCity("yuzhnoukrainsk", "Южноукраїнськ", ["Відділення №1308", "Відділення №1309"]),
        ],
      },
    ],
  },
  {
    id: "odeska",
    name: "Одеська",
    districts: [
      {
        id: "odeskyi",
        name: "Одеський",
        cities: [
          createCity("odesa", "Одеса", ["Відділення №1401", "Відділення №1402", "Відділення №1403", "Відділення №1404"]),
          createCity("izmail", "Ізмаїл", ["Відділення №1405", "Відділення №1406"]),
          createCity("bilhorod-dnistrovskyi", "Білгород-Дністровський", ["Відділення №1407", "Відділення №1408"]),
          createCity("chornomorsk", "Чорноморськ", ["Відділення №1409", "Відділення №1410"]),
          createCity("kiliya", "Кілія", ["Відділення №1411", "Відділення №1412"]),
        ],
      },
    ],
  },
  {
    id: "poltavska",
    name: "Полтавська",
    districts: [
      {
        id: "poltavskyi",
        name: "Полтавський",
        cities: [
          createCity("poltava", "Полтава", ["Відділення №1501", "Відділення №1502", "Відділення №1503"]),
          createCity("kremenchuk", "Кременчук", ["Відділення №1504", "Відділення №1505"]),
          createCity("lubny", "Лубни", ["Відділення №1506", "Відділення №1507"]),
          createCity("hlobyne", "Глобине", ["Відділення №1508", "Відділення №1509"]),
        ],
      },
    ],
  },
  {
    id: "rivnenska",
    name: "Рівненська",
    districts: [
      {
        id: "rivnenskyi",
        name: "Рівненський",
        cities: [
          createCity("rivne", "Рівне", ["Відділення №1601", "Відділення №1602", "Відділення №1603"]),
          createCity("dubno", "Дубно", ["Відділення №1604", "Відділення №1605"]),
          createCity("ostroh", "Острог", ["Відділення №1606", "Відділення №1607"]),
          createCity("sarny", "Сарни", ["Відділення №1608", "Відділення №1609"]),
        ],
      },
    ],
  },
  {
    id: "sumska",
    name: "Сумська",
    districts: [
      {
        id: "sumskyi",
        name: "Сумський",
        cities: [
          createCity("sumy", "Суми", ["Відділення №1701", "Відділення №1702", "Відділення №1703"]),
          createCity("konotop", "Конотоп", ["Відділення №1704", "Відділення №1705"]),
          createCity("shostka", "Шостка", ["Відділення №1706", "Відділення №1707"]),
          createCity("okhtyrka", "Охтирка", ["Відділення №1708", "Відділення №1709"]),
        ],
      },
    ],
  },
  {
    id: "ternopilska",
    name: "Тернопільська",
    districts: [
      {
        id: "ternopilskyi",
        name: "Тернопільський",
        cities: [
          createCity("ternopil", "Тернопіль", ["Відділення №1801", "Відділення №1802", "Відділення №1803"]),
          createCity("chortkiv", "Чортків", ["Відділення №1804", "Відділення №1805"]),
          createCity("kremenets", "Кременець", ["Відділення №1806", "Відділення №1807"]),
          createCity("buchach", "Бучач", ["Відділення №1808", "Відділення №1809"]),
        ],
      },
    ],
  },
  {
    id: "kharkivska",
    name: "Харківська",
    districts: [
      {
        id: "kharkivskyi",
        name: "Харківський",
        cities: [
          createCity("kharkiv", "Харків", ["Відділення №1901", "Відділення №1902", "Відділення №1903", "Відділення №1904"]),
          createCity("izium", "Ізюм", ["Відділення №1905", "Відділення №1906"]),
          createCity("kupiansk", "Куп’янськ", ["Відділення №1907", "Відділення №1908"]),
          createCity("lozova", "Лозова", ["Відділення №1909", "Відділення №1910"]),
        ],
      },
    ],
  },
  {
    id: "khersonska",
    name: "Херсонська",
    districts: [
      {
        id: "khersonskyi",
        name: "Херсонський",
        cities: [
          createCity("kherson", "Херсон", ["Відділення №2001", "Відділення №2002", "Відділення №2003"]),
          createCity("nova-kakhovka", "Нова Каховка", ["Відділення №2004", "Відділення №2005"]),
          createCity("henichesk", "Генічеськ", ["Відділення №2006", "Відділення №2007"]),
          createCity("skadovsk", "Скадовськ", ["Відділення №2008", "Відділення №2009"]),
        ],
      },
    ],
  },
  {
    id: "khmelnytska",
    name: "Хмельницька",
    districts: [
      {
        id: "khmelnytskyi",
        name: "Хмельницький",
        cities: [
          createCity("khmelnytskyi", "Хмельницький", ["Відділення №2101", "Відділення №2102", "Відділення №2103"]),
          createCity("kamianets-podilskyi", "Кам’янець-Подільський", ["Відділення №2104", "Відділення №2105"]),
          createCity("shepetivka", "Шепетівка", ["Відділення №2106", "Відділення №2107"]),
          createCity("netishyn", "Нетішин", ["Відділення №2108", "Відділення №2109"]),
        ],
      },
    ],
  },
  {
    id: "cherkaska",
    name: "Черкаська",
    districts: [
      {
        id: "cherkaskyi",
        name: "Черкаський",
        cities: [
          createCity("cherkasy", "Черкаси", ["Відділення №2201", "Відділення №2202", "Відділення №2203"]),
          createCity("uman", "Умань", ["Відділення №2204", "Відділення №2205"]),
          createCity("smila", "Сміла", ["Відділення №2206", "Відділення №2207"]),
          createCity("zolotonosha", "Золотоноша", ["Відділення №2208", "Відділення №2209"]),
        ],
      },
    ],
  },
  {
    id: "chernivetska",
    name: "Чернівецька",
    districts: [
      {
        id: "chernivetskyi",
        name: "Чернівецький",
        cities: [
          createCity("chernivtsi", "Чернівці", ["Відділення №2301", "Відділення №2302", "Відділення №2303"]),
          createCity("vyzhnytsia", "Вижниця", ["Відділення №2304", "Відділення №2305"]),
          createCity("kitsman", "Кіцмань", ["Відділення №2306", "Відділення №2307"]),
          createCity("storozhynets", "Сторожинець", ["Відділення №2308", "Відділення №2309"]),
        ],
      },
    ],
  },
  {
    id: "chernihivska",
    name: "Чернігівська",
    districts: [
      {
        id: "chernihivskyi",
        name: "Чернігівський",
        cities: [
          createCity("chernihiv", "Чернігів", ["Відділення №2401", "Відділення №2402", "Відділення №2403"]),
          createCity("nizhyn", "Ніжин", ["Відділення №2404", "Відділення №2405"]),
          createCity("pryluky", "Прилуки", ["Відділення №2406", "Відділення №2407"]),
          createCity("novhorod-siverskyi", "Новгород-Сіверський", ["Відділення №2408", "Відділення №2409"]),
        ],
      },
    ],
  },
];
