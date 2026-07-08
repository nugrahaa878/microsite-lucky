export const PRODUCTS = [
  {
    slug: "sasa-msg-gourmet-powder",
    emoji: "🧂",
    name: "Sasa MSG (Gourmet Powder)",
    desc: "Mononatrium glutamat murni, penguat rasa andalan untuk berbagai masakan sehari-hari.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=400&fit=crop&q=80",
    longDesc:
      "Sasa MSG Gourmet Powder adalah penguat rasa berbahan dasar mononatrium glutamat murni yang diproses melalui fermentasi alami tetes tebu. Dipercaya jutaan dapur rumahan di Indonesia selama puluhan tahun untuk menghadirkan rasa gurih (umami) yang seimbang di setiap masakan.",
    specs: [
      { label: "Berat Bersih", value: "80 g / 250 g / 500 g" },
      { label: "Komposisi", value: "Mononatrium Glutamat 99%" },
      { label: "Masa Simpan", value: "24 bulan dari tanggal produksi" },
      { label: "Sertifikasi", value: "Halal MUI, BPOM RI" },
    ],
    highlights: [
      "Meningkatkan rasa gurih alami tanpa mengubah karakter masakan",
      "Larut cepat, cocok untuk masakan basah maupun kering",
      "Dikemas dalam kemasan food-grade kedap udara",
    ],
  },
  {
    slug: "sasa-tepung-bumbu-serbaguna",
    emoji: "🍗",
    name: "Sasa Tepung Bumbu Serbaguna",
    desc: "Tepung bumbu ala Kentucky untuk ayam krispi—gurih berbumbu dan renyah tahan lama.",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&h=400&fit=crop&q=80",
    longDesc:
      "Tepung Bumbu Serbaguna Sasa diformulasikan khusus untuk menghasilkan lapisan crispy ala restoran cepat saji, dengan racikan rempah yang meresap hingga ke dalam. Cocok untuk ayam, tahu, tempe, hingga aneka gorengan favorit keluarga.",
    specs: [
      { label: "Berat Bersih", value: "200 g / 1 kg" },
      { label: "Komposisi", value: "Tepung terigu, tepung beras, rempah pilihan" },
      { label: "Masa Simpan", value: "12 bulan dari tanggal produksi" },
      { label: "Sertifikasi", value: "Halal MUI, BPOM RI" },
    ],
    highlights: [
      "Hasil gorengan renyah tahan lama walau sudah dingin",
      "Bumbu meresap tanpa perlu marinasi lama",
      "Praktis, tinggal balur dan goreng",
    ],
  },
  {
    slug: "sasa-santan-cair",
    emoji: "🥥",
    name: "Sasa Santan Cair",
    desc: "Santan kelapa dengan formula baru, kental dan creamy untuk berbagai olahan masakan santan.",
    image: "https://images.unsplash.com/photo-1580984969071-a8da5656c2fb?w=600&h=400&fit=crop&q=80",
    longDesc:
      "Sasa Santan Cair dibuat dari kelapa pilihan dengan proses ekstraksi modern sehingga menghasilkan santan yang kental, creamy, dan tidak mudah pecah saat dimasak. Praktis menggantikan santan parut segar tanpa mengorbankan cita rasa otentik.",
    specs: [
      { label: "Kemasan", value: "Tetra pack 200 ml / 1 L" },
      { label: "Komposisi", value: "Ekstrak kelapa, air, penstabil nabati" },
      { label: "Masa Simpan", value: "10 bulan dari tanggal produksi" },
      { label: "Sertifikasi", value: "Halal MUI, BPOM RI" },
    ],
    highlights: [
      "Tekstur creamy, tidak mudah pecah saat direbus lama",
      "Praktis tanpa perlu memarut dan memeras kelapa",
      "Cocok untuk masakan gurih maupun hidangan manis",
    ],
  },
];

export const RECIPES = [
  {
    slug: "opor-ayam-santan-sasa",
    emoji: "🍛",
    title: "Opor Ayam Santan Sasa",
    desc: "Opor ayam gurih dengan Santan Cair Sasa, dipadukan bumbu rempah untuk cita rasa rumahan.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=400&fit=crop&q=80",
    duration: "45 menit",
    servings: "4 porsi",
    difficulty: "Mudah",
    ingredients: [
      "1 ekor ayam, potong 8 bagian",
      "500 ml Sasa Santan Cair",
      "3 lembar daun salam",
      "2 batang serai, memarkan",
      "1 sdt Sasa MSG Gourmet Powder",
      "Bumbu halus: bawang merah, bawang putih, kemiri, kunyit, ketumbar",
      "Garam dan gula secukupnya",
    ],
    steps: [
      "Tumis bumbu halus bersama daun salam dan serai hingga harum.",
      "Masukkan ayam, aduk hingga berubah warna dan bumbu meresap.",
      "Tuang Sasa Santan Cair sedikit demi sedikit sambil diaduk agar tidak pecah.",
      "Masak dengan api kecil hingga ayam empuk dan kuah mengental.",
      "Bumbui dengan Sasa MSG, garam, dan gula. Koreksi rasa lalu angkat.",
    ],
  },
  {
    slug: "ayam-krispi-ala-kentucky",
    emoji: "🍗",
    title: "Ayam Krispi Ala Kentucky",
    desc: "Ayam goreng renyah pakai Tepung Bumbu Serbaguna Sasa, gurih berbumbu dari luar sampai dalam.",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=400&fit=crop&q=80",
    duration: "30 menit",
    servings: "4 porsi",
    difficulty: "Mudah",
    ingredients: [
      "8 potong ayam, marinasi dengan garam dan bawang putih",
      "200 g Sasa Tepung Bumbu Serbaguna",
      "2 butir telur, kocok lepas",
      "Minyak goreng secukupnya",
    ],
    steps: [
      "Celupkan ayam ke telur kocok, lalu balur dengan Sasa Tepung Bumbu Serbaguna hingga rata.",
      "Diamkan 5 menit agar tepung menempel sempurna.",
      "Goreng dalam minyak panas dengan api sedang hingga keemasan dan matang merata.",
      "Angkat dan tiriskan, sajikan selagi hangat.",
    ],
  },
  {
    slug: "tumis-sayur-sedap-msg-sasa",
    emoji: "🥘",
    title: "Tumis Sayur Sedap MSG Sasa",
    desc: "Tumisan sayur sehari-hari makin sedap dengan sejumput Sasa MSG Gourmet Powder.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop&q=80",
    duration: "15 menit",
    servings: "3 porsi",
    difficulty: "Sangat Mudah",
    ingredients: [
      "300 g sayuran campur (buncis, wortel, kol)",
      "3 siung bawang putih, cincang",
      "2 buah cabai merah, iris serong",
      "1/2 sdt Sasa MSG Gourmet Powder",
      "Garam dan kecap asin secukupnya",
      "Minyak untuk menumis",
    ],
    steps: [
      "Panaskan minyak, tumis bawang putih dan cabai hingga harum.",
      "Masukkan sayuran, aduk cepat dengan api besar.",
      "Tambahkan sedikit air, masak hingga sayur setengah layu.",
      "Bumbui dengan Sasa MSG, garam, dan kecap asin. Aduk rata dan angkat.",
    ],
  },
];

export const FAQS = [
  {
    q: "Bagaimana cara ikut lucky draw ini?",
    a: "Cukup isi nama lengkap dan nomor WhatsApp aktif kamu di form pendaftaran pada bagian \"Daftar Lucky Draw\". Setelah submit, kamu akan mendapat nomor undian sebagai bukti pendaftaran.",
  },
  {
    q: "Apakah bisa daftar lebih dari satu kali?",
    a: "Tidak. Satu nomor WhatsApp hanya bisa digunakan untuk satu kali pendaftaran, guna memastikan kesempatan menang yang adil bagi semua peserta.",
  },
  {
    q: "Kapan pemenang diumumkan?",
    a: "Pemenang akan diundi dan diumumkan langsung di layar pada saat acara berlangsung. Pastikan nomor undianmu tersimpan baik.",
  },
  {
    q: "Apakah pendaftaran ini dipungut biaya?",
    a: "Tidak. Pendaftaran lucky draw ini sepenuhnya gratis, tanpa syarat pembelian produk apa pun.",
  },
];

export const TERMS = [
  "Peserta wajib mengisi nama lengkap dan nomor WhatsApp aktif yang benar saat pendaftaran.",
  "Satu nomor WhatsApp hanya berlaku untuk satu kali pendaftaran dan satu kesempatan menang.",
  "Pemenang dipilih secara acak (random) melalui sistem undian pada saat acara berlangsung.",
  "Keputusan panitia bersifat final dan tidak dapat diganggu gugat.",
  "Hadiah tidak dapat diuangkan dan tidak dapat dipindahtangankan ke pihak lain.",
  "Panitia berhak mendiskualifikasi peserta yang terindikasi melakukan kecurangan dalam proses pendaftaran maupun pengundian.",
];

export const EVENT_DATE = "2026-07-20T13:00:00+07:00";
