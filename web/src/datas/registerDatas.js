import React from "react";
import { useSelector } from "react-redux";

export const ProceduresOptions = () => {
  const language = useSelector((state) => state.storeApp.language);

  let proceduresOptions;
  if (language === "ka") {
    proceduresOptions = proceduresOptionsKa;
  } else if (language === "ru") {
    proceduresOptions = proceduresOptionsRu;
  } else {
    proceduresOptions = proceduresOptionsEn;
  }

  return proceduresOptions;
};

const proceduresOptionsEn = [
  {
    value: "Hairdressing procedures",
    label: "Hairdressing procedures",
  },
  {
    value: "Hairdressing procedures - hair cut",
    label: "Hair cut",
  },
  {
    value: "Hairdressing procedures - hair cut - hair cut for woman",
    label: "Hair cut for woman",
  },
  {
    value: "Hairdressing procedures - hair cut - hair cut for man",
    label: "Hair cut for man",
  },
  {
    value: "Hairdressing procedures - hair cut - hair cut for children",
    label: "Hair cut for children",
  },
  {
    value:
      "Hairdressing procedures - hair cut - Hair cutting with hot scissors",
    label: "Hair cutting with hot scissors",
  },
  {
    value: "Hairdressing procedures - hair coloring",
    label: "Hair coloring",
  },
  {
    value: "Hairdressing procedures - hair coloring - Classic hair coloring",
    label: "Classic hair coloring",
  },
  {
    value: "Hairdressing procedures - hair coloring - Partial hair coloring",
    label: "Partial hair coloring",
  },
  {
    value:
      "Hairdressing procedures - hair coloring - coloring the roots of the hair",
    label: "Coloring the roots of the hair",
  },
  {
    value: "Hairdressing procedures - hair coloring - Hair toning",
    label: "Hair toning",
  },
  {
    value: "Hairdressing procedures - hair coloring - Hair highlighting",
    label: "Hair highlighting",
  },
  {
    value: "Hairdressing procedures - hair coloring - hair lightening",
    label: "Hair lightening",
  },
  {
    value: "Hairdressing procedures - hair coloring - Ombre",
    label: "Ombre",
  },
  {
    value: "Hairdressing procedures - hair coloring - Air Touch",
    label: "Air Touch",
  },
  {
    value: "Hairdressing procedures - hair coloring - Decapitation",
    label: "Decapitation",
  },
  {
    value: "Hairdressing procedures - hair curling - hair curling",
    label: "Hair curling",
  },
  {
    value: "Hairdressing procedures - hair curling - Chemical hair curling",
    label: "Chemical hair curling",
  },
  {
    value: "Hairdressing procedures - hair curling - Bio curling",
    label: "Bio curling",
  },
  {
    value: "Hairdressing procedures - hair care",
    label: "Hair care",
  },
  {
    value: "Hairdressing procedures - hair care - hair washing",
    label: "Hair washing",
  },
  {
    value: "Hairdressing procedures - hair care - hair botox",
    label: "Hair botox",
  },
  {
    value: "Hairdressing procedures - hair care - keratin treatment",
    label: "Keratin treatment",
  },
  {
    value: "Hairdressing procedures - hair care - hair polishing",
    label: "Hair polishing",
  },
  {
    value: "Hairdressing procedures - hair care - Hair lamination",
    label: "Hair Lamination",
  },
  {
    value: "Hairdressing procedures - hair care - Hair Therapy Wrap",
    label: "Hair Therapy Wrap",
  },
  {
    value: "Hairdressing procedures - hair care - Hair biorevitalization",
    label: "Hair biorevitalization",
  },
  {
    value: "Hairdressing procedures - hair care - nanoplastia hair treatment",
    label: "Nanoplastia hair treatment",
  },
  {
    value: "Hairdressing procedures - hair care - Head massage",
    label: "Head massage",
  },
  {
    value: "Hairdressing procedures - hair decoration",
    label: "Hair decoration",
  },
  {
    value: "Hairdressing procedures - hair decoration - hair style",
    label: "Hair style",
  },
  {
    value: "Hairdressing procedures - hair decoration - Hair placement",
    label: "Hair placement",
  },
  {
    value: "Hairdressing procedures - hair decoration - Hair braids",
    label: "Hair braids",
  },
  {
    value: "Hairdressing procedures - hair decoration - hair extension",
    label: "Hair extension",
  },
  {
    value: "Hairdressing procedures - hair decoration -  African braids",
    label: "African braids",
  },
  {
    value: "Hairdressing procedures - hair decoration - Dreads",
    label: "Dreads",
  },
  {
    value: "Permanent Makeup",
    label: "Permanent Makeup",
  },
  {
    value:
      "Permanent Makeup - permanent eyebrow makeup - permanent eyebrow makeup",
    label: "Permanent eyebrow makeup",
  },
  {
    value: "Permanent Makeup - permanent lip makeup - permanent lip makeup",
    label: "Permanent lip makeup",
  },
  {
    value:
      "Permanent Makeup - permanent eyelid makeup - permanent eyelid makeup",
    label: "Permanent eyelid makeup",
  },
  {
    value: "Permanent Makeup - microblading - microblading",
    label: "Microblading",
  },
  {
    value: "Permanent Makeup - Powdered brows - Powdered brows",
    label: "Powdered brows",
  },
  {
    value:
      "Permanent Makeup - removing permanent make-up - removing permanent make-up",
    label: "Removing permanent make-up",
  },
  {
    value: "spa",
    label: "SPA",
  },
  {
    value: "Spa - Face SPA - Face SPA",
    label: "Face SPA",
  },
  {
    value: "Spa - Body SPA - Body SPA",
    label: "Body SPA",
  },
  {
    value:
      "Spa - body shaping and figure correction - body shaping and figure correction",
    label: "Body shaping and figure correction",
  },
  {
    value: "Spa - SPA programs - SPA programs",
    label: "SPA programs",
  },
  {
    value: "Spa - massage",
    label: "Spa - massage",
  },
  {
    value: "Spa - massage - LPG massage",
    label: "LPG massage",
  },
  {
    value: "Spa - massage - SPA massage",
    label: "SPA massage",
  },
  {
    value: "Spa - massage - pressotherapy",
    label: "Pressotherapy",
  },
  {
    value: "Spa - massage - Lymphatic Drainage Massage",
    label: "Lymphatic Drainage Massage",
  },
  {
    value: "Spa - massage - manual massage",
    label: "Manual massage",
  },
  {
    value: "Spa - massage - anti cellulite massage",
    label: "Anti cellulite massage",
  },
  {
    value: "Spa - massage - face massage",
    label: "Face massage",
  },
  {
    value: "Piercing",
    label: "Piercing",
  },
  {
    value: "Piercing - ear piercing - ear piercing",
    label: "Ear piercing",
  },
  {
    value: "Piercing - ear piercing for kids - ear piercing for kids",
    label: "Ear piercing for kids",
  },
  {
    value: "Piercing - face piercing - face piercing",
    label: "Face piercing",
  },
  {
    value: "Piercing - body piercing - body piercing",
    label: "Body piercing",
  },
  {
    value: "Tattoo",
    label: "Tattoo",
  },
  {
    value: "Tattoo - Tattoo skatches - Tattoo skatches",
    label: "Tattoo skatches",
  },
  {
    value: "Tattoo - Tattoo - Tattoo",
    label: "Tattoo",
  },
  {
    value: "Tattoo - tattoo correction - tattoo correction",
    label: "Tattoo correction",
  },
  {
    value: "Tattoo - covering up scares - covering up scares",
    label: "Covering up scares",
  },
  {
    value: "Tattoo - Laser Tattoo Removal - Laser Tattoo Removal",
    label: "Laser Tattoo Removal",
  },
  {
    value: "Solarium",
    label: "Solarium",
  },
  {
    value: "Solarium - vertical sunbed - vertical sunbed",
    label: "Vertical sunbed",
  },
  {
    value: "Solarium - horizontal sunbed - horizontal sunbed",
    label: "Horizontal sunbed",
  },
  {
    value: "Cosmetology",
    label: "Cosmetology",
  },
  {
    value:
      "Cosmetology - hyperpigmentation treatmens - hyperpigmentation treatmens",
    label: "Hyperpigmentation treatmens",
  },
  {
    value: "Cosmetology - Acne treatment - Acne treatment",
    label: "Acne treatment",
  },
  {
    value: "Cosmetology - Apparatus cosmetology",
    label: "Apparatus cosmetology",
  },
  {
    value:
      "Cosmetology - Apparatus cosmetology - Apparatus cosmetology for face",
    label: "Apparatus cosmetology for face",
  },
  {
    value:
      "Cosmetology - Apparatus cosmetology - Apparatus cosmetology for body",
    label: "Apparatus cosmetology for body",
  },
  {
    value: "Cosmetology - aesthetic cosmetology",
    label: "Aesthetic cosmetology",
  },
  {
    value: "Cosmetology - aesthetic cosmetology - peeling",
    label: "Peeling",
  },
  {
    value: "Cosmetology - aesthetic cosmetology - face cleansing",
    label: "Face cleansing",
  },
  {
    value: "Cosmetology - aesthetic cosmetology - cosmetic care",
    label: "Cosmetic care",
  },
  {
    value: "Cosmetology - injection cosmetology",
    label: "Injection cosmetology",
  },
  {
    value: "Cosmetology - injection cosmetology - Biorevitalization",
    label: "Biorevitalization",
  },
  {
    value: "Cosmetology - injection cosmetology - Mesotherapy",
    label: "Mesotherapy",
  },
  {
    value: "Cosmetology - injection cosmetology - contouring plastic",
    label: "Contouring plastic",
  },
  {
    value: "Cosmetology - injection cosmetology - lip augmentation",
    label: "Lip augmentation",
  },
  {
    value: "Cosmetology - injection cosmetology - injections",
    label: "Injections",
  },
  {
    value: "Cosmetology - injection cosmetology - Botulinum therapy",
    label: "Botulinum therapy",
  },
  {
    value: "Cosmetology - injection cosmetology - plasma therapy",
    label: "Plasma therapy",
  },
  {
    value: "Cosmetology - injection cosmetology - collagen stimulation",
    label: "Collagen stimulation",
  },
  {
    value: "Cosmetology - injection cosmetology - Intim plastic",
    label: "Intim plastic",
  },
  {
    value: "Cosmetology - injection cosmetology - Mesonites",
    label: "Mesonites",
  },
  {
    value: "Cosmetology - injection cosmetology - bio reinforcement",
    label: "Bio reinforcement",
  },
  {
    value: "Cosmetology - injection cosmetology - Bioreparation",
    label: "Bioreparation",
  },
  {
    value: "Cosmetology - laser cosmetology",
    label: "Laser cosmetology",
  },
  {
    value: "Cosmetology - laser cosmetology - Fractional rejuvenation",
    label: "Fractional rejuvenation",
  },
  {
    value: "Cosmetology - laser cosmetology - mole removal",
    label: "Mole removal",
  },
  {
    value:
      "Cosmetology - laser cosmetology - Removal of stretch marks and scars",
    label: "Removal of stretch marks and scars",
  },
  {
    value: "Cosmetology - laser cosmetology - laser Biorevitalization",
    label: "Laser Biorevitalization",
  },
  {
    value: "Cosmetology - laser cosmetology - photo rejuvenation",
    label: "Photo rejuvenation",
  },
  {
    value: "Cosmetology - laser cosmetology - tattoo removal",
    label: "Tattoo removal",
  },
  {
    value: "Epilation",
    label: "Epilation",
  },
  {
    value: "Epilation - Civil depilation - Civil depilation",
    label: "Civil depilation",
  },
  {
    value: "Epilation - sugar hair removal - sugar hair removal",
    label: "Sugar hair removal",
  },
  {
    value: "Epilation - laser hair removal - laser hair removal",
    label: "Laser hair removal",
  },
  {
    value: "Epilation - Geling hair removal - Geling hair removal",
    label: "Geling hair removal",
  },
  {
    value: "Nail procedures",
    label: "Nail procedures",
  },
  {
    value: "Nail procedures - manicure",
    label: "Manicure",
  },
  {
    value: "Nail procedures - manicure - classic manicure",
    label: "Classic manicure",
  },
  {
    value: "Nail procedures - manicure - apparate manicure",
    label: "Apparate manicure",
  },
  {
    value: "Nail procedures - manicure - Spa manicure",
    label: "Spa manicure",
  },
  {
    value: "Nail procedures - manicure - Combined manicure",
    label: "Combined manicure",
  },
  {
    value: "Nail procedures - manicure - men's Manicure",
    label: "Men's Manicure",
  },
  {
    value: "Nail procedures - manicure - Hot manicure",
    label: "Hot manicure",
  },
  {
    value: "Nail procedures - manicure - Japanese Manicure",
    label: "Japanese Manicure",
  },
  {
    value: "Nail procedures - manicure - European manicure",
    label: "European manicure",
  },
  {
    value: "Nail procedures - manicure - nail shape correction",
    label: "Nail shape correction",
  },
  {
    value: "Nail procedures - manicure - nail polishing",
    label: "Nail polishing",
  },
  {
    value: "Nail procedures - Pedicure",
    label: "Pedicure",
  },
  {
    value: "Nail procedures - Pedicure - classic pedicure",
    label: "Classic pedicure",
  },
  {
    value: "Nail procedures - Pedicure - Hardware pedicure",
    label: "Hardware pedicure",
  },
  {
    value: "Nail procedures - Pedicure - Combined pedicure",
    label: "Combined pedicure",
  },
  {
    value: "Nail procedures - Pedicure - Spa pedicure",
    label: "Spa pedicure",
  },
  {
    value: "Nail procedures - Pedicure - men’s pedicure",
    label: "Men’s pedicure",
  },
  {
    value: "Nail procedures - Pedicure - European pedicure",
    label: "European pedicure",
  },
  {
    value: "Nail procedures - Pedicure - toenails shape correction",
    label: "Toenails shape correction",
  },
  {
    value: "Nail procedures - nail design",
    label: "Nail design",
  },
  {
    value: "Nail procedures - nail design - nail polish",
    label: "Nail polish",
  },
  {
    value: "Nail procedures - nail design - nail polish removal",
    label: "Nail polish removal",
  },
  {
    value: "Nail procedures - nail design - painting on nails",
    label: "Painting on nails",
  },
  {
    value: "Nail procedures - nail design - Rhinestones",
    label: "Rhinestones",
  },
  {
    value: "Nail procedures - nail design - nail piercing",
    label: "Nail piercing",
  },
  {
    value: "Nail procedures - nail design - 3d nail design",
    label: "3d nail design",
  },
  {
    value: "Nail procedures - nail design - Nail gel polish",
    label: "Nail gel polish",
  },
  {
    value: "Nail procedures - nail design - gel polish removal",
    label: "Gel polish removal",
  },
  {
    value: "Nail procedures - nail extension",
    label: "Nail extension",
  },
  {
    value: "Nail procedures - nail extension - nail fixing",
    label: "Nail fixing",
  },
  {
    value: "Nail procedures - nail extension - nail extension",
    label: "Nail extension",
  },
  {
    value: "Nail procedures - nail extension - toe nail extension",
    label: "Toe nail extension",
  },
  {
    value: "Nail procedures - nail extension - Nail strengthening",
    label: "Nail strengthening",
  },
  {
    value: "Nail procedures - nail extension - nail correction",
    label: "Nail correction",
  },
  {
    value: "Nail procedures - nail extension - Removal of artificial nails",
    label: "Removal of artificial nails",
  },
  {
    value: "Nail procedures - Nail care",
    label: "Nail care",
  },
  {
    value: "Nail procedures - Nail care - hand massage",
    label: "Hand massage",
  },
  {
    value: "Nail procedures - Nail care - Hand Spa Treatment",
    label: "Hand Spa Treatment",
  },
  {
    value: "Nail procedures - Nail care - foot Spa Treatment",
    label: "Foot Spa Treatment",
  },
  {
    value: "Nail procedures - nail care - peeling",
    label: "Peeling",
  },
  {
    value: "Nail procedures - podology",
    label: "Podology",
  },
  {
    value: "Nail procedures - podology - medical pedicure",
    label: "Medical pedicure",
  },
  {
    value: "Nail procedures - podology - ingrown nail treatment",
    label: "Ingrown nail treatment",
  },
  {
    value: "Nail procedures - podology - nail fungus treatment",
    label: "Nail fungus treatment",
  },
  {
    value: "Eyebrows and Eyelashes",
    label: "Eyebrows and Eyelashes",
  },
  {
    value: "Eyebrows and Eyelashes - brow correction",
    label: "Brow correction",
  },
  {
    value:
      "Eyebrows and Eyelashes - brow correction - brow correction with a thread",
    label: "Brow correction with a thread",
  },
  {
    value:
      "Eyebrows and Eyelashes - brow correction - brow correction with wax",
    label: "Brow correction with wax",
  },
  {
    value:
      "Eyebrows and Eyelashes - brow correction - brow correction with tweezer",
    label: "Brow correction with tweezer",
  },
  {
    value: "Eyebrows and Eyelashes - brow correction - Brow thinning",
    label: "Brow thinning",
  },
  {
    value: "Eyebrows and Eyelashes - eyebrows and eyelashes coloring",
    label: "Eyebrows and eyelashes coloring",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes coloring - Eyebrow coloring",
    label: "Eyebrow coloring",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes coloring - Eyelash coloring",
    label: "Eyelash coloring",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes coloring - Eyebrow coloring with henna",
    label: "Eyebrow coloring with henna",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes coloring - Eyebrow lighting",
    label: "Eyebrow lighting",
  },
  {
    value: "Eyebrows and Eyelashes - eyebrows and eyelashes Lamination",
    label: "Eyebrows and eyelashes Lamination",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes Lamination - Brow lamination",
    label: "Brow lamination",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes Lamination - Lash lamination",
    label: "Lash lamination",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes Lamination - Brow flexing",
    label: "Brow flexing",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes Lamination - Lash flexing",
    label: "Lash flexing",
  },
  {
    value: "Eyebrows and Eyelashes - lash extension - lash extension",
    label: "Lash extension",
  },
  {
    value: "Eyebrows and Eyelashes - brow extension - brow extension",
    label: "Brow extension",
  },
  {
    value: "Beard procedures",
    label: "Beard procedures",
  },
  {
    value: "Beard procedures - Beard Care",
    label: "Beard Care",
  },
  {
    value: "Beard procedures - Beard Care - beard trimming",
    label: "Beard trimming",
  },
  {
    value: "Beard procedures - Beard Care - shaving",
    label: "Shaving",
  },
  {
    value: "Beard procedures - Beard Care - beard and mustache modeling",
    label: "Beard and mustache modeling",
  },
  {
    value: "Beard procedures - Beard Care - beard styling",
    label: "Beard styling",
  },
  {
    value: "Beard procedures - Beard Care - covering grey hair",
    label: "Covering grey hair",
  },
  {
    value: "Beard procedures - Beard Care - beard coloring",
    label: "Beard coloring",
  },
  {
    value: "Makeup",
    label: "Makeup",
  },
  {
    value: "Makeup - Makeup - makeup",
    label: "Makeup - Makeup - makeup",
  },
  {
    value: "Makeup - evening makeup - evening makeup",
    label: "Evening makeup",
  },
  {
    value: "Makeup - Wedding makeup - Wedding makeup",
    label: "Wedding makeup",
  },
  {
    value: "Makeup - Smoke eye makeup - Smoke eye makeup",
    label: "Smoke eye makeup",
  },
  {
    value: "Makeup - face lift makeup - face lift makeup",
    label: "Face lift makeup",
  },
  {
    value: "Makeup - stage makeup - stage makeup",
    label: "Stage makeup",
  },
  {
    value: "Makeup - Business makeup - Business makeup",
    label: "Business makeup",
  },
];
const proceduresOptionsRu = [
  {
    value: "Hairdressing procedures",
    label: "Парикмахерские услуги",
  },
  {
    value: "Hairdressing procedures - hair cut",
    label: "Стрижка",
  },
  {
    value: "Hairdressing procedures - hair cut - hair cut for woman",
    label: "Стрижка женская",
  },
  {
    value: "Hairdressing procedures - hair cut - hair cut for man",
    label: "Стрижка мужская",
  },
  {
    value: "Hairdressing procedures - hair cut - hair cut for children",
    label: "Стрижка детская",
  },
  {
    value:
      "Hairdressing procedures - hair cut - Hair cutting with hot scissors",
    label: "Стрижка горячими ножницами",
  },
  {
    value: "Hairdressing procedures - hair coloring",
    label: "окрашивание",
  },
  {
    value: "Hairdressing procedures - hair coloring - Classic hair coloring",
    label: "Классическое окрашивание",
  },
  {
    value: "Hairdressing procedures - hair coloring - Partial hair coloring",
    label: "Частичное окрашивание",
  },
  {
    value:
      "Hairdressing procedures - hair coloring - coloring the roots of the hair",
    label: "Окрашивание корней",
  },
  {
    value: "Hairdressing procedures - hair coloring - Hair toning",
    label: "тонирование",
  },
  {
    value: "Hairdressing procedures - hair coloring - Hair highlighting",
    label: "мелирование",
  },
  {
    value: "Hairdressing procedures - hair coloring - hair lightening",
    label: "блондирование",
  },
  {
    value: "Hairdressing procedures - hair coloring - Ombre",
    label: "омбре",
  },
  {
    value: "Hairdressing procedures - hair coloring - Air Touch",
    label: "Air Touch",
  },
  {
    value: "Hairdressing procedures - hair coloring - Decapitation",
    label: "Декапирование",
  },
  {
    value: "Hairdressing procedures - hair curling - hair curling",
    label: "Завивка",
  },
  {
    value: "Hairdressing procedures - hair curling - Chemical hair curling",
    label: "Завивка Химическая",
  },
  {
    value: "Hairdressing procedures - hair curling - Bio curling",
    label: "Завивка Биозавивка",
  },
  {
    value: "Hairdressing procedures - hair care",
    label: "уход за волосами",
  },
  {
    value: "Hairdressing procedures - hair care - hair washing",
    label: "Мытьё головы ",
  },
  {
    value: "Hairdressing procedures - hair care - hair botox",
    label: "Ботокс для волос",
  },
  {
    value: "Hairdressing procedures - hair care - keratin treatment",
    label: "Кератиновое восстановление",
  },
  {
    value: "Hairdressing procedures - hair care - hair polishing",
    label: "Полировка волос",
  },
  {
    value: "Hairdressing procedures - hair care - Hair lamination",
    label: "Ламинирование волос",
  },
  {
    value: "Hairdressing procedures - hair care - Hair Therapy Wrap",
    label: "Горячее обертывание",
  },
  {
    value: "Hairdressing procedures - hair care - Hair biorevitalization",
    label: "Биоревитализация волос",
  },
  {
    value: "Hairdressing procedures - hair care - nanoplastia hair treatment",
    label: "Нанопластика",
  },
  {
    value: "Hairdressing procedures - hair care - Head massage",
    label: "Массаж головы",
  },
  {
    value: "Hairdressing procedures - hair decoration",
    label: "Оформление волос",
  },
  {
    value: "Hairdressing procedures - hair decoration - hair style",
    label: "Прически",
  },
  {
    value: "Hairdressing procedures - hair decoration - Hair placement",
    label: "Укладки",
  },
  {
    value: "Hairdressing procedures - hair decoration - Hair braids",
    label: "Плетения",
  },
  {
    value: "Hairdressing procedures - hair decoration - hair extension",
    label: "Наращивание",
  },
  {
    value: "Hairdressing procedures - hair decoration -  African braids",
    label: "африканские косички",
  },
  {
    value: "Hairdressing procedures - hair decoration - Dreads",
    label: "Дреды",
  },
  {
    value: "Permanent Makeup",
    label: "Перманентный макияж",
  },
  {
    value:
      "Permanent Makeup - permanent eyebrow makeup - permanent eyebrow makeup",
    label: "Перманентный макияж бровей ",
  },
  {
    value: "Permanent Makeup - permanent lip makeup - permanent lip makeup",
    label: "Перманентный макияж губ",
  },
  {
    value:
      "Permanent Makeup - permanent eyelid makeup - permanent eyelid makeup",
    label: "Перманентный макияж век",
  },
  {
    value: "Permanent Makeup - microblading - microblading",
    label: "Микроблейдинг",
  },
  {
    value: "Permanent Makeup - Powdered brows - Powdered brows",
    label: "Пудровое напыление бровей",
  },
  {
    value:
      "Permanent Makeup - removing permanent make-up - removing permanent make-up",
    label: "Удаление перманента",
  },
  {
    value: "spa",
    label: "SPA",
  },
  {
    value: "Spa - Face SPA - Face SPA",
    label: "Процедуры для лица",
  },
  {
    value: "Spa - Body SPA - Body SPA",
    label: "Процедуры для тела",
  },
  {
    value:
      "Spa - body shaping and figure correction - body shaping and figure correction",
    label: "Коррекция фигуры",
  },
  {
    value: "Spa - SPA programs - SPA programs",
    label: "SPA-программы",
  },
  {
    value: "Spa - massage",
    label: "Массажи",
  },
  {
    value: "Spa - massage - LPG massage",
    label: "LPG массаж",
  },
  {
    value: "Spa - massage - SPA massage",
    label: "СПА-массаж",
  },
  {
    value: "Spa - massage - pressotherapy",
    label: "Прессотерапия",
  },
  {
    value: "Spa - massage - Lymphatic Drainage Massage",
    label: "Лимфодренажный массаж",
  },
  {
    value: "Spa - massage - manual massage",
    label: "Ручной массаж",
  },
  {
    value: "Spa - massage - anti cellulite massage",
    label: "Антицеллюлитный массаж",
  },
  {
    value: "Spa - massage - face massage",
    label: "Массаж лица",
  },
  {
    value: "Piercing",
    label: "Пирсинг",
  },
  {
    value: "Piercing - ear piercing - ear piercing",
    label: "Прокалывание ушей",
  },
  {
    value: "Piercing - ear piercing for kids - ear piercing for kids",
    label: "Прокол ушей ребенку",
  },
  {
    value: "Piercing - face piercing - face piercing",
    label: "Пирсинг лица",
  },
  {
    value: "Piercing - body piercing - body piercing",
    label: "Пирсинг тела",
  },
  {
    value: "Tattoo",
    label: "Tattoo",
  },
  {
    value: "Tattoo - Tattoo skatches - Tattoo skatches",
    label: "Разработка эскиза",
  },
  {
    value: "Tattoo - Tattoo - Tattoo",
    label: "Нанесение татуировки",
  },
  {
    value: "Tattoo - tattoo correction - tattoo correction",
    label: "Коррекция старых татуировок",
  },
  {
    value: "Tattoo - covering up scares - covering up scares",
    label: "Перекрытие шрамов",
  },
  {
    value: "Tattoo - Laser Tattoo Removal - Laser Tattoo Removal",
    label: "Лазерное удаление татуировок и татуажа",
  },
  {
    value: "Solarium",
    label: "Солярий",
  },
  {
    value: "Solarium - vertical sunbed - vertical sunbed",
    label: "Вертикальный",
  },
  {
    value: "Solarium - horizontal sunbed - horizontal sunbed",
    label: "Горизонтальный",
  },
  {
    value: "Cosmetology",
    label: "Косметология",
  },
  {
    value:
      "Cosmetology - hyperpigmentation treatmens - hyperpigmentation treatmens",
    label: "Лечение пигментации",
  },
  {
    value: "Cosmetology - Acne treatment - Acne treatment",
    label: "Лечение акне",
  },
  {
    value: "Cosmetology - Apparatus cosmetology",
    label: "Аппаратная косметология",
  },
  {
    value:
      "Cosmetology - Apparatus cosmetology - Apparatus cosmetology for face",
    label: "Аппаратная по лицу",
  },
  {
    value:
      "Cosmetology - Apparatus cosmetology - Apparatus cosmetology for body",
    label: "Аппаратная по телу",
  },
  {
    value: "Cosmetology - aesthetic cosmetology",
    label: "Эстетическая косметология",
  },
  {
    value: "Cosmetology - aesthetic cosmetology - peeling",
    label: "Пилинги",
  },
  {
    value: "Cosmetology - aesthetic cosmetology - face cleansing",
    label: "Чистка лица",
  },
  {
    value: "Cosmetology - aesthetic cosmetology - cosmetic care",
    label: "Уходы косметологические",
  },
  {
    value: "Cosmetology - injection cosmetology",
    label: "Инъекционная косметология",
  },
  {
    value: "Cosmetology - injection cosmetology - Biorevitalization",
    label: "Биоревитализация",
  },
  {
    value: "Cosmetology - injection cosmetology - Mesotherapy",
    label: "Мезотерапия",
  },
  {
    value: "Cosmetology - injection cosmetology - contouring plastic",
    label: "Контурная пластика",
  },
  {
    value: "Cosmetology - injection cosmetology - lip augmentation",
    label: "Увеличение губ",
  },
  {
    value: "Cosmetology - injection cosmetology - injections",
    label: "Инъекции",
  },
  {
    value: "Cosmetology - injection cosmetology - Botulinum therapy",
    label: "Ботулинотерапия",
  },
  {
    value: "Cosmetology - injection cosmetology - plasma therapy",
    label: "Плазмотерапия",
  },
  {
    value: "Cosmetology - injection cosmetology - collagen stimulation",
    label: "Коллагеностимуляция",
  },
  {
    value: "Cosmetology - injection cosmetology - Intim plastic",
    label: "Интимная пластика",
  },
  {
    value: "Cosmetology - injection cosmetology - Mesonites",
    label: "Мезонити",
  },
  {
    value: "Cosmetology - injection cosmetology - bio reinforcement",
    label: "Биоармирование",
  },
  {
    value: "Cosmetology - injection cosmetology - Bioreparation",
    label: "Биорепарация",
  },
  {
    value: "Cosmetology - laser cosmetology",
    label: "Лазерная косметология",
  },
  {
    value: "Cosmetology - laser cosmetology - Fractional rejuvenation",
    label: "Фракционное омоложение",
  },
  {
    value: "Cosmetology - laser cosmetology - mole removal",
    label: "Удаление новообразований",
  },
  {
    value:
      "Cosmetology - laser cosmetology - Removal of stretch marks and scars",
    label: "Удаление растяжек и рубцов",
  },
  {
    value: "Cosmetology - laser cosmetology - laser Biorevitalization",
    label: "Биоревитализация лазером",
  },
  {
    value: "Cosmetology - laser cosmetology - photo rejuvenation",
    label: "Фотоомоложение",
  },
  {
    value: "Cosmetology - laser cosmetology - tattoo removal",
    label: "Удаление татуировок",
  },
  {
    value: "Epilation",
    label: "Эпиляция",
  },
  {
    value: "Epilation - Civil depilation - Civil depilation",
    label: "Восковая депиляция",
  },
  {
    value: "Epilation - sugar hair removal - sugar hair removal",
    label: "Шугаринг",
  },
  {
    value: "Epilation - laser hair removal - laser hair removal",
    label: "Лазерная эпиляция",
  },
  {
    value: "Epilation - Geling hair removal - Geling hair removal",
    label: "Гелинг",
  },
  {
    value: "Nail procedures",
    label: "Ногтевой сервис",
  },
  {
    value: "Nail procedures - manicure",
    label: "Маникюр",
  },
  {
    value: "Nail procedures - manicure - classic manicure",
    label: "Маникюр классический",
  },
  {
    value: "Nail procedures - manicure - apparate manicure",
    label: "Маникюр аппаратный",
  },
  {
    value: "Nail procedures - manicure - Spa manicure",
    label: "SPA-маникюр",
  },
  {
    value: "Nail procedures - manicure - Combined manicure",
    label: "Маникюр комбинированный",
  },
  {
    value: "Nail procedures - manicure - men's Manicure",
    label: "Маникюр мужской",
  },
  {
    value: "Nail procedures - manicure - Hot manicure",
    label: "Горячий маникюр",
  },
  {
    value: "Nail procedures - manicure - Japanese Manicure",
    label: "Японский маникюр",
  },
  {
    value: "Nail procedures - manicure - European manicure",
    label: "Маникюр европейский",
  },
  {
    value: "Nail procedures - manicure - nail shape correction",
    label: "Коррекция формы ногтей",
  },
  {
    value: "Nail procedures - manicure - nail polishing",
    label: "Полировка ногтей",
  },
  {
    value: "Nail procedures - Pedicure",
    label: "Педикюр",
  },
  {
    value: "Nail procedures - Pedicure - classic pedicure",
    label: "Педикюр классический обрезной",
  },
  {
    value: "Nail procedures - Pedicure - Hardware pedicure",
    label: "Педикюр аппаратный",
  },
  {
    value: "Nail procedures - Pedicure - Combined pedicure",
    label: "Педикюр комбинированный",
  },
  {
    value: "Nail procedures - Pedicure - Spa pedicure",
    label: "SPA-педикюр",
  },
  {
    value: "Nail procedures - Pedicure - men’s pedicure",
    label: "Педикюр мужской",
  },
  {
    value: "Nail procedures - Pedicure - European pedicure",
    label: "Педикюр европейский",
  },
  {
    value: "Nail procedures - Pedicure - toenails shape correction",
    label: "Коррекция формы ногтей",
  },
  {
    value: "Nail procedures - nail design",
    label: "Дизайн ногтей",
  },
  {
    value: "Nail procedures - nail design - nail polish",
    label: "Покрытие лаком",
  },
  {
    value: "Nail procedures - nail design - nail polish removal",
    label: "Снятие лака",
  },
  {
    value: "Nail procedures - nail design - painting on nails",
    label: "Художественная роспись",
  },
  {
    value: "Nail procedures - nail design - Rhinestones",
    label: "Стразы",
  },
  {
    value: "Nail procedures - nail design - nail piercing",
    label: "Пирсинг",
  },
  {
    value: "Nail procedures - nail design - 3d nail design",
    label: "Объемный дизайн",
  },
  {
    value: "Nail procedures - nail design - Nail gel polish",
    label: "Покрытие гелевым лаком",
  },
  {
    value: "Nail procedures - nail design - gel polish removal",
    label: "Снятие гелевого лака",
  },
  {
    value: "Nail procedures - nail extension",
    label: "Наращивание ногтей",
  },
  {
    value: "Nail procedures - nail extension - nail fixing",
    label: "Ремонт ногтя",
  },
  {
    value: "Nail procedures - nail extension - nail extension",
    label: "Наращивание ногтей на руках",
  },
  {
    value: "Nail procedures - nail extension - toe nail extension",
    label: "Наращивание ногтей",
  },
  {
    value: "Nail procedures - nail extension - Nail strengthening",
    label: "Укрепление ногтей",
  },
  {
    value: "Nail procedures - nail extension - nail correction",
    label: "Коррекция ногтей",
  },
  {
    value: "Nail procedures - nail extension - Removal of artificial nails",
    label: "Снятие искусственных ногтей",
  },
  {
    value: "Nail procedures - Nail care",
    label: "Уход ногтей",
  },
  {
    value: "Nail procedures - Nail care - hand massage",
    label: "Массаж рук",
  },
  {
    value: "Nail procedures - Nail care - Hand Spa Treatment",
    label: "Спа-уход для рук",
  },
  {
    value: "Nail procedures - Nail care - foot Spa Treatment",
    label: "Спа-уход для ног",
  },
  {
    value: "Nail procedures - nail care - peeling",
    label: "Пилинг",
  },
  {
    value: "Nail procedures - podology",
    label: "Подология",
  },
  {
    value: "Nail procedures - podology - medical pedicure",
    label: "Медицинский педикюр",
  },
  {
    value: "Nail procedures - podology - ingrown nail treatment",
    label: "Лечение вросшего ногтя",
  },
  {
    value: "Nail procedures - podology - nail fungus treatment",
    label: "Лечение грибка",
  },
  {
    value: "Eyebrows and Eyelashes",
    label: "Брови и ресницы",
  },
  {
    value: "Eyebrows and Eyelashes - brow correction",
    label: "Коррекция бровей",
  },
  {
    value:
      "Eyebrows and Eyelashes - brow correction - brow correction with a thread",
    label: "Тридинг (коррекция нитью)",
  },
  {
    value:
      "Eyebrows and Eyelashes - brow correction - brow correction with wax",
    label: "Коррекция бровей воском",
  },
  {
    value:
      "Eyebrows and Eyelashes - brow correction - brow correction with tweezer",
    label: "Коррекция пинцетом",
  },
  {
    value: "Eyebrows and Eyelashes - brow correction - Brow thinning",
    label: "Прореживание бровей",
  },
  {
    value: "Eyebrows and Eyelashes - eyebrows and eyelashes coloring",
    label: "Окрашивание",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes coloring - Eyebrow coloring",
    label: "Окрашивание бровей краской",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes coloring - Eyelash coloring",
    label: "Окрашивание ресниц краской",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes coloring - Eyebrow coloring with henna",
    label: "Окрашивание хной",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes coloring - Eyebrow lighting",
    label: "Осветление бровей",
  },
  {
    value: "Eyebrows and Eyelashes - eyebrows and eyelashes Lamination",
    label: "Ламинирование",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes Lamination - Brow lamination",
    label: "Ламинирование бровей",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes Lamination - Lash lamination",
    label: "Ламинирование ресниц ",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes Lamination - Brow flexing",
    label: "Флексинг бровей",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes Lamination - Lash flexing",
    label: "Флексинг ресниц",
  },
  {
    value: "Eyebrows and Eyelashes - lash extension - lash extension",
    label: "Наращивание ресниц",
  },
  {
    value: "Eyebrows and Eyelashes - brow extension - brow extension",
    label: "Наращивание бровей",
  },
  {
    value: "Beard procedures",
    label: "Процедуры для бороды",
  },
  {
    value: "Beard procedures - Beard Care",
    label: "Уход за бородой",
  },
  {
    value: "Beard procedures - Beard Care - beard trimming",
    label: "стрижка",
  },
  {
    value: "Beard procedures - Beard Care - shaving",
    label: "бритье",
  },
  {
    value: "Beard procedures - Beard Care - beard and mustache modeling",
    label: "моделирование бороды и усов",
  },
  {
    value: "Beard procedures - Beard Care - beard styling",
    label: "стайлинг",
  },
  {
    value: "Beard procedures - Beard Care - covering grey hair",
    label: "камуфляж седины",
  },
  {
    value: "Beard procedures - Beard Care - beard coloring",
    label: "Окрашивание бороды",
  },
  {
    value: "Makeup",
    label: "Макияж",
  },
  {
    value: "Makeup - Makeup - makeup",
    label: "Макияж - Макияж - Макияж",
  },
  {
    value: "Makeup - evening makeup - evening makeup",
    label: "Вечерний макияж",
  },
  {
    value: "Makeup - Wedding makeup - Wedding makeup",
    label: "Свадебный макияж",
  },
  {
    value: "Makeup - Smoke eye makeup - Smoke eye makeup",
    label: "Smoky eyes",
  },
  {
    value: "Makeup - face lift makeup - face lift makeup",
    label: "Лифтинг-макияж",
  },
  {
    value: "Makeup - stage makeup - stage makeup",
    label: "Театральный макияж",
  },
  {
    value: "Makeup - Business makeup - Business makeup",
    label: "Деловой макияж",
  },
];
const proceduresOptionsKa = [
  {
    value: "Hairdressing procedures",
    label: "თმის პროცედურები",
  },
  {
    value: "Hairdressing procedures - hair cut",
    label: "თმის შეჭრა",
  },
  {
    value: "Hairdressing procedures - hair cut - hair cut for woman",
    label: "თმის შეჭრა ქალებისთვის",
  },
  {
    value: "Hairdressing procedures - hair cut - hair cut for man",
    label: "თმის შეჭრა მამაკაცებისთვის",
  },
  {
    value: "Hairdressing procedures - hair cut - hair cut for children",
    label: "თმის შეჭრა ბავშვებისთვის",
  },
  {
    value:
      "Hairdressing procedures - hair cut - Hair cutting with hot scissors",
    label: "თმის შეჭრა ცხელი მაკრატლით",
  },
  {
    value: "Hairdressing procedures - hair coloring",
    label: "თმის შეღებვა",
  },
  {
    value: "Hairdressing procedures - hair coloring - Classic hair coloring",
    label: "თმის კლასიკური შეღებვა",
  },
  {
    value: "Hairdressing procedures - hair coloring - Partial hair coloring",
    label: "თმის ნაწილობრივ შეღებვა",
  },
  {
    value:
      "Hairdressing procedures - hair coloring - coloring the roots of the hair",
    label: "თმის ძირების შეღებვა",
  },
  {
    value: "Hairdressing procedures - hair coloring - Hair toning",
    label: "თმის ტონირება",
  },
  {
    value: "Hairdressing procedures - hair coloring - Hair highlighting",
    label: "თმის მელირება",
  },
  {
    value: "Hairdressing procedures - hair coloring - hair lightening",
    label: "თმის გაღიავება",
  },
  {
    value: "Hairdressing procedures - hair coloring - Ombre",
    label: "ომბრე",
  },
  {
    value: "Hairdressing procedures - hair coloring - Air Touch",
    label: "აირთაჩი",
  },
  {
    value: "Hairdressing procedures - hair coloring - Decapitation",
    label: "დეკაპირება",
  },
  {
    value: "Hairdressing procedures - hair curling - hair curling",
    label: "თმის დახვევა",
  },
  {
    value: "Hairdressing procedures - hair curling - Chemical hair curling",
    label: "თმის ქიმიური დახვევა",
  },
  {
    value: "Hairdressing procedures - hair curling - Bio curling",
    label: "თმის ბიო დახვევა",
  },
  {
    value: "Hairdressing procedures - hair care",
    label: "თმის მოვლა",
  },
  {
    value: "Hairdressing procedures - hair care - hair washing",
    label: "თმის დაბანა",
  },
  {
    value: "Hairdressing procedures - hair care - hair botox",
    label: "თმის ბოტოქსი",
  },
  {
    value: "Hairdressing procedures - hair care - keratin treatment",
    label: "თმის კერატინის აღდგენა",
  },
  {
    value: "Hairdressing procedures - hair care - hair polishing",
    label: "თმის გაპრიალება",
  },
  {
    value: "Hairdressing procedures - hair care - Hair lamination",
    label: "თმის ლამინირება",
  },
  {
    value: "Hairdressing procedures - hair care - Hair Therapy Wrap",
    label: "თმის ცხელი შეფუთვა",
  },
  {
    value: "Hairdressing procedures - hair care - Hair biorevitalization",
    label: "თმის ბიორევიტალიზაცია",
  },
  {
    value: "Hairdressing procedures - hair care - nanoplastia hair treatment",
    label: "თმის ნანოპლასტიკა",
  },
  {
    value: "Hairdressing procedures - hair care - Head massage",
    label: "თავის მასაჟი",
  },
  {
    value: "Hairdressing procedures - hair decoration",
    label: "თმის გაფორმება",
  },
  {
    value: "Hairdressing procedures - hair decoration - hair style",
    label: "თმის ვარცხნილობა",
  },
  {
    value: "Hairdressing procedures - hair decoration - Hair placement",
    label: "თმის გასწორება",
  },
  {
    value: "Hairdressing procedures - hair decoration - Hair braids",
    label: "თმის დაბწნა",
  },
  {
    value: "Hairdressing procedures - hair decoration - hair extension",
    label: "თმის დაგრძელება",
  },
  {
    value: "Hairdressing procedures - hair decoration -  African braids",
    label: "აფრიკული ნაწნავები",
  },
  {
    value: "Hairdressing procedures - hair decoration - Dreads",
    label: "დრედები",
  },
  {
    value: "Permanent Makeup",
    label: "პემანენტული მაკიაჟი",
  },
  {
    value:
      "Permanent Makeup - permanent eyebrow makeup - permanent eyebrow makeup",
    label: "პერმანენტული წარბების მაკიაჟი",
  },
  {
    value: "Permanent Makeup - permanent lip makeup - permanent lip makeup",
    label: "პერმანენტული ტუჩების მაკიაჟი",
  },
  {
    value:
      "Permanent Makeup - permanent eyelid makeup - permanent eyelid makeup",
    label: "პერმანენტული თვალის მაკიაჟი",
  },
  {
    value: "Permanent Makeup - microblading - microblading",
    label: "მიკრობლენდინგი",
  },
  {
    value: "Permanent Makeup - Powdered brows - Powdered brows",
    label: "დაპუდვრა",
  },
  {
    value:
      "Permanent Makeup - removing permanent make-up - removing permanent make-up",
    label: "პერმანენტული მაკიაჟის მოშორება",
  },
  {
    value: "SPA",
    label: "სპა",
  },
  {
    value: "Spa - Face SPA - Face SPA",
    label: "სპა სახის პროცედურები",
  },
  {
    value: "Spa - Body SPA - Body SPA",
    label: "სპა სხეულის პროცედურები",
  },
  {
    value:
      "Spa - body shaping and figure correction - body shaping and figure correction",
    label: "ფიგურის კორექცია",
  },
  {
    value: "Spa - SPA programs - SPA programs",
    label: "სპა პროგრამები",
  },
  {
    value: "Spa - massage",
    label: "მასაჟი",
  },
  {
    value: "Spa - massage - LPG massage",
    label: "ლგპ მასაჟი",
  },
  {
    value: "Spa - massage - SPA massage",
    label: "სპა მასაჟი",
  },
  {
    value: "Spa - massage - pressotherapy",
    label: "პრესოთერაპია",
  },
  {
    value: "Spa - massage - Lymphatic Drainage Massage",
    label: "ლიმფური სადრენაჟო მასაჟი",
  },
  {
    value: "Spa - massage - manual massage",
    label: "მექანიკური მასაჟი",
  },
  {
    value: "Spa - massage - anti cellulite massage",
    label: "ანტიცელულიტური მასაჟი",
  },
  {
    value: "Spa - massage - face massage",
    label: "სახის მასაჟი",
  },
  {
    value: "Piercing",
    label: "პირსინგი",
  },
  {
    value: "Piercing - ear piercing - ear piercing",
    label: "ყურის პირსინგი",
  },
  {
    value: "Piercing - ear piercing for kids - ear piercing for kids",
    label: "ყურის პირსინგი ბავშვისთვის",
  },
  {
    value: "Piercing - face piercing - face piercing",
    label: "სახის პირსინგი",
  },
  {
    value: "Piercing - body piercing - body piercing",
    label: "ტანის პირსინგი",
  },
  {
    value: "Tattoo",
    label: "ტატუ",
  },
  {
    value: "Tattoo - Tattoo skatches - Tattoo skatches",
    label: "ტატუს ესკიზის მომზადება",
  },
  {
    value: "Tattoo - Tattoo - Tattoo",
    label: "ტატუირება",
  },
  {
    value: "Tattoo - tattoo correction - tattoo correction",
    label: "ძველი ტატუების გასწორება",
  },
  {
    value: "Tattoo - covering up scares - covering up scares",
    label: "ნაიარევის გადაფარვა",
  },
  {
    value: "Tattoo - Laser Tattoo Removal - Laser Tattoo Removal",
    label: "ტატუს ლაზერული მოშორება",
  },
  {
    value: "Solarium",
    label: "სოლარიუმი",
  },
  {
    value: "Solarium - vertical sunbed - vertical sunbed",
    label: "ვერტიკალური სოლარიუმი",
  },
  {
    value: "Solarium - horizontal sunbed - horizontal sunbed",
    label: "ჰორიზონტალური სოლარიუმი",
  },
  {
    value: "Cosmetology",
    label: "კოსმეტოლოგია",
  },
  {
    value:
      "Cosmetology - hyperpigmentation treatmens - hyperpigmentation treatmens",
    label: "პიგმენტების მკურნალობა",
  },
  {
    value: "Cosmetology - Acne treatment - Acne treatment",
    label: "აკნეს მკურნალობა",
  },
  {
    value: "Cosmetology - Apparatus cosmetology",
    label: "აპარატურული კოსმეტოლოგია",
  },
  {
    value:
      "Cosmetology - Apparatus cosmetology - Apparatus cosmetology for face",
    label: "აპარატურული კოსმეტოლოგია სახისთვის",
  },
  {
    value:
      "Cosmetology - Apparatus cosmetology - Apparatus cosmetology for body",
    label: "აპარატურული კოსმეტოლოგია სხეულისთვის",
  },
  {
    value: "Cosmetology - aesthetic cosmetology",
    label: "ესთეტიკური კოსმეტოლოგია",
  },
  {
    value: "Cosmetology - aesthetic cosmetology - peeling",
    label: "პილინგი",
  },
  {
    value: "Cosmetology - aesthetic cosmetology - face cleansing",
    label: "სახის გაწმენდა",
  },
  {
    value: "Cosmetology - aesthetic cosmetology - cosmetic care",
    label: "კოსმეტოლოგიური მოვლა",
  },
  {
    value: "Cosmetology - injection cosmetology",
    label: "საინექციო კოსმეტოლოგია",
  },
  {
    value: "Cosmetology - injection cosmetology - Biorevitalization",
    label: "ბიორევიტალიზაცია",
  },
  {
    value: "Cosmetology - injection cosmetology - Mesotherapy",
    label: "მეზოთერაპია",
  },
  {
    value: "Cosmetology - injection cosmetology - contouring plastic",
    label: "კონტურული პლასტიკა",
  },
  {
    value: "Cosmetology - injection cosmetology - lip augmentation",
    label: "ტუჩის გადიდება",
  },
  {
    value: "Cosmetology - injection cosmetology - injections",
    label: "ინექციები",
  },
  {
    value: "Cosmetology - injection cosmetology - Botulinum therapy",
    label: "ბოტულინოთერაპია",
  },
  {
    value: "Cosmetology - injection cosmetology - plasma therapy",
    label: "პლაზმური თერაპია",
  },
  {
    value: "Cosmetology - injection cosmetology - collagen stimulation",
    label: "კოლაგენის სტიმულაცია",
  },
  {
    value: "Cosmetology - injection cosmetology - Intim plastic",
    label: "ინტიმური პლასტიკა",
  },
  {
    value: "Cosmetology - injection cosmetology - Mesonites",
    label: "მეზონიტები",
  },
  {
    value: "Cosmetology - injection cosmetology - bio reinforcement",
    label: "ბიო არმირება",
  },
  {
    value: "Cosmetology - injection cosmetology - Bioreparation",
    label: "ბიორეპარაცია",
  },
  {
    value: "Cosmetology - laser cosmetology",
    label: "ლაზერული კოსმეტოლოგია",
  },
  {
    value: "Cosmetology - laser cosmetology - Fractional rejuvenation",
    label: "ფრაქციული გაახალგაზრდავება",
  },
  {
    value: "Cosmetology - laser cosmetology - mole removal",
    label: "ხალების მოცილება",
  },
  {
    value:
      "Cosmetology - laser cosmetology - Removal of stretch marks and scars",
    label: "სტრიების და ნაწიბურების მოცილება",
  },
  {
    value: "Cosmetology - laser cosmetology - laser Biorevitalization",
    label: "ბიორევიტალიზაცია ლაზერით",
  },
  {
    value: "Cosmetology - laser cosmetology - photo rejuvenation",
    label: "ფოტოგაახალგაზრდავება",
  },
  {
    value: "Cosmetology - laser cosmetology - tattoo removal",
    label: "ტატუს მოცილება",
  },
  {
    value: "Epilation",
    label: "ეპილაცია",
  },
  {
    value: "Epilation - Civil depilation - Civil depilation",
    label: "ცვილით დეპილაცია",
  },
  {
    value: "Epilation - sugar hair removal - sugar hair removal",
    label: "შუგარინგი",
  },
  {
    value: "Epilation - laser hair removal - laser hair removal",
    label: "ლაზერული ეპილაცია",
  },
  {
    value: "Epilation - Geling hair removal - Geling hair removal",
    label: "გელინგი",
  },
  {
    value: "Nail procedures",
    label: "ფრჩხილების პროცედურები",
  },
  {
    value: "Nail procedures - manicure",
    label: "მანიკური",
  },
  {
    value: "Nail procedures - manicure - classic manicure",
    label: "კლასიკური მანიკური",
  },
  {
    value: "Nail procedures - manicure - apparate manicure",
    label: "აპარატული მანიკური",
  },
  {
    value: "Nail procedures - manicure - Spa manicure",
    label: "სპა მანიკური",
  },
  {
    value: "Nail procedures - manicure - Combined manicure",
    label: "კომბინირებული მანიკური",
  },
  {
    value: "Nail procedures - manicure - men's Manicure",
    label: "მამაკაცის მანიკური",
  },
  {
    value: "Nail procedures - manicure - Hot manicure",
    label: "ცხელი მანიკური",
  },
  {
    value: "Nail procedures - manicure - Japanese Manicure",
    label: "იაპონური მანიკური",
  },
  {
    value: "Nail procedures - manicure - European manicure",
    label: "ევროპული მანიკური",
  },
  {
    value: "Nail procedures - manicure - nail shape correction",
    label: "ფრჩხილების ფორმის კორექცია",
  },
  {
    value: "Nail procedures - manicure - nail polishing",
    label: "ფრჩხილების გაპრიალება",
  },
  {
    value: "Nail procedures - Pedicure",
    label: "პედიკური",
  },
  {
    value: "Nail procedures - Pedicure - classic pedicure",
    label: "კლასიკური პედიკური",
  },
  {
    value: "Nail procedures - Pedicure - Hardware pedicure",
    label: "აპარატული პედიკური",
  },
  {
    value: "Nail procedures - Pedicure - Combined pedicure",
    label: "კომბინირებული პედიკური",
  },
  {
    value: "Nail procedures - Pedicure - Spa pedicure",
    label: "სპა პედიკური",
  },
  {
    value: "Nail procedures - Pedicure - men’s pedicure",
    label: "მამაკაცის პედიკური",
  },
  {
    value: "Nail procedures - Pedicure - European pedicure",
    label: "ევროპული პედიკური",
  },
  {
    value: "Nail procedures - Pedicure - toenails shape correction",
    label: "ფეხის ფრჩხილების კორექცია",
  },
  {
    value: "Nail procedures - nail design",
    label: "ფრჩხილების დიზაინი",
  },
  {
    value: "Nail procedures - nail design - nail polish",
    label: "ფრჩხილების ლაქირება",
  },
  {
    value: "Nail procedures - nail design - nail polish removal",
    label: "ფჩხილების ლაქის მოცილება",
  },
  {
    value: "Nail procedures - nail design - painting on nails",
    label: "ფრჩხილებზე მხატვრობა",
  },
  {
    value: "Nail procedures - nail design - Rhinestones",
    label: "თვლები, კრისტალები",
  },
  {
    value: "Nail procedures - nail design - nail piercing",
    label: "ფრჩხილების პირსინგი",
  },
  {
    value: "Nail procedures - nail design - 3d nail design",
    label: "ფრჩხილების მოცულობითი დიზაინი",
  },
  {
    value: "Nail procedures - nail design - Nail gel polish",
    label: "ფრჩხილების ლაქირება გელით",
  },
  {
    value: "Nail procedures - nail design - gel polish removal",
    label: "გელ ლაქის მოცილება",
  },
  {
    value: "Nail procedures - nail extension",
    label: "ფრჩხილების დაგრძელება",
  },
  {
    value: "Nail procedures - nail extension - nail fixing",
    label: "ფრჩხილების შეკეთება",
  },
  {
    value: "Nail procedures - nail extension - nail extension",
    label: "ხელის ფრჩხილების დაგრძელება",
  },
  {
    value: "Nail procedures - nail extension - toe nail extension",
    label: "ფეხის ფრჩხილების დაგრძელება",
  },
  {
    value: "Nail procedures - nail extension - Nail strengthening",
    label: "ფრჩილების გამაგრება",
  },
  {
    value: "Nail procedures - nail extension - nail correction",
    label: "ფრჩხილების კორექცია",
  },
  {
    value: "Nail procedures - nail extension - Removal of artificial nails",
    label: "ხელოვნური ფრჩხილების მოცილება",
  },
  {
    value: "Nail procedures - Nail care",
    label: "ფრჩხილების მოვლა",
  },
  {
    value: "Nail procedures - Nail care - hand massage",
    label: "ხელების მასაჟი",
  },
  {
    value: "Nail procedures - Nail care - Hand Spa Treatment",
    label: "სპა მოვლა ხელებისთვის",
  },
  {
    value: "Nail procedures - Nail care - foot Spa Treatment",
    label: "სპა მოვლა ფეხებისთვის",
  },
  {
    value: "Nail procedures - nail care - peeling",
    label: "პილინგი",
  },
  {
    value: "Nail procedures - podology",
    label: "პოდოლოგია",
  },
  {
    value: "Nail procedures - podology - medical pedicure",
    label: "სამედიცინო პედიკური",
  },
  {
    value: "Nail procedures - podology - ingrown nail treatment",
    label: "ჩაზრდილი ფრჩხილების მკურნალობა",
  },
  {
    value: "Nail procedures - podology - nail fungus treatment",
    label: "სოკოს მკურნალობა",
  },
  {
    value: "Eyebrows and Eyelashes",
    label: "წარბები და წამწამები",
  },
  {
    value: "Eyebrows and Eyelashes - brow correction",
    label: "წარბების კორექცია",
  },
  {
    value:
      "Eyebrows and Eyelashes - brow correction - brow correction with a thread",
    label: "წარბების ძაფით კორექცია",
  },
  {
    value:
      "Eyebrows and Eyelashes - brow correction - brow correction with wax",
    label: "წარბების ცვილით კორექცია",
  },
  {
    value:
      "Eyebrows and Eyelashes - brow correction - brow correction with tweezer",
    label: "წარბების პინცეტით კორექცია",
  },
  {
    value: "Eyebrows and Eyelashes - brow correction - Brow thinning",
    label: "წარბების შეთხელება",
  },
  {
    value: "Eyebrows and Eyelashes - eyebrows and eyelashes coloring",
    label: "წარბების და წამწამების შეღებვა",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes coloring - Eyebrow coloring",
    label: "წარბების შეღებვა",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes coloring - Eyelash coloring",
    label: "წამწამების შეღებვა",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes coloring - Eyebrow coloring with henna",
    label: "ხნით შეღებვა",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes coloring - Eyebrow lighting",
    label: "წარბების გაღიავება",
  },
  {
    value: "Eyebrows and Eyelashes - eyebrows and eyelashes Lamination",
    label: "წარბების და წამწამების ლამინირება",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes Lamination - Brow lamination",
    label: "წარბების ლამინირება",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes Lamination - Lash lamination",
    label: "წამწამების ლამინირება",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes Lamination - Brow flexing",
    label: "წარბების ფლექსინგი",
  },
  {
    value:
      "Eyebrows and Eyelashes - eyebrows and eyelashes Lamination - Lash flexing",
    label: "წამწამების ფლექსინგი",
  },
  {
    value: "Eyebrows and Eyelashes - lash extension - lash extension",
    label: "წამწამების დაგრძელება",
  },
  {
    value: "Eyebrows and Eyelashes - brow extension - brow extension",
    label: "წარბების დაგრძელება",
  },
  {
    value: "Beard procedures",
    label: "წვერის პროცედურები",
  },
  {
    value: "Beard procedures - Beard Care",
    label: "წვერსი მოვლა",
  },
  {
    value: "Beard procedures - Beard Care - beard trimming",
    label: "წვერსი შესწორება",
  },
  {
    value: "Beard procedures - Beard Care - shaving",
    label: "წვერის გაპარსვა",
  },
  {
    value: "Beard procedures - Beard Care - beard and mustache modeling",
    label: "წვერის და ულვაშების მოდელირება",
  },
  {
    value: "Beard procedures - Beard Care - beard styling",
    label: "წვერის სთაილინგი",
  },
  {
    value: "Beard procedures - Beard Care - covering grey hair",
    label: "ჭაღარა თმის შენიღბვა",
  },
  {
    value: "Beard procedures - Beard Care - beard coloring",
    label: "წვერის შეღებვა",
  },
  {
    value: "Makeup",
    label: "მაკიაჟი",
  },
  {
    value: "Makeup - Makeup - makeup",
    label: "მაკიაჟი - მაკიაჟი - მაკიაჟი",
  },
  {
    value: "Makeup - evening makeup - evening makeup",
    label: "საღამოს მაკიაჟი",
  },
  {
    value: "Makeup - Wedding makeup - Wedding makeup",
    label: "საქორწინო მაკიაჟი",
  },
  {
    value: "Makeup - Smoke eye makeup - Smoke eye makeup",
    label: "სმოუქ აი მაკიაჟი",
  },
  {
    value: "Makeup - face lift makeup - face lift makeup",
    label: "ლიფტინგ მაკიაჟი",
  },
  {
    value: "Makeup - stage makeup - stage makeup",
    label: "თეატრალური მაკიაჟი",
  },
  {
    value: "Makeup - Business makeup - Business makeup",
    label: "საქმიანი მაკიაჟი",
  },
];

// // working places
// export const workingPlacesOptions = [
//   { value: "Salon", en: "Salon", ka: "სალონი", ru: "" },
//   { value: "Studia", en: "Studia", ka: "სტუდია", ru: "" },
//   { value: "Clinic", en: "Clinic", ka: "კლინიკა", ru: "" },
//   { value: "On Address", en: "On Address", ka: "მისამართზე მისვლით", ru: "" },
// ];

// working days
export const workingDaysOptions = [
  {
    id: 0,
    en: "Monday-Friday",
    ka: "ორშაბათი-პარასკევი",
    ru: "Понедельник-Пятница",
    value: "workingDays",
  },
  {
    en: "Everyday",
    ka: "ყოველდღე",
    ru: "Каждый день",
    value: "everyDay",
    id: 1,
  },
  {
    en: "Monday",
    ka: "ორშაბათი",
    ru: "Понедельник",
    value: "monday",
    id: 2,
  },
  {
    en: "Tuesday",
    ka: "სამშაბათი",
    ru: "Вторник",
    value: "tuesday",
    id: 3,
  },
  {
    en: "Wednesday",
    ka: "ოთხშაბათი",
    ru: "Среда",
    value: "wednesday",
    id: 4,
  },
  {
    en: "Thursday",
    ka: "ხუთშაბათი",
    ru: "Четверг",
    value: "thursday",
    id: 5,
  },
  {
    en: "Friday",
    ka: "პარასკევი",
    ru: "Пятница",
    value: "friday",
    id: 6,
  },
  {
    en: "Saturday",
    ka: "შაბათი",
    ru: "Суббота",
    value: "saturday",
    id: 7,
  },
  {
    en: "Sunday",
    ka: "კვირა",
    ru: "Воскресенье",
    value: "sunday",
    id: 8,
  },
];

export const categoriesOptions = [];
