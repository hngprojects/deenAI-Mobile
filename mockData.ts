
export interface Surah {
  number: number;
  name: string; // Arabic name
  englishName: string;
  englishMeaning: string;
  verses: number;
  arabic: string[];
  transliteration: string[];
  translation: string[];
  progress?: number;
}


export type RootStackParamList = {
  Quran: undefined;
  SurahDetail: { surah: Surah };
};



export const surahs: Surah[] = [
  {
    number: 1,
    name: "الفاتحة",
    englishName: "Al-Fātiḥah",
    englishMeaning: "The Opening",
    verses: 7,
    arabic: [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "الرَّحْمَٰنِ الرَّحِيمِ",
      "مَالِكِ يَوْمِ الدِّينِ",
      "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ"
    ],
    transliteration: [
      "Bismillāhir-raḥmānir-raḥīm",
      "Al-ḥamdu lillāhi rabbil-‘ālamīn",
      "Ar-raḥmānir-raḥīm",
      "Māliki yawmid-dīn",
      "Iyyāka na‘budu wa iyyāka nasta‘īn",
      "Ihdinaṣ-ṣirāṭal-mustaqīm",
      "Ṣirāṭallaḏīna an‘amta ‘alayhim ġayril-maġḍūbi ‘alayhim wa laḍ-ḍāllīn"
    ],
    translation: [
      "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      "All praise is due to Allah, Lord of the worlds.",
      "The Entirely Merciful, the Especially Merciful.",
      "Sovereign of the Day of Recompense.",
      "It is You we worship and You we ask for help.",
      "Guide us to the straight path.",
      "The path of those upon whom You have bestowed favor, not of those who have earned Your anger nor of those who go astray."
    ]
  },
  {
    number: 2,
    name: "البقرة",
    englishName: "Al-Baqarah",
    englishMeaning: "The Cow",
    verses: 286,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 3,
    name: "آل عمران",
    englishName: "Āli 'Imrān",
    englishMeaning: "Family of Imran",
    verses: 200,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 4,
    name: "النساء",
    englishName: "An-Nisā",
    englishMeaning: "The Women",
    verses: 176,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 5,
    name: "المائدة",
    englishName: "Al-Mā'idah",
    englishMeaning: "The Table Spread",
    verses: 120,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 6,
    name: "الأنعام",
    englishName: "Al-An'ām",
    englishMeaning: "The Cattle",
    verses: 165,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 7,
    name: "الأعراف",
    englishName: "Al-A'rāf",
    englishMeaning: "The Heights",
    verses: 206,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 8,
    name: "الأنفال",
    englishName: "Al-Anfāl",
    englishMeaning: "The Spoils of War",
    verses: 75,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 9,
    name: "التوبة",
    englishName: "At-Tawbah",
    englishMeaning: "The Repentance",
    verses: 129,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 10,
    name: "يونس",
    englishName: "Yūnus",
    englishMeaning: "Jonah",
    verses: 109,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 11,
    name: "هود",
    englishName: "Hūd",
    englishMeaning: "Hud",
    verses: 123,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 12,
    name: "يوسف",
    englishName: "Yūsuf",
    englishMeaning: "Joseph",
    verses: 111,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 13,
    name: "الرعد",
    englishName: "Ar-Ra'd",
    englishMeaning: "The Thunder",
    verses: 43,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 14,
    name: "إبراهيم",
    englishName: "Ibrāhīm",
    englishMeaning: "Abraham",
    verses: 52,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 15,
    name: "الحجر",
    englishName: "Al-Ḥijr",
    englishMeaning: "The Rocky Tract",
    verses: 99,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 16,
    name: "النحل",
    englishName: "An-Naḥl",
    englishMeaning: "The Bee",
    verses: 128,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 17,
    name: "الإسراء",
    englishName: "Al-Isrā",
    englishMeaning: "The Night Journey",
    verses: 111,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 18,
    name: "الكهف",
    englishName: "Al-Kahf",
    englishMeaning: "The Cave",
    verses: 110,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 19,
    name: "مريم",
    englishName: "Maryam",
    englishMeaning: "Mary",
    verses: 98,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 20,
    name: "طه",
    englishName: "Ṭā-Hā",
    englishMeaning: "Ta-Ha",
    verses: 135,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 21,
    name: "الأنبياء",
    englishName: "Al-Anbiyā",
    englishMeaning: "The Prophets",
    verses: 112,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 22,
    name: "الحج",
    englishName: "Al-Ḥajj",
    englishMeaning: "The Pilgrimage",
    verses: 78,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 23,
    name: "المؤمنون",
    englishName: "Al-Mu'minūn",
    englishMeaning: "The Believers",
    verses: 118,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 24,
    name: "النور",
    englishName: "An-Nūr",
    englishMeaning: "The Light",
    verses: 64,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 25,
    name: "الفرقان",
    englishName: "Al-Furqān",
    englishMeaning: "The Criterion",
    verses: 77,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 26,
    name: "الشعراء",
    englishName: "Ash-Shu'arā",
    englishMeaning: "The Poets",
    verses: 227,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 27,
    name: "النمل",
    englishName: "An-Naml",
    englishMeaning: "The Ant",
    verses: 93,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 28,
    name: "القصص",
    englishName: "Al-Qaṣaṣ",
    englishMeaning: "The Stories",
    verses: 88,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 29,
    name: "العنكبوت",
    englishName: "Al-'Ankabūt",
    englishMeaning: "The Spider",
    verses: 69,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 30,
    name: "الروم",
    englishName: "Ar-Rūm",
    englishMeaning: "The Romans",
    verses: 60,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 31,
    name: "لقمان",
    englishName: "Luqmān",
    englishMeaning: "Luqman",
    verses: 34,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 32,
    name: "السجدة",
    englishName: "As-Sajdah",
    englishMeaning: "The Prostration",
    verses: 30,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 33,
    name: "الأحزاب",
    englishName: "Al-Aḥzāb",
    englishMeaning: "The Clans",
    verses: 73,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 34,
    name: "سبأ",
    englishName: "Sabā",
    englishMeaning: "Sheba",
    verses: 54,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 35,
    name: "فاطر",
    englishName: "Fāṭir",
    englishMeaning: "The Originator",
    verses: 45,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 36,
    name: "يس",
    englishName: "Yā-Sīn",
    englishMeaning: "Ya Sin",
    verses: 83,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 37,
    name: "الصافات",
    englishName: "Aṣ-Ṣāffāt",
    englishMeaning: "Those who set ranks",
    verses: 182,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 38,
    name: "ص",
    englishName: "Ṣād",
    englishMeaning: "Ṣād",
    verses: 88,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 39,
    name: "الزمر",
    englishName: "Az-Zumar",
    englishMeaning: "The Troops",
    verses: 75,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 40,
    name: "غافر",
    englishName: "Ghāfir",
    englishMeaning: "The Forgiver",
    verses: 85,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 41,
    name: "فصلت",
    englishName: "Fuṣṣilat",
    englishMeaning: "Detailed",
    verses: 54,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 42,
    name: "الشورى",
    englishName: "Ash-Shūraá",
    englishMeaning: "The Consultation",
    verses: 53,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 43,
    name: "الزخرف",
    englishName: "Az-Zukhruf",
    englishMeaning: "The Ornaments of Gold",
    verses: 89,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 44,
    name: "الدخان",
    englishName: "Ad-Dukhān",
    englishMeaning: "The Smoke",
    verses: 59,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 45,
    name: "الجاثية",
    englishName: "Al-Jāthiyah",
    englishMeaning: "The Kneeling",
    verses: 37,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 46,
    name: "الأحقاف",
    englishName: "Al-Aḥqāf",
    englishMeaning: "The Wind-Curved Sandhills",
    verses: 35,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 47,
    name: "محمد",
    englishName: "Muḥammad",
    englishMeaning: "Muhammad",
    verses: 38,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 48,
    name: "الفتح",
    englishName: "Al-Fatḥ",
    englishMeaning: "The Victory",
    verses: 29,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 49,
    name: "الحجرات",
    englishName: "Al-Ḥujurāt",
    englishMeaning: "The Private Apartments",
    verses: 18,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 50,
    name: "ق",
    englishName: "Qāf",
    englishMeaning: "Qāf",
    verses: 45,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 51,
    name: "الذاريات",
    englishName: "Adh-Dhāriyāt",
    englishMeaning: "The Winnowing Winds",
    verses: 60,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 52,
    name: "الطور",
    englishName: "Aṭ-Ṭūr",
    englishMeaning: "The Mount",
    verses: 49,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 53,
    name: "النجم",
    englishName: "An-Najm",
    englishMeaning: "The Star",
    verses: 62,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 54,
    name: "القمر",
    englishName: "Al-Qamar",
    englishMeaning: "The Moon",
    verses: 55,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 55,
    name: "الرحمن",
    englishName: "Ar-Raḥmān",
    englishMeaning: "The Most Merciful",
    verses: 78,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 56,
    name: "الواقعة",
    englishName: "Al-Wāqi'ah",
    englishMeaning: "The Event",
    verses: 96,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 57,
    name: "الحديد",
    englishName: "Al-Ḥadīd",
    englishMeaning: "The Iron",
    verses: 29,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 58,
    name: "المجادلة",
    englishName: "Al-Mujādilah",
    englishMeaning: "The Pleading Woman",
    verses: 22,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 59,
    name: "الحشر",
    englishName: "Al-Ḥashr",
    englishMeaning: "The Exile",
    verses: 24,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 60,
    name: "الممتحنة",
    englishName: "Al-Mumtaḥanah",
    englishMeaning: "She that is to be examined",
    verses: 13,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 61,
    name: "الصف",
    englishName: "Aṣ-Ṣaff",
    englishMeaning: "The Ranks",
    verses: 14,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 62,
    name: "الجمعة",
    englishName: "Al-Jumu'ah",
    englishMeaning: "The Congregation",
    verses: 11,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 63,
    name: "المنافقون",
    englishName: "Al-Munāfiqūn",
    englishMeaning: "The Hypocrites",
    verses: 11,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 64,
    name: "التغابن",
    englishName: "At-Taghābun",
    englishMeaning: "The Mutual Disillusion",
    verses: 18,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 65,
    name: "الطلاق",
    englishName: "Aṭ-Ṭalāq",
    englishMeaning: "The Divorce",
    verses: 12,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 66,
    name: "التحريم",
    englishName: "At-Taḥrīm",
    englishMeaning: "The Prohibition",
    verses: 12,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 67,
    name: "الملك",
    englishName: "Al-Mulk",
    englishMeaning: "The Sovereignty",
    verses: 30,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 68,
    name: "القلم",
    englishName: "Al-Qalam",
    englishMeaning: "The Pen",
    verses: 52,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 69,
    name: "الحاقة",
    englishName: "Al-Ḥāqqah",
    englishMeaning: "The Reality",
    verses: 52,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 70,
    name: "المعارج",
    englishName: "Al-Ma'ārij",
    englishMeaning: "The Ascending Stairways",
    verses: 44,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 71,
    name: "نوح",
    englishName: "Nūḥ",
    englishMeaning: "Noah",
    verses: 28,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 72,
    name: "الجن",
    englishName: "Al-Jinn",
    englishMeaning: "The Jinn",
    verses: 28,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 73,
    name: "المزمل",
    englishName: "Al-Muzzammil",
    englishMeaning: "The Enshrouded One",
    verses: 20,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 74,
    name: "المدثر",
    englishName: "Al-Muddaththir",
    englishMeaning: "The Cloaked One",
    verses: 56,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 75,
    name: "القيامة",
    englishName: "Al-Qiyāmah",
    englishMeaning: "The Resurrection",
    verses: 40,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 76,
    name: "الإنسان",
    englishName: "Al-Insān",
    englishMeaning: "The Man",
    verses: 31,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 77,
    name: "المرسلات",
    englishName: "Al-Mursalāt",
    englishMeaning: "The Emissaries",
    verses: 50,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 78,
    name: "النبأ",
    englishName: "An-Naba",
    englishMeaning: "The Tidings",
    verses: 40,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 79,
    name: "النازعات",
    englishName: "An-Nāzi'āt",
    englishMeaning: "Those who pull out",
    verses: 46,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 80,
    name: "عبس",
    englishName: "'Abasa",
    englishMeaning: "He Frowned",
    verses: 42,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 81,
    name: "التكوير",
    englishName: "At-Takwīr",
    englishMeaning: "The Overthrowing",
    verses: 29,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 82,
    name: "الإنفطار",
    englishName: "Al-Infiṭār",
    englishMeaning: "The Cleaving",
    verses: 19,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 83,
    name: "المطففين",
    englishName: "Al-Muṭaffifīn",
    englishMeaning: "The Defrauding",
    verses: 36,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 84,
    name: "الإنشقاق",
    englishName: "Al-Inshiqāq",
    englishMeaning: "The Splitting Open",
    verses: 25,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 85,
    name: "البروج",
    englishName: "Al-Burūj",
    englishMeaning: "The Constellations",
    verses: 22,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 86,
    name: "الطارق",
    englishName: "Aṭ-Ṭāriq",
    englishMeaning: "The Nightcomer",
    verses: 17,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 87,
    name: "الأعلى",
    englishName: "Al-A'lā",
    englishMeaning: "The Most High",
    verses: 19,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 88,
    name: "الغاشية",
    englishName: "Al-Ghāshiyah",
    englishMeaning: "The Overwhelming",
    verses: 26,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 89,
    name: "الفجر",
    englishName: "Al-Fajr",
    englishMeaning: "The Dawn",
    verses: 30,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 90,
    name: "البلد",
    englishName: "Al-Balad",
    englishMeaning: "The City",
    verses: 20,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 91,
    name: "الشمس",
    englishName: "Ash-Shams",
    englishMeaning: "The Sun",
    verses: 15,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 92,
    name: "الليل",
    englishName: "Al-Layl",
    englishMeaning: "The Night",
    verses: 21,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 93,
    name: "الضحى",
    englishName: "Aḍ-Ḍuḥā",
    englishMeaning: "The Morning Hours",
    verses: 11,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 94,
    name: "الشرح",
    englishName: "Ash-Sharḥ",
    englishMeaning: "The Relief",
    verses: 8,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 95,
    name: "التين",
    englishName: "At-Tīn",
    englishMeaning: "The Fig",
    verses: 8,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 96,
    name: "العلق",
    englishName: "Al-'Alaq",
    englishMeaning: "The Clot",
    verses: 19,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 97,
    name: "القدر",
    englishName: "Al-Qadr",
    englishMeaning: "The Power",
    verses: 5,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 98,
    name: "البينة",
    englishName: "Al-Bayyinah",
    englishMeaning: "The Clear Proof",
    verses: 8,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 99,
    name: "الزلزلة",
    englishName: "Az-Zalzalah",
    englishMeaning: "The Earthquake",
    verses: 8,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 100,
    name: "العاديات",
    englishName: "Al-'Ādiyāt",
    englishMeaning: "The Coursers",
    verses: 11,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 101,
    name: "القارعة",
    englishName: "Al-Qāri'ah",
    englishMeaning: "The Striking Hour",
    verses: 11,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 102,
    name: "التكاثر",
    englishName: "At-Takāthur",
    englishMeaning: "The Raging of Competition",
    verses: 8,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 103,
    name: "العصر",
    englishName: "Al-'Aṣr",
    englishMeaning: "The Time",
    verses: 3,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 104,
    name: "الهمزة",
    englishName: "Al-Humazah",
    englishMeaning: "The Slanderer",
    verses: 9,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 105,
    name: "الفيل",
    englishName: "Al-Fīl",
    englishMeaning: "The Elephant",
    verses: 5,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 106,
    name: "قريش",
    englishName: "Quraish",
    englishMeaning: "Quraish",
    verses: 4,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 107,
    name: "الماعون",
    englishName: "Al-Mā'ūn",
    englishMeaning: "The Small Kindnesses",
    verses: 7,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 108,
    name: "الكوثر",
    englishName: "Al-Kawthar",
    englishMeaning: "The Abundance",
    verses: 3,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 109,
    name: "الكافرون",
    englishName: "Al-Kāfirūn",
    englishMeaning: "The Disbelievers",
    verses: 6,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 110,
    name: "النصر",
    englishName: "An-Naṣr",
    englishMeaning: "The Divine Support",
    verses: 3,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 111,
    name: "المسد",
    englishName: "Al-Masad",
    englishMeaning: "The Palm Fiber",
    verses: 5,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 112,
    name: "الإخلاص",
    englishName: "Al-Ikhlāṣ",
    englishMeaning: "The Sincerity",
    verses: 4,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 113,
    name: "الفلق",
    englishName: "Al-Falaq",
    englishMeaning: "The Daybreak",
    verses: 5,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  },
  {
    number: 114,
    name: "الناس",
    englishName: "An-Nās",
    englishMeaning: "Mankind",
    verses: 6,
    arabic: ["آيَة مُؤَقَّتَة"],
    transliteration: ["Transliteration sample"],
    translation: ["Translation sample"]
  }
];