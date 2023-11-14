import { useSelector } from "react-redux";

export const ProductCategoriesOptions = () => {
  const language = useSelector((state) => state.storeApp.language);

  let categoriesOptions;
  if (language === "ka") {
    categoriesOptions = categoriesOptionsKa; // Georgian options
  } else if (language === "ru") {
    categoriesOptions = categoriesOptionsRu; // Russian options
  } else {
    categoriesOptions = categoriesOptionsEn; // English or default options
  }

  return categoriesOptions;
};

const categoriesOptionsRu = [
  {
    value: "Hair",
    label: "Волосы",
  },
  {
    value: "Hair - Hair Growth",
    label: "Для роста волос",
  },
  {
    value: "Hair - Hair Coloring",
    label: "Окрашивание волос",
  },
  {
    value: "Hair - Chemical Perm",
    label: "Химическая завивка",
  },
  {
    value: "Hair - Styling",
    label: "Стайлинг",
  },
  {
    value: "Hair - Hair Care",
    label: "Уход за волосами",
  },
  {
    value: "Hair - Shampoos and Conditioners",
    label: "Шампуни и кондиционеры",
  },
  {
    value: "Hair - Styling Tools",
    label: "Техника для укладки",
  },
  {
    value: "Hair - Tinting and Camouflaging Products",
    label: "Оттеночные и камуфлирующие средства",
  },
  {
    value: "Hair - Thermal Protection",
    label: "Термозащита",
  },
  {
    value: "Hair - Brushes and Coloring Tools",
    label: "Кисти и инструменты для окрашивания",
  },
  {
    value: "Hair - Hair Extension Materials",
    label: "Материалы для наращивания волос",
  },
  {
    value: "Hair - Accessories",
    label: "Аксессуары",
  },
  {
    value: "Face Care",
    label: "Лицо уход",
  },
  {
    value: "Face Care - Skin Cleansing",
    label: "Средства для очищения кожи",
  },
  {
    value: "Face Care - Creams and Serums",
    label: "Кремы и сыворотки для лица",
  },
  {
    value: "Face Care - Night Care",
    label: "Ночной уход",
  },
  {
    value: "Face Care - Eye Skin Care",
    label: "Уход для кожи вокруг глаз",
  },
  {
    value: "Face Care - Tanning Products",
    label: "Средства для загара",
  },
  {
    value: "Face Care - Sun Protection",
    label: "Средства для защиты от солнца",
  },
  {
    value: "Face Care - Face Masks",
    label: "Маски для лица",
  },
  {
    value: "Face Care - Scrubs and Peels",
    label: "Скрабы и пилинги",
  },
  {
    value: "Face Care - Problem Skin Care",
    label: "Уход за проблемной кожей",
  },
  {
    value: "Face Care - Anti-Aging Cosmetics",
    label: "Антивозрастная косметика для лица",
  },
  {
    value: "Face Care - Facial Care Devices",
    label: "Приборы для ухода за лицом",
  },
  {
    value: "Face Care - Organic and Natural Cosmetics",
    label: "Органическая и натуральная косметика",
  },
  {
    value: "Face Care - Asian Cosmetics",
    label: "Азиатская косметика",
  },
  {
    value: "Face Care - Professional Face Care",
    label: "Профессиональный уход за лицом",
  },
  {
    value: "Face Care - Lip Skin Care",
    label: "Средства для ухода за кожей губ",
  },
  {
    value: "Body Care",
    label: "Уход за телом",
  },
  {
    value: "Body Care - Shower Products",
    label: "Средства для душа",
  },
  {
    value: "Body Care - Bath Foam, Salt, and Oil",
    label: "Пена, соль и масло для ванны",
  },
  {
    value: "Body Care - Body Scrubs and Peels",
    label: "Скрабы и пилинги для тела",
  },
  {
    value: "Body Care - Weight Loss and Anti-Cellulite Products",
    label: "Средства для похудения и борьбы с целлюлитом",
  },
  {
    value: "Body Care - Deodorants for Women",
    label: "Дезодоранты для женщин",
  },
  {
    value: "Body Care - Soap and Liquid Soap",
    label: "Туалетное и жидкое мыло",
  },
  {
    value: "Body Care - Body Creams and Oils",
    label: "Кремы и масла для тела",
  },
  {
    value: "Body Care - Women's Depilation Products",
    label: "Женские средства для депиляции",
  },
  {
    value: "Body Care - Pre and Post Depilation Care",
    label: "Уход до и после депиляции",
  },
  {
    value: "Body Care - Depilation Accessories",
    label: "Принадлежности для депиляции",
  },
  {
    value: "Body Care - Foot Care Products",
    label: "Средства для кожи ног",
  },
  {
    value: "Body Care - Tanning Products",
    label: "Средства для загара",
  },
  {
    value: "Body Care - Self-Tanning Products",
    label: "Средства для автозагара",
  },
  {
    value: "Body Care - Sun Protection Products",
    label: "Солнцезащитные средства для тела",
  },
  {
    value: "Body Care - Solarium Cosmetics",
    label: "Косметика для солярия",
  },
  {
    value: "Body Care - Body Care Accessories",
    label: "Аксессуары для ухода за телом",
  },
  {
    value: "Hand and Nail Care",
    label: "Для рук и ногтей",
  },
  {
    value: "Hand and Nail Care - Hand Skin Care Products",
    label: "Средства для кожи рук",
  },
  {
    value: "Hand and Nail Care - Nail Tools",
    label: "Инструменты для ногтей",
  },
  {
    value: "Hand and Nail Care - Manicure and Pedicure",
    label: "Для маникюра и педикюра",
  },
  {
    value: "Hand and Nail Care - Manicure and Pedicure Devices",
    label: "Аппараты для маникюра и педикюра",
  },
  {
    value: "Hand and Nail Care - Drying Lamps",
    label: "Лампы для сушки",
  },
  {
    value: "Hand and Nail Care - Scissors, Clippers, and Sets",
    label: "Ножницы, книпсеры и наборы",
  },
  {
    value: "Hand and Nail Care - Manicure and Pedicure Accessories",
    label: "Маникюрные и педикюрные принадлежности",
  },
  {
    value: "Hand and Nail Care - Files",
    label: "Пилки",
  },
  {
    value: "Permanent Makeup and Tattoo",
    label: "Перманентный макияж, тату",
  },
  {
    value: "Permanent Makeup and Tattoo - Tattoo Machines",
    label: "Аппараты для тату и татуажа",
  },
  {
    value: "Permanent Makeup and Tattoo - Needles for PM",
    label: "Иглы, дюзы для ПМ",
  },
  {
    value: "Permanent Makeup and Tattoo - Tattoo Needles",
    label: "Иглы татуировочные",
  },
  {
    value: "Permanent Makeup and Tattoo - Tattoo Cartridges",
    label: "Картриджи тату",
  },
  {
    value: "Permanent Makeup and Tattoo - Tattoo Inks",
    label: "Краски татуировочные",
  },
  {
    value: "Permanent Makeup and Tattoo - Tattoo Pigments",
    label: "Пигменты для татуажа",
  },
  {
    value: "Permanent Makeup and Tattoo - Adapters, Grips, Tattoo Holders",
    label: "Переходники, грипы, тату-держатели",
  },
  {
    value: "Permanent Makeup and Tattoo - Power Supplies, Pedals, Cables",
    label: "Блоки, педали, провода",
  },
  {
    value: "Permanent Makeup and Tattoo - Barrier Protection",
    label: "Барьерная защита",
  },
  {
    value: "Permanent Makeup and Tattoo - Cooling Gels, Care",
    label: "Охлаждающие гели, уход",
  },
  {
    value: "Permanent Makeup and Tattoo - Lamps, Light",
    label: "Лампы, свет",
  },
  {
    value: "Permanent Makeup and Tattoo - Training Materials, Sketch",
    label: "Тренировочный материал, эскиз",
  },
  {
    value: "Permanent Makeup and Tattoo - Containers, Stands",
    label: "Емкости, подставки",
  },
  {
    value: "Permanent Makeup and Tattoo - Consumables",
    label: "Расходные материалы",
  },
  {
    value: "Permanent Makeup and Tattoo - Tattoo and Tattoo Removal",
    label: "Удаление тату и татуажа",
  },
  {
    value: "Permanent Makeup and Tattoo - For Microblading",
    label: "Для микроблейдинга",
  },
  {
    value: "Permanent Makeup and Tattoo - Dermopens, Cartridges",
    label: "Дермапены, картриджи",
  },
  {
    value: "Permanent Makeup and Tattoo - Everything for Brow Artists",
    label: "Все для бровистов",
  },
  {
    value: "Eyelash Extensions",
    label: "Все для наращивания ресниц",
  },
  {
    value: "Eyelash Extensions - Eyelashes",
    label: "Ресницы",
  },
  {
    value: "Eyelash Extensions - Glue",
    label: "Клей",
  },
  {
    value: "Eyelash Extensions - Accessories",
    label: "Аксессуары",
  },
  {
    value: "Cosmetology",
    label: "Косметология",
  },
  {
    value: "Cosmetology - Injection Cosmetology",
    label: "Инъекционная косметология",
  },
  {
    value: "Cosmetology - Injection Cosmetology - Biorevitalizants",
    label: "Биоревитализанты",
  },
  {
    value: "Cosmetology - Injection Cosmetology - Fillers",
    label: "Филлеры",
  },
  {
    value: "Cosmetology - Injection Cosmetology - Mesotherapy",
    label: "Мезотерапия",
  },
  {
    value: "Cosmetology - Injection Cosmetology - Vitamins and Supplements",
    label: "Витамины и БАДы",
  },
  {
    value: "Cosmetology - Injection Cosmetology - Professional Care",
    label: "Профессиональный уход",
  },
  {
    value: "Cosmetology - Consumables",
    label: "Расходные материалы",
  },
  {
    value: "Cosmetology - Consumables - Equipment",
    label: "Оборудование",
  },
  {
    value: "Cosmetology - Consumables - Cosmetology Devices",
    label: "Косметологические аппараты",
  },
  {
    value: "Cosmetology - Consumables - Stone Therapy",
    label: "Для стоунтерапии",
  },
  {
    value: "Cosmetology - Consumables - Medical Centrifuges",
    label: "Центрифуги медицинские",
  },
  {
    value: "Cosmetology - Depilation",
    label: "Депиляция",
  },
  {
    value: "Cosmetology - Depilation - Wax",
    label: "Воск",
  },
  {
    value: "Cosmetology - Depilation - Sugar Paste",
    label: "Сахарная паста",
  },
  {
    value: "Cosmetology - Depilation - Other",
    label: "Прочее",
  },

  { value: "Makeup", label: "Макияж" },
  { value: "Makeup - Makeup Removal", label: "Снятие макияжа" },
  { value: "Makeup - For Face", label: "Для лица" },
  { value: "Makeup - For Face - Foundation", label: "Тональные средства" },
  { value: "Makeup - For Face - Powder", label: "Пудра" },
  {
    value: "Makeup - For Face - Concealers and Correctors",
    label: "Корректоры и консилеры",
  },
  {
    value: "Makeup - For Face - Bases, Primers, Fixatives",
    label: "Базы, праймеры, фиксаторы для макияжа",
  },
  {
    value: "Makeup - For Face - Highlighters and Contouring",
    label: "Хайлайтеры и контуринг",
  },
  {
    value: "Makeup - For Face - Blush and Bronzers",
    label: "Румяна и бронзеры",
  },
  { value: "Makeup - For Eyes", label: "Для глаз" },
  { value: "Makeup - For Eyes - Mascara", label: "Тушь" },
  {
    value: "Makeup - For Eyes - Eye Pencils and Liners",
    label: "Карандаши и подводки для глаз",
  },
  {
    value: "Makeup - For Eyes - Eye and Lash Primers",
    label: "Праймеры для век и ресниц",
  },
  { value: "Makeup - For Eyes - Eye Shadows", label: "Тени" },

  { value: "Makeup - Eyebrows", label: "Для бровей" },
  {
    value: "Makeup - Eyebrows - Brow and Lash Coloring",
    label: "Окрашивание для бровей и ресниц",
  },
  {
    value: "Makeup - Eyebrows - Brow and Lash Lamination",
    label: "Ламинирование бровей и ресниц",
  },
  { value: "Makeup - Eyebrows - Brow Lightening", label: "Осветление бровей" },
  { value: "Makeup - Eyebrows - Brow Makeup", label: "Макияж бровей" },
  {
    value: "Makeup - Eyebrows - Brow and Lash Strengthening and Growth",
    label: "Укрепление и рост бровей и ресниц",
  },
  {
    value: "Makeup - Eyebrows - Brow Waxing",
    label: "Воск для удаления волосков бровей",
  },

  { value: "Makeup - Lips", label: "Для губ" },
  { value: "Makeup - Lips - Lipstick", label: "Помада" },
  { value: "Makeup - Lips - Glosses and Tints", label: "Блески и тинты" },
  { value: "Makeup - Lips - Lip Pencils", label: "Карандаши для губ" },
  { value: "Makeup - Lips - Lip Balms", label: "Бальзамы для губ" },
  { value: "Makeup - Accessories", label: "Аксессуары" },
  {
    value: "Makeup - Accessories - Eyelash Curlers and Combs",
    label: "Зажимы и расчески для ресниц",
  },
  {
    value: "Makeup - Accessories - Cosmetic Mirrors",
    label: "Зеркала косметические",
  },
  {
    value: "Makeup - Accessories - Brushes, Sponges, and Applicators",
    label: "Кисти, спонжи и аппликаторы",
  },
  {
    value: "Makeup - Accessories - Cosmetic Tweezers",
    label: "Пинцеты косметические",
  },
  {
    value: "Makeup - Accessories - Eyelashes and Glue",
    label: "Ресницы и клей",
  },
  { value: "Makeup - Accessories - Sets", label: "Наборы" },
  { value: "Makeup - Accessories - Consumables", label: "Расходные материалы" },

  { value: "Makeup - Perfumery", label: "Парфюмерия" },
  {
    value: "Makeup - Perfumery - Women's Perfume",
    label: "Женская парфюмерия",
  },
  { value: "Makeup - Perfumery - Men's Perfume", label: "Мужская парфюмерия" },
  { value: "Makeup - Perfumery - Unisex Perfume", label: "Унисекс парфюмерия" },
  { value: "Makeup - Perfumery - Niche Perfume", label: "Нишевая парфюмерия" },
  { value: "Makeup - Perfumery - Perfume Sets", label: "Парфюмерные наборы" },
  { value: "Makeup - Perfumery - Essential Oils", label: "Эфирные масла" },
  { value: "Makeup - Perfumery - Aromatherapy", label: "Аромотерапия" },
  { value: "Makeup - Perfumery - Aroma Lamps", label: "Аромолампы" },
  { value: "Makeup - Perfumery - Incense", label: "Благовония" },

  { value: "For Men", label: "Мужчинам" },
  { value: "For Men - Electric Shavers", label: "Электробритвы" },
  { value: "For Men - Razors and Blades", label: "Бритвы и лезвия" },
  { value: "For Men - Shaving Products", label: "Средства для бритья" },
  {
    value: "For Men - Beard and Mustache Care",
    label: "Уход для бороды и усов",
  },
  {
    value: "For Men - Beard and Mustache Accessories",
    label: "Аксессуары для бороды и усов",
  },
  { value: "Equipment", label: "Техника" },
  { value: "Equipment - Oral Care", label: "Уход за полостью рта" },
  {
    value: "Equipment - Electric Toothbrushes",
    label: "Электрические зубные щетки",
  },
  { value: "Equipment - Irrigators", label: "Ирригаторы" },
  {
    value: "Equipment - Accessories for Electric Toothbrushes and Irrigators",
    label: "Аксессуары для электрических зубных щеток и ирригаторов",
  },

  { value: "Equipment - Floor Scales", label: "Напольные весы" },
  { value: "Equipment - Electric Shavers", label: "Электробритвы" },
  { value: "Equipment - Epilators", label: "Эпиляторы" },
  {
    value: "Equipment - Accessories for Electric Shavers and Epilators",
    label: "Аксессуары для электробритв и эпиляторов",
  },
  {
    value: "Equipment - Electric Facial Brushes",
    label: "Электрические щетки для лица",
  },
  {
    value: "Equipment - Facial Care Devices",
    label: "Приборы для ухода за лицом",
  },
  {
    value: "Equipment - Body Care Devices",
    label: "Приборы для ухода за телом",
  },
  {
    value: "Equipment - Wax Melters and Paraffin Baths",
    label: "Воскоплавы и парафиновые ванны",
  },
  { value: "Tools and Accessories", label: "Инструменты и аксессуары" },
  {
    value: "Tools and Accessories - Cosmetic Mirrors",
    label: "Зеркала косметические",
  },
  {
    value: "Tools and Accessories - Brushes and Sponges for Makeup",
    label: "Кисти, спонжи для макияжа",
  },
  { value: "Tools and Accessories - Face Rollers", label: "Роллеры для лица" },
  { value: "Tools and Accessories - Body Rollers", label: "Роллеры для тела" },
  { value: "Tools and Accessories - Magnifying Lamps", label: "Лампы-лупы" },
  {
    value: "Tools and Accessories - Eyelashes and Glue",
    label: "Ресницы и клей",
  },
  { value: "For Hairdressers", label: "Для парикмахеров" },
  {
    value: "For Hairdressers - Combs and Hair Accessories",
    label: "Расчески и аксессуары для волос",
  },
  { value: "For Hairdressers - Combs and Brushes", label: "Расчески и щетки" },
  {
    value: "For Hairdressers - Hair Ties, Headbands, Wraps",
    label: "Резинки, ободки, повязки",
  },
  { value: "For Hairdressers - Hair Clips", label: "Заколки" },
  {
    value: "For Hairdressers - Wigs and Hairpieces",
    label: "Парики и шиньоны",
  },
  { value: "For Hairdressers - Rollers", label: "Бигуди" },
  {
    value: "For Hairdressers - Hair Dryers and Brushes",
    label: "Фены и фен-щетки",
  },
  { value: "For Hairdressers - Hair Clippers", label: "Машинки для стрижки" },
  {
    value: "For Hairdressers - Curling Irons and Straighteners",
    label: "Щипцы, плойки и выпрямители",
  },

  {
    value: "For Cosmetologists and Masseurs",
    label: "Для косметологов и массажистов",
  },
  {
    value: "For Cosmetologists and Masseurs - Cosmetic Tweezers",
    label: "Пинцеты косметические",
  },
  { value: "For Cosmetologists and Masseurs - Rollers", label: "Бигуди" },
  {
    value:
      "For Cosmetologists and Masseurs - Brushes and Accessories for Hair Coloring",
    label: "Кисти и аксессуары для окрашивания волос",
  },
  {
    value: "For Cosmetologists and Masseurs - Makeup Trifles",
    label: "Мелочи для макияжа",
  },
  {
    value: "For Cosmetologists and Masseurs - Eyelash Curlers and Combs",
    label: "Зажимы и расчески для ресниц",
  },
];

const categoriesOptionsEn = [
  {
    value: "Hair",
    label: "Hair",
  },
  {
    value: "Hair - Hair Growth",
    label: "Hair Growth",
  },
  {
    value: "Hair - Hair Coloring",
    label: "Hair Coloring",
  },
  {
    value: "Hair - Chemical Perm",
    label: "Chemical Perm",
  },
  {
    value: "Hair - Styling",
    label: "Styling",
  },
  {
    value: "Hair - Hair Care",
    label: "Hair Care",
  },
  {
    value: "Hair - Shampoos and Conditioners",
    label: "Shampoos and Conditioners",
  },
  {
    value: "Hair - Styling Tools",
    label: "Styling Tools",
  },
  {
    value: "Hair - Tinting and Camouflaging Products",
    label: "Tinting and Camouflaging Products",
  },
  {
    value: "Hair - Thermal Protection",
    label: "Thermal Protection",
  },
  {
    value: "Hair - Brushes and Coloring Tools",
    label: "Brushes and Coloring Tools",
  },
  {
    value: "Hair - Hair Extension Materials",
    label: "Hair Extension Materials",
  },
  {
    value: "Hair - Accessories",
    label: "Accessories",
  },
  {
    value: "Face Care",
    label: "Face Care",
  },
  {
    value: "Face Care - Skin Cleansing",
    label: "Skin Cleansing Products",
  },
  {
    value: "Face Care - Creams and Serums",
    label: "Creams and Serums",
  },
  {
    value: "Face Care - Night Care",
    label: "Night Care",
  },
  {
    value: "Face Care - Eye Skin Care",
    label: "Eye Skin Care",
  },
  {
    value: "Face Care - Tanning Products",
    label: "Tanning Products",
  },
  {
    value: "Face Care - Sun Protection",
    label: "Sun Protection",
  },
  {
    value: "Face Care - Face Masks",
    label: "Face Masks",
  },
  {
    value: "Face Care - Scrubs and Peels",
    label: "Scrubs and Peels",
  },
  {
    value: "Face Care - Problem Skin Care",
    label: "Problem Skin Care",
  },
  {
    value: "Face Care - Anti-Aging Cosmetics",
    label: "Anti-Aging Cosmetics",
  },
  {
    value: "Face Care - Facial Care Devices",
    label: "Facial Care Devices",
  },
  {
    value: "Face Care - Organic and Natural Cosmetics",
    label: "Organic and Natural Cosmetics",
  },
  {
    value: "Face Care - Asian Cosmetics",
    label: "Asian Cosmetics",
  },
  {
    value: "Face Care - Professional Face Care",
    label: "Professional Face Care",
  },
  {
    value: "Face Care - Lip Skin Care",
    label: "Lip Skin Care",
  },
  {
    value: "Body Care",
    label: "Body Care",
  },
  {
    value: "Body Care - Shower Products",
    label: "Shower Products",
  },
  {
    value: "Body Care - Bath Foam, Salt, and Oil",
    label: "Bath Foam, Salt, and Oil",
  },
  {
    value: "Body Care - Body Scrubs and Peels",
    label: "Body Scrubs and Peels",
  },
  {
    value: "Body Care - Weight Loss and Anti-Cellulite Products",
    label: "Weight Loss and Anti-Cellulite Products",
  },
  {
    value: "Body Care - Deodorants for Women",
    label: "Deodorants for Women",
  },
  {
    value: "Body Care - Soap and Liquid Soap",
    label: "Soap and Liquid Soap",
  },
  {
    value: "Body Care - Body Creams and Oils",
    label: "Body Creams and Oils",
  },
  {
    value: "Body Care - Women's Depilation Products",
    label: "Women's Depilation Products",
  },
  {
    value: "Body Care - Pre and Post Depilation Care",
    label: "Pre and Post Depilation Care",
  },
  {
    value: "Body Care - Depilation Accessories",
    label: "Depilation Accessories",
  },
  {
    value: "Body Care - Foot Care Products",
    label: "Foot Care Products",
  },
  {
    value: "Body Care - Tanning Products",
    label: "Tanning Products",
  },
  {
    value: "Body Care - Self-Tanning Products",
    label: "Self-Tanning Products",
  },
  {
    value: "Body Care - Sun Protection Products",
    label: "Sun Protection Products",
  },
  {
    value: "Body Care - Solarium Cosmetics",
    label: "Solarium Cosmetics",
  },
  {
    value: "Body Care - Body Care Accessories",
    label: "Body Care Accessories",
  },
  {
    value: "Hand and Nail Care",
    label: "Hand and Nail Care",
  },
  {
    value: "Hand and Nail Care - Hand Skin Care Products",
    label: "Hand Skin Care Products",
  },
  {
    value: "Hand and Nail Care - Nail Tools",
    label: "Nail Tools",
  },
  {
    value: "Hand and Nail Care - Manicure and Pedicure",
    label: "Manicure and Pedicure",
  },
  {
    value: "Hand and Nail Care - Manicure and Pedicure Devices",
    label: "Manicure and Pedicure Devices",
  },
  {
    value: "Hand and Nail Care - Drying Lamps",
    label: "Drying Lamps",
  },
  {
    value: "Hand and Nail Care - Scissors, Clippers, and Sets",
    label: "Scissors, Clippers, and Sets",
  },
  {
    value: "Hand and Nail Care - Manicure and Pedicure Accessories",
    label: "Manicure and Pedicure Accessories",
  },
  {
    value: "Hand and Nail Care - Files",
    label: "Files",
  },
  {
    value: "Permanent Makeup and Tattoo",
    label: "Permanent Makeup and Tattoo",
  },
  {
    value: "Permanent Makeup and Tattoo - Tattoo Machines",
    label: "Tattoo Machines",
  },
  {
    value: "Permanent Makeup and Tattoo - Needles for PM",
    label: "Needles and Nozzles for PM",
  },
  {
    value: "Permanent Makeup and Tattoo - Tattoo Needles",
    label: "Tattoo Needles",
  },
  {
    value: "Permanent Makeup and Tattoo - Tattoo Cartridges",
    label: "Tattoo Cartridges",
  },
  {
    value: "Permanent Makeup and Tattoo - Tattoo Inks",
    label: "Tattoo Inks",
  },
  {
    value: "Permanent Makeup and Tattoo - Tattoo Pigments",
    label: "Tattoo Pigments",
  },
  {
    value: "Permanent Makeup and Tattoo - Adapters, Grips, Tattoo Holders",
    label: "Adapters, Grips, Tattoo Holders",
  },
  {
    value: "Permanent Makeup and Tattoo - Power Supplies, Pedals, Cables",
    label: "Power Supplies, Pedals, Cables",
  },
  {
    value: "Permanent Makeup and Tattoo - Barrier Protection",
    label: "Barrier Protection",
  },
  {
    value: "Permanent Makeup and Tattoo - Cooling Gels, Care",
    label: "Cooling Gels, Care",
  },
  {
    value: "Permanent Makeup and Tattoo - Lamps, Light",
    label: "Lamps, Light",
  },
  {
    value: "Permanent Makeup and Tattoo - Training Materials, Sketch",
    label: "Training Materials, Sketch",
  },
  {
    value: "Permanent Makeup and Tattoo - Containers, Stands",
    label: "Containers, Stands",
  },
  {
    value: "Permanent Makeup and Tattoo - Consumables",
    label: "Consumables",
  },
  {
    value: "Permanent Makeup and Tattoo - Tattoo and Tattoo Removal",
    label: "Tattoo and Tattoo Removal",
  },
  {
    value: "Permanent Makeup and Tattoo - For Microblading",
    label: "For Microblading",
  },
  {
    value: "Permanent Makeup and Tattoo - Dermopens, Cartridges",
    label: "Dermopens, Cartridges",
  },
  {
    value: "Permanent Makeup and Tattoo - Everything for Brow Artists",
    label: "Everything for Brow Artists",
  },
  {
    value: "Eyelash Extensions",
    label: "Eyelash Extensions",
  },
  {
    value: "Eyelash Extensions - Eyelashes",
    label: "Eyelashes",
  },
  {
    value: "Eyelash Extensions - Glue",
    label: "Glue",
  },
  {
    value: "Eyelash Extensions - Accessories",
    label: "Accessories",
  },
  {
    value: "Cosmetology",
    label: "Cosmetology",
  },
  {
    value: "Cosmetology - Injection Cosmetology",
    label: "Injection Cosmetology",
  },
  {
    value: "Cosmetology - Injection Cosmetology - Biorevitalizants",
    label: "Biorevitalizants",
  },
  {
    value: "Cosmetology - Injection Cosmetology - Fillers",
    label: "Fillers",
  },
  {
    value: "Cosmetology - Injection Cosmetology - Mesotherapy",
    label: "Mesotherapy",
  },
  {
    value: "Cosmetology - Injection Cosmetology - Vitamins and Supplements",
    label: "Vitamins and Supplements",
  },
  {
    value: "Cosmetology - Injection Cosmetology - Professional Care",
    label: "Professional Care",
  },
  {
    value: "Cosmetology - Consumables",
    label: "Consumables",
  },
  {
    value: "Cosmetology - Consumables - Equipment",
    label: "Equipment",
  },
  {
    value: "Cosmetology - Consumables - Cosmetology Devices",
    label: "Cosmetology Devices",
  },
  {
    value: "Cosmetology - Consumables - Stone Therapy",
    label: "Stone Therapy",
  },
  {
    value: "Cosmetology - Consumables - Medical Centrifuges",
    label: "Medical Centrifuges",
  },
  {
    value: "Cosmetology - Depilation",
    label: "Depilation",
  },
  {
    value: "Cosmetology - Depilation - Wax",
    label: "Wax",
  },
  {
    value: "Cosmetology - Depilation - Sugar Paste",
    label: "Sugar Paste",
  },
  {
    value: "Cosmetology - Depilation - Other",
    label: "Other",
  },

  { value: "Makeup", label: "Makeup" },
  { value: "Makeup - Makeup Removal", label: "Makeup Removal" },
  { value: "Makeup - For Face", label: "For Face" },
  { value: "Makeup - For Face - Foundation", label: "Foundation" },
  { value: "Makeup - For Face - Powder", label: "Powder" },
  {
    value: "Makeup - For Face - Concealers and Correctors",
    label: "Concealers and Correctors",
  },
  {
    value: "Makeup - For Face - Bases, Primers, Fixatives",
    label: "Bases, Primers, Fixatives",
  },
  {
    value: "Makeup - For Face - Highlighters and Contouring",
    label: "Highlighters and Contouring",
  },
  {
    value: "Makeup - For Face - Blush and Bronzers",
    label: "Blush and Bronzers",
  },
  { value: "Makeup - For Eyes", label: "For Eyes" },
  { value: "Makeup - For Eyes - Mascara", label: "Mascara" },
  {
    value: "Makeup - For Eyes - Eye Pencils and Liners",
    label: "Eye Pencils and Liners",
  },
  {
    value: "Makeup - For Eyes - Eye and Lash Primers",
    label: "Eye and Lash Primers",
  },
  { value: "Makeup - For Eyes - Eye Shadows", label: "Eye Shadows" },

  { value: "Makeup - Eyebrows", label: "Eyebrows" },
  {
    value: "Makeup - Eyebrows - Brow and Lash Coloring",
    label: "Brow and Lash Coloring",
  },
  {
    value: "Makeup - Eyebrows - Brow and Lash Lamination",
    label: "Brow and Lash Lamination",
  },
  { value: "Makeup - Eyebrows - Brow Lightening", label: "Brow Lightening" },
  { value: "Makeup - Eyebrows - Brow Makeup", label: "Brow Makeup" },
  {
    value: "Makeup - Eyebrows - Brow and Lash Strengthening and Growth",
    label: "Brow and Lash Strengthening and Growth",
  },
  { value: "Makeup - Eyebrows - Brow Waxing", label: "Brow Waxing" },

  // Lips
  { value: "Makeup - Lips", label: "Lips" },
  { value: "Makeup - Lips - Lipstick", label: "Lipstick" },
  { value: "Makeup - Lips - Glosses and Tints", label: "Glosses and Tints" },
  { value: "Makeup - Lips - Lip Pencils", label: "Lip Pencils" },
  { value: "Makeup - Lips - Lip Balms", label: "Lip Balms" },
  { value: "Makeup - Accessories", label: "Accessories" },
  {
    value: "Makeup - Accessories - Eyelash Curlers and Combs",
    label: "Eyelash Curlers and Combs",
  },
  {
    value: "Makeup - Accessories - Cosmetic Mirrors",
    label: "Cosmetic Mirrors",
  },
  {
    value: "Makeup - Accessories - Brushes, Sponges, and Applicators",
    label: "Brushes, Sponges, and Applicators",
  },
  {
    value: "Makeup - Accessories - Cosmetic Tweezers",
    label: "Cosmetic Tweezers",
  },
  {
    value: "Makeup - Accessories - Eyelashes and Glue",
    label: "Eyelashes and Glue",
  },
  { value: "Makeup - Accessories - Sets", label: "Sets" },
  { value: "Makeup - Accessories - Consumables", label: "Consumables" },

  { value: "Makeup - Perfumery", label: "Perfumery" },
  { value: "Makeup - Perfumery - Women's Perfume", label: "Women's Perfume" },
  { value: "Makeup - Perfumery - Men's Perfume", label: "Men's Perfume" },
  { value: "Makeup - Perfumery - Unisex Perfume", label: "Unisex Perfume" },
  { value: "Makeup - Perfumery - Niche Perfume", label: "Niche Perfume" },
  { value: "Makeup - Perfumery - Perfume Sets", label: "Perfume Sets" },
  { value: "Makeup - Perfumery - Essential Oils", label: "Essential Oils" },
  { value: "Makeup - Perfumery - Aromatherapy", label: "Aromatherapy" },
  { value: "Makeup - Perfumery - Aroma Lamps", label: "Aroma Lamps" },
  { value: "Makeup - Perfumery - Incense", label: "Incense" },

  { value: "For Men", label: "For Men" },
  { value: "For Men - Electric Shavers", label: "Electric Shavers" },
  { value: "For Men - Razors and Blades", label: "Razors and Blades" },
  { value: "For Men - Shaving Products", label: "Shaving Products" },
  {
    value: "For Men - Beard and Mustache Care",
    label: "Beard and Mustache Care",
  },
  {
    value: "For Men - Beard and Mustache Accessories",
    label: "Beard and Mustache Accessories",
  },
  { value: "Equipment", label: "Equipment" },
  { value: "Equipment - Oral Care", label: "Oral Care" },
  {
    value: "Equipment - Electric Toothbrushes",
    label: "Electric Toothbrushes",
  },
  { value: "Equipment - Irrigators", label: "Irrigators" },
  {
    value: "Equipment - Accessories for Electric Toothbrushes and Irrigators",
    label: "Accessories for Electric Toothbrushes and Irrigators",
  },

  { value: "Equipment - Floor Scales", label: "Floor Scales" },
  { value: "Equipment - Electric Shavers", label: "Electric Shavers" },
  { value: "Equipment - Epilators", label: "Epilators" },
  {
    value: "Equipment - Accessories for Electric Shavers and Epilators",
    label: "Accessories for Electric Shavers and Epilators",
  },
  {
    value: "Equipment - Electric Facial Brushes",
    label: "Electric Facial Brushes",
  },
  { value: "Equipment - Facial Care Devices", label: "Facial Care Devices" },
  { value: "Equipment - Body Care Devices", label: "Body Care Devices" },
  {
    value: "Equipment - Wax Melters and Paraffin Baths",
    label: "Wax Melters and Paraffin Baths",
  },
  { value: "Tools and Accessories", label: "Tools and Accessories" },
  {
    value: "Tools and Accessories - Cosmetic Mirrors",
    label: "Cosmetic Mirrors",
  },
  {
    value: "Tools and Accessories - Brushes and Sponges for Makeup",
    label: "Brushes and Sponges for Makeup",
  },
  { value: "Tools and Accessories - Face Rollers", label: "Face Rollers" },
  { value: "Tools and Accessories - Body Rollers", label: "Body Rollers" },
  {
    value: "Tools and Accessories - Magnifying Lamps",
    label: "Magnifying Lamps",
  },
  {
    value: "Tools and Accessories - Eyelashes and Glue",
    label: "Eyelashes and Glue",
  },
  { value: "For Hairdressers", label: "For Hairdressers" },
  {
    value: "For Hairdressers - Combs and Hair Accessories",
    label: "Combs and Hair Accessories",
  },
  { value: "For Hairdressers - Combs and Brushes", label: "Combs and Brushes" },
  {
    value: "For Hairdressers - Hair Ties, Headbands, Wraps",
    label: "Hair Ties, Headbands, Wraps",
  },
  { value: "For Hairdressers - Hair Clips", label: "Hair Clips" },
  {
    value: "For Hairdressers - Wigs and Hairpieces",
    label: "Wigs and Hairpieces",
  },
  { value: "For Hairdressers - Rollers", label: "Rollers" },
  {
    value: "For Hairdressers - Hair Dryers and Brushes",
    label: "Hair Dryers and Brushes",
  },
  { value: "For Hairdressers - Hair Clippers", label: "Hair Clippers" },
  {
    value: "For Hairdressers - Curling Irons and Straighteners",
    label: "Curling Irons and Straighteners",
  },
  {
    value: "For Cosmetologists and Masseurs",
    label: "For Cosmetologists and Masseurs",
  },
  {
    value: "For Cosmetologists and Masseurs - Cosmetic Tweezers",
    label: "Cosmetic Tweezers",
  },
  { value: "For Cosmetologists and Masseurs - Rollers", label: "Rollers" },
  {
    value:
      "For Cosmetologists and Masseurs - Brushes and Accessories for Hair Coloring",
    label: "Brushes and Accessories for Hair Coloring",
  },
  {
    value: "For Cosmetologists and Masseurs - Makeup Trifles",
    label: "Makeup Trifles",
  },
  {
    value: "For Cosmetologists and Masseurs - Eyelash Curlers and Combs",
    label: "Eyelash Curlers and Combs",
  },
];

const categoriesOptionsKa = [
  {
    value: "Hair",
    label: "თმა",
  },
  {
    value: "Hair - Hair Growth",
    label: "თმის ზრდა",
  },
  {
    value: "Hair - Hair Coloring",
    label: "თმის შეღებვა",
  },
  {
    value: "Hair - Chemical Perm",
    label: "ქიმიური დახვევა",
  },
  {
    value: "Hair - Styling",
    label: "თმის სტილი",
  },
  {
    value: "Hair - Hair Care",
    label: "თმის მოვლა",
  },
  {
    value: "Hair - Shampoos and Conditioners",
    label: "შამპუნები და კონდიციონერები",
  },
  {
    value: "Hair - Styling Tools",
    label: "ხელსაწყოები თმის ვარცხნილობებისთვის",
  },
  {
    value: "Hair - Tinting and Camouflaging Products",
    label: "თმის ღებვის პროდუქტები",
  },
  {
    value: "Hair - Thermal Protection",
    label: "თერმული დაცვა",
  },
  {
    value: "Hair - Brushes and Coloring Tools",
    label: "ფუნჯები და ხელსაწყოები თმის ღებვისთვის",
  },
  {
    value: "Hair - Hair Extension Materials",
    label: "მასალები თმის დაგრძელებისთვის",
  },
  {
    value: "Hair - Accessories",
    label: "აქსესუარები",
  },
  {
    value: "Face Care",
    label: "სახის მოვლა",
  },
  {
    value: "Face Care - Skin Cleansing",
    label: "სახის წმენდა",
  },
  {
    value: "Face Care - Creams and Serums",
    label: "კრემები და შრატები",
  },
  {
    value: "Face Care - Night Care",
    label: "ღამის მოვლა",
  },
  {
    value: "Face Care - Eye Skin Care",
    label: "თვალის გარშემო კანის მოვლა",
  },
  {
    value: "Face Care - Tanning Products",
    label: "გასარუჯი პროდუქტები",
  },
  {
    value: "Face Care - Sun Protection",
    label: "მზისგან დაცვა",
  },
  {
    value: "Face Care - Face Masks",
    label: "სახის ნიღბები",
  },
  {
    value: "Face Care - Scrubs and Peels",
    label: "სკრაბები და პილინგები",
  },
  {
    value: "Face Care - Problem Skin Care",
    label: "პრობლემური კანის მოვლა",
  },
  {
    value: "Face Care - Anti-Aging Cosmetics",
    label: "ანტიასაკობრივი კოსმეტიკა",
  },
  {
    value: "Face Care - Facial Care Devices",
    label: "სახის მოვლის ხელსაწყოები",
  },
  {
    value: "Face Care - Organic and Natural Cosmetics",
    label: "ორგანული და ნატურალური კოსმეტიკა",
  },
  {
    value: "Face Care - Asian Cosmetics",
    label: "აზიური კოსმეტიკა",
  },
  {
    value: "Face Care - Professional Face Care",
    label: "სახის პროფესიული მოვლა ",
  },
  {
    value: "Face Care - Lip Skin Care",
    label: "ტუჩების მოვლა",
  },
  {
    value: "Body Care",
    label: "სხეულის მოვლა",
  },
  {
    value: "Body Care - Shower Products",
    label: "პროდუქტები შხაპისთვის",
  },
  {
    value: "Body Care - Bath Foam, Salt, and Oil",
    label: "აბაზანის ქაფი, მარილი და ზეთი",
  },
  {
    value: "Body Care - Body Scrubs and Peels",
    label: "სხეულის სკრაბები და პილინგები",
  },
  {
    value: "Body Care - Weight Loss and Anti-Cellulite Products",
    label: "წონის კლებისა და ანტიცელულიტური პროდუქტები",
  },
  {
    value: "Body Care - Deodorants for Women",
    label: "დეოდორანტები ქალებისთვის",
  },
  {
    value: "Body Care - Soap and Liquid Soap",
    label: "საპონი და თხევადი საპონი",
  },
  {
    value: "Body Care - Body Creams and Oils",
    label: "სხეულის კრემები და ზეთები",
  },
  {
    value: "Body Care - Women's Depilation Products",
    label: "დეპილაციის პროდუქტები ქალებისთვის",
  },
  {
    value: "Body Care - Pre and Post Depilation Care",
    label: "პროდუქტები პრე და პოსტ დეპილაციისთვის",
  },
  {
    value: "Body Care - Depilation Accessories",
    label: "აქსესუარები დეპილაციისთვის",
  },
  {
    value: "Body Care - Foot Care Products",
    label: "ფეხების/ტერფების მოვლის პროდუქტები",
  },
  {
    value: "Body Care - Tanning Products",
    label: "გასარუჯი პროდუქტები",
  },
  {
    value: "Body Care - Self-Tanning Products",
    label: "პროდუქტები ავტორუჯისთვის",
  },
  {
    value: "Body Care - Sun Protection Products",
    label: "მზისგან დამცავი პროდუქტები",
  },
  {
    value: "Body Care - Solarium Cosmetics",
    label: "სოლარიუმის კოსმეტიკა",
  },
  {
    value: "Body Care - Body Care Accessories",
    label: "სხეულის მოვლის აქსესუარები",
  },
  {
    value: "Hand and Nail Care",
    label: "ხელებისა და ფრჩხილების მოვლა",
  },
  {
    value: "Hand and Nail Care - Hand Skin Care Products",
    label: "ხელების კანის მოვლის პროდუქტები",
  },
  {
    value: "Hand and Nail Care - Nail Tools",
    label: "ფრჩხილების მოვლის ხელსაწყოები",
  },
  {
    value: "Hand and Nail Care - Manicure and Pedicure",
    label: "მანიკური და პედიკური",
  },
  {
    value: "Hand and Nail Care - Manicure and Pedicure Devices",
    label: "მანიკურისა და პედიკურის მოწყობილობები",
  },
  {
    value: "Hand and Nail Care - Drying Lamps",
    label: "გასაშრობი ლამპები",
  },
  {
    value: "Hand and Nail Care - Scissors, Clippers, and Sets",
    label: "მაკრატლები, ფრჩხილის საკვნეტელა და ნაკრებები",
  },
  {
    value: "Hand and Nail Care - Manicure and Pedicure Accessories",
    label: "მანიკურისა და პედიკურის აქსესუარები",
  },
  {
    value: "Hand and Nail Care - Files",
    label: "ქლიბები",
  },
  {
    value: "Permanent Makeup and Tattoo",
    label: "პერმანენტული მაკიაჟი და ტატუ",
  },
  {
    value: "Permanent Makeup and Tattoo - Tattoo Machines",
    label: "ტატუს აპარატები",
  },
  {
    value: "Permanent Makeup and Tattoo - Needles for PM",
    label: "ნემსები PM-სთვის",
  },
  {
    value: "Permanent Makeup and Tattoo - Tattoo Needles",
    label: "ტატუს ნემსები",
  },
  {
    value: "Permanent Makeup and Tattoo - Tattoo Cartridges",
    label: "ტატუს კატრიჯები",
  },
  {
    value: "Permanent Makeup and Tattoo - Tattoo Inks",
    label: "ტატუს საღებავები",
  },
  {
    value: "Permanent Makeup and Tattoo - Tattoo Pigments",
    label: "ტატუს პიგმენტები",
  },
  {
    value: "Permanent Makeup and Tattoo - Adapters, Grips, Tattoo Holders",
    label: "ადაპტერები, ტატუ აპარატის სახელურები და ხელის დასადებები",
  },
  {
    value: "Permanent Makeup and Tattoo - Power Supplies, Pedals, Cables",
    label: "კვების ბლოკები, პედლები და კაბელები",
  },
  {
    value: "Permanent Makeup and Tattoo - Barrier Protection",
    label: "დამცავი ბარიერები",
  },
  {
    value: "Permanent Makeup and Tattoo - Cooling Gels, Care",
    label: "გასაყინი გელები, მოვლა",
  },
  {
    value: "Permanent Makeup and Tattoo - Lamps, Light",
    label: "ლამპები, განათება",
  },
  {
    value: "Permanent Makeup and Tattoo - Training Materials, Sketch",
    label: "სავარჯიშო მასალები, სკეჩები",
  },
  {
    value: "Permanent Makeup and Tattoo - Containers, Stands",
    label: "კონტეინერები, სადგამები",
  },
  {
    value: "Permanent Makeup and Tattoo - Consumables",
    label: "სახარჯი მასალები",
  },
  {
    value: "Permanent Makeup and Tattoo - Tattoo and Tattoo Removal",
    label: "ტატუს მოშორება",
  },
  {
    value: "Permanent Makeup and Tattoo - For Microblading",
    label: "მიკრობლეიდინგი",
  },
  {
    value: "Permanent Makeup and Tattoo - Dermopens, Cartridges",
    label: "დერმაპენი, კარტრიჯები",
  },
  {
    value: "Permanent Makeup and Tattoo - Everything for Brow Artists",
    label: "ყველაფერი წარბების მასტერებისთვის",
  },
  {
    value: "Eyelash Extensions",
    label: "წამწამების დაგრძელება",
  },
  {
    value: "Eyelash Extensions - Eyelashes",
    label: "წამწამები",
  },
  {
    value: "Eyelash Extensions - Glue",
    label: "წებო",
  },
  {
    value: "Eyelash Extensions - Accessories",
    label: "აქსესუარები",
  },
  {
    value: "Cosmetology",
    label: "კოსმეტოლოგია",
  },
  {
    value: "Cosmetology - Injection Cosmetology",
    label: "ინექციური კოსმეტოლოგია",
  },
  {
    value: "Cosmetology - Injection Cosmetology - Biorevitalization",
    label: "ბიორევიტალიზანტები",
  },
  {
    value: "Cosmetology - Injection Cosmetology - Fillers",
    label: "ფილერები",
  },
  {
    value: "Cosmetology - Injection Cosmetology - Mesotherapy",
    label: "მეზოთერაპია",
  },
  {
    value: "Cosmetology - Injection Cosmetology - Vitamins and Supplements",
    label: "ვიტამინები და დანამატები",
  },
  {
    value: "Cosmetology - Injection Cosmetology - Professional Care",
    label: "პროფესიონალური მოვლა",
  },
  {
    value: "Cosmetology - Consumables",
    label: "სახარჯი მასალები",
  },
  {
    value: "Cosmetology - Consumables - Equipment",
    label: "აღჭურვილობა",
  },
  {
    value: "Cosmetology - Consumables - Cosmetology Devices",
    label: "კოსმეტოლოგიური აპარატები",
  },
  {
    value: "Cosmetology - Consumables - Stone Therapy",
    label: "ქვებით თერაპია",
  },
  {
    value: "Cosmetology - Consumables - Medical Centrifuges",
    label: "სამედიცინო ცენტრიფუგა",
  },
  {
    value: "Cosmetology - Depilation",
    label: "დეპილაცია",
  },
  {
    value: "Cosmetology - Depilation - Wax",
    label: "ცვილი",
  },
  {
    value: "Cosmetology - Depilation - Sugar Paste",
    label: "შუგარინგის პასტა",
  },
  {
    value: "Cosmetology - Depilation - Other",
    label: "სხვა",
  },

  { value: "Makeup", label: "მაკიაჟი" },
  { value: "Makeup - Makeup Removal", label: "მაკიაჟის მოშორება" },
  { value: "Makeup - For Face", label: "სახე" },
  { value: "Makeup - For Face - Foundation", label: "ტონალური კრემი" },
  { value: "Makeup - For Face - Powder", label: "პუდრი" },
  {
    value: "Makeup - For Face - Concealers and Correctors",
    label: "ქონსილერები და კორექტორები ",
  },
  {
    value: "Makeup - For Face - Bases, Primers, Fixatives",
    label: "ბაზები, პრაიმერები და ფიქსატორები",
  },
  {
    value: "Makeup - For Face - Highlighters and Contouring",
    label: "ჰაილაითერები და კონტურინგი",
  },
  {
    value: "Makeup - For Face - Blush and Bronzers",
    label: "ბლაშები და ბრონზერები",
  },
  { value: "Makeup - For Eyes", label: "თვალი" },
  { value: "Makeup - For Eyes - Mascara", label: "ტუში" },
  {
    value: "Makeup - For Eyes - Eye Pencils and Liners",
    label: "თვალის ფანქრები და ლაინერები",
  },
  {
    value: "Makeup - For Eyes - Eye and Lash Primers",
    label: "თვალისა და წამწამის პრაიმერები ",
  },
  { value: "Makeup - For Eyes - Eye Shadows", label: "თვალის ჩრდილები" },

  { value: "Makeup - Eyebrows", label: "წარბები" },
  {
    value: "Makeup - Eyebrows - Brow and Lash Coloring",
    label: "წარბისა და წამწამის შეღებვა",
  },
  {
    value: "Makeup - Eyebrows - Brow and Lash Lamination",
    label: "წარბისა და წამწამის ლამინირება",
  },
  { value: "Makeup - Eyebrows - Brow Lightening", label: "წარბების გაღიავება" },
  { value: "Makeup - Eyebrows - Brow Makeup", label: "წარბის მაკიაჟი" },
  {
    value: "Makeup - Eyebrows - Brow and Lash Strengthening and Growth",
    label: "წარბისა და წამწამის ზრდა და გაჯანსაღება",
  },
  {
    value: "Makeup - Eyebrows - Brow Waxing",
    label: "წარბების ცვილი",
  },

  { value: "Makeup - Lips", label: "ტუჩი" },
  { value: "Makeup - Lips - Lipstick", label: "ტუჩსაცხები" },
  { value: "Makeup - Lips - Glosses and Tints", label: "გლოსები" },
  { value: "Makeup - Lips - Lip Pencils", label: "ტუჩის ფანქრები" },
  { value: "Makeup - Lips - Lip Balms", label: "ტუჩის ბალზამები" },
  { value: "Makeup - Accessories", label: "აქსესუარები" },
  {
    value: "Makeup - Accessories - Eyelash Curlers and Combs",
    label: "წამწამების ასაპრეხები და სავარცხლები",
  },
  {
    value: "Makeup - Accessories - Cosmetic Mirrors",
    label: "კოსმეტიკური სარკეები",
  },
  {
    value: "Makeup - Accessories - Brushes, Sponges, and Applicators",
    label: "ფუნჯები, სპონჯები და აპლიკატორები",
  },
  {
    value: "Makeup - Accessories - Cosmetic Tweezers",
    label: "კოსმეტიკური პინცეტი",
  },
  {
    value: "Makeup - Accessories - Eyelashes and Glue",
    label: "წამწამები და წებო",
  },
  { value: "Makeup - Accessories - Sets", label: "ნაკრებები" },
  { value: "Makeup - Accessories - Consumables", label: "სახარჯი მასალები" },

  { value: "Makeup - Perfumery", label: "პარფიუმერია" },
  {
    value: "Makeup - Perfumery - ქალის პარფიუმი",
    label: "Женская парфюмерия",
  },
  { value: "Makeup - Perfumery - Men's Perfume", label: "მამაკაცის პარფიუმი" },
  { value: "Makeup - Perfumery - Unisex Perfume", label: "უნისექს პარფიუმი" },
  { value: "Makeup - Perfumery - Niche Perfume", label: "ნიშ პარფიუმი" },
  { value: "Makeup - Perfumery - Perfume Sets", label: "პარფიუმის ნაკრებები" },
  { value: "Makeup - Perfumery - Essential Oils", label: "ესენციური ზეთები" },
  { value: "Makeup - Perfumery - Aromatherapy", label: "არომათერაპია" },
  { value: "Makeup - Perfumery - Aroma Lamps", label: "არომა ლამპა" },
  { value: "Makeup - Perfumery - Incense", label: "საკმეველი" },

  { value: "For Men", label: "კაცებისთვის" },
  { value: "For Men - Electric Shavers", label: "ელექტროსაპარსი" },
  { value: "For Men - Razors and Blades", label: "ბრიტვები და სამართებლები" },
  { value: "For Men - Shaving Products", label: "საპარსი პროდუქტები" },
  {
    value: "For Men - Beard and Mustache Care",
    label: "წვერისა და ულვაშის მოვლა",
  },
  {
    value: "For Men - Beard and Mustache Accessories",
    label: "წვერისა და ულვაშის აქსესუარები",
  },
  { value: "Equipment", label: "მოწყობილობები" },
  { value: "Equipment - Oral Care", label: "პირის ღრუს მოვლა" },
  {
    value: "Equipment - Electric Toothbrushes",
    label: "ელექტრონული კბილის ჯაგრისები",
  },
  { value: "Equipment - Irrigators", label: "ირიგატორები" },
  {
    value: "Equipment - Accessories for Electric Toothbrushes and Irrigators",
    label: "აქსესუარები ელექტრონული კბილის ჯაგრისებისა და ირიგატორებისთვის",
  },

  { value: "Equipment - Floor Scales", label: "დასადგომი სასწორები" },
  { value: "Equipment - Electric Shavers", label: "ელექტრო საპარსები" },
  { value: "Equipment - Epilators", label: "ეპილატორები" },
  {
    value: "Equipment - Accessories for Electric Shavers and Epilators",
    label: "აქსესუარები ელექტრო საპარსებისა და ეპილატორებისთვის",
  },
  {
    value: "Equipment - Electric Facial Brushes",
    label: "სახის ელექტრო ფუნჯები",
  },
  {
    value: "Equipment - Facial Care Devices",
    label: "სახის მოვლის მოწყობილობები",
  },
  {
    value: "Equipment - Body Care Devices",
    label: "სხეულის მოვლის მოწყობილობები",
  },
  {
    value: "Equipment - Wax Melters and Paraffin Baths",
    label: "ცვილის დასადნობი და პარაფინის აბაზანები ",
  },
  { value: "Tools and Accessories", label: "ინსტრუმენტები და აქსესუარები" },
  {
    value: "Tools and Accessories - Cosmetic Mirrors",
    label: "კოსმეტიკური სარკეები",
  },
  {
    value: "Tools and Accessories - Brushes and Sponges for Makeup",
    label: "მაკიაჟის ფუნჯები და სპონჯები",
  },
  { value: "Tools and Accessories - Face Rollers", label: "სახის როლერები" },
  { value: "Tools and Accessories - Body Rollers", label: "სხეულის როლერები" },
  {
    value: "Tools and Accessories - Magnifying Lamps",
    label: "ლამპები გამადიდებელი ლუპით",
  },
  {
    value: "Tools and Accessories - Eyelashes and Glue",
    label: "წამწამები და წებო",
  },
  { value: "For Hairdressers", label: "თმის სტილისტებისთვის" },
  {
    value: "For Hairdressers - Combs and Hair Accessories",
    label: "სავარცხლები და აქსესუარები",
  },
  {
    value: "For Hairdressers - Combs and Brushes",
    label: "სავარცხლები და ფუნჯები",
  },
  {
    value: "For Hairdressers - Hair Ties, Headbands, Wraps",
    label: "თმის რეზინები,აბადოკები, სამაგრები",
  },
  { value: "For Hairdressers - Hair Clips", label: "თმის სამაგრი კლიპსები" },
  {
    value: "For Hairdressers - Wigs and Hairpieces",
    label: "პარიკები და შინიონები",
  },
  { value: "For Hairdressers - Rollers", label: "თმის სახვევი როლერები" },
  {
    value: "For Hairdressers - Hair Dryers and Brushes",
    label: "თმის საშრობი ფენები და სავარცხლები",
  },
  { value: "For Hairdressers - Hair Clippers", label: "თმის საპარსები" },
  {
    value: "For Hairdressers - Curling Irons and Straighteners",
    label: "თმის დასახვევი და დასასწორებელი უთოები",
  },

  {
    value: "For Cosmetologists and Masseurs",
    label: "კოსმეტოლოგებისა და მასაჟისტებისთვის",
  },
  {
    value: "For Cosmetologists and Masseurs - Cosmetic Tweezers",
    label: "კოსმეტიკური პინცეტები",
  },
  { value: "For Cosmetologists and Masseurs - Rollers", label: "როლერები" },
  {
    value:
      "For Cosmetologists and Masseurs - Brushes and Accessories for Hair Coloring",
    label: "თმის შესაღები ფუნჯები და აქსესუარები",
  },
  {
    value: "For Cosmetologists and Masseurs - Makeup Trifles",
    label: "წვრილმანები მაკიაჟისთვის",
  },
  {
    value: "For Cosmetologists and Masseurs - Eyelash Curlers and Combs",
    label: "წამწამების საპრეხები და სავარცხლები",
  },
];
