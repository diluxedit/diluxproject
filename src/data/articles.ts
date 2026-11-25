import type {ArticleItem} from '../types';

export const ARTICLES: ArticleItem[] = [
  {
    id: 'demo-modular-web-architecture',
    slug: 'demo-modular-web-architecture',
    isDemo: true,
    title: {
      id: 'Merancang Arsitektur Aplikasi Web Modular yang Mudah Berkembang',
      en: 'Designing Modular Web Application Architecture Built to Evolve',
    },
    excerpt: {
      id: 'Mengapa pemisahan lapisan data, logika murni, dan komponen antarmuka sangat menentukan keberlanjutan sebuah sistem web.',
      en: 'Why separating data models, pure business logic, and UI components defines the long-term maintainability of a web platform.',
    },
    category: 'Software',
    categoryLabel: {
      id: 'Perangkat Lunak',
      en: 'Software',
    },
    publishedAt: '2026-10-18',
    publishedLabel: {
      id: '18 Oktober 2026',
      en: 'October 18, 2026',
    },
    readingMinutes: 5,
    image: '/src/assets/images/project_web_platform_1795578912321.jpg',
    imageAlt: {
      id: 'Laptop menampilkan antarmuka sistem web modern di ruang kerja minimalis',
      en: 'Modern laptop displaying a web application interface on a minimalist workspace',
    },
    author: 'DILUX EDITORIAL (DEMO)',
    sections: [
      {
        heading: {
          id: 'Fondasi Kode yang Terstruktur',
          en: 'Foundations of Structured Code',
        },
        body: {
          id: 'Banyak proyek web mengalami perlambatan pengembangan bukan karena keterbatasan framework, melainkan karena logika bisnis bercampur langsung dengan komponen tampilan. Dengan memisahkan modul validasi, pemfilteran, dan data dari JSX, tim dapat menguji setiap fungsi secara terpisah dalam hitungan milidetik.',
          en: 'Many web projects slow down over time not because of framework limits, but because business logic becomes tightly coupled to presentation components. Separating pure validation, filtering, and data layers from JSX enables fast, deterministic unit testing.',
        },
      },
      {
        heading: {
          id: 'Kesiapan Integrasi Masa Depan',
          en: 'Preparedness for Future Integration',
        },
        body: {
          id: 'Ketika antarmuka sudah bekerja di atas kontrak tipe TypeScript yang jelas, peralihan dari data statis menuju layanan backend seperti Firebase atau API berbasis Cloud Run dapat dilakukan tanpa merombak komponen visual yang sudah stabil.',
          en: 'When interfaces rely on explicit TypeScript data contracts, transitioning from static seed modules to a live backend such as Firebase or a Cloud Run API happens cleanly without rewriting UI components.',
        },
      },
    ],
  },
  {
    id: 'demo-structured-office-networking',
    slug: 'demo-structured-office-networking',
    isDemo: true,
    title: {
      id: 'Prinsip Dasar Penataan Infrastruktur Jaringan Komputer yang Andal',
      en: 'Core Principles of Reliable Computer Network Infrastructure',
    },
    excerpt: {
      id: 'Langkah praktis dalam merapikan topologi jaringan, manajemen kabel, dan segmentasi dasar untuk stabilitas operasional.',
      en: 'Practical foundations for organizing network topology, structured cabling, and basic segmentation for steady operations.',
    },
    category: 'Networking',
    categoryLabel: {
      id: 'Jaringan',
      en: 'Networking',
    },
    publishedAt: '2026-10-29',
    publishedLabel: {
      id: '29 Oktober 2026',
      en: 'October 29, 2026',
    },
    readingMinutes: 4,
    image: '/src/assets/images/project_network_infra_1795578911622.jpg',
    imageAlt: {
      id: 'Rak server dan kabel jaringan terorganisir di ruang infrastruktur TI',
      en: 'Organized server racks and structured network cabling inside an IT facility',
    },
    author: 'DILUX TECHNOLOGY (DEMO)',
    sections: [
      {
        heading: {
          id: 'Keteraturan Fisik Mempermudah Diagnostik',
          en: 'Physical Order Accelerates Diagnostics',
        },
        body: {
          id: 'Infrastruktur jaringan yang rapi bukan sekadar soal estetika ruang server. Pelabelan port yang konsisten dan manajemen kabel yang baik memangkas waktu penelusuran gangguan saat koneksi terputus atau perangkat perlu diganti.',
          en: 'Clean network infrastructure goes far beyond aesthetics. Consistent port labeling and disciplined cable routing dramatically reduce troubleshooting time whenever a link drops or hardware needs replacement.',
        },
      },
      {
        heading: {
          id: 'Dokumentasi Topologi Sebagai Kebiasaan',
          en: 'Making Topology Documentation Routine',
        },
        body: {
          id: 'Setiap perubahan alokasi IP, penambahan access point, atau konfigurasi switch sebaiknya langsung dicatat dalam diagram topologi agar seluruh tim teknis memiliki referensi tunggal yang akurat.',
          en: 'Every IP allocation update, access point addition, or switch change should be reflected in a single source-of-truth topology document for the engineering team.',
        },
      },
    ],
  },
  {
    id: 'demo-minimalist-ui-clarity',
    slug: 'demo-minimalist-ui-clarity',
    isDemo: true,
    title: {
      id: 'Kejelasan Visual dalam Desain Antarmuka Produk Digital Modern',
      en: 'Visual Clarity in Modern Digital Product Interface Design',
    },
    excerpt: {
      id: 'Bagaimana tipografi yang tepat, kontras warna terkendali, dan pengurangan elemen dekoratif meningkatkan kepercayaan pengguna.',
      en: 'How disciplined typography, controlled color contrast, and visual restraint elevate trust in digital products.',
    },
    category: 'Digital Innovation',
    categoryLabel: {
      id: 'Inovasi Digital',
      en: 'Digital Innovation',
    },
    publishedAt: '2026-11-06',
    publishedLabel: {
      id: '6 November 2026',
      en: 'November 6, 2026',
    },
    readingMinutes: 4,
    image: '/src/assets/images/project_brand_system_1795578912566.jpg',
    imageAlt: {
      id: 'Panduan grid tata letak dan tipografi di meja studio desain',
      en: 'Layout grid and typography system documentation on a design studio desk',
    },
    author: 'DILUX CREATIVE (DEMO)',
    sections: [
      {
        heading: {
          id: 'Mengutamakan Fungsi di Atas Dekorasi',
          en: 'Prioritizing Function Over Ornament',
        },
        body: {
          id: 'Antarmuka teknologi yang matang tidak memerlukan efek kilau berlebih atau kotak label yang bertumpuk. Ruang kosong yang terukur dan batas garis tipis justru membantu mata pembaca langsung menemukan informasi utama.',
          en: 'Mature technology interfaces do not rely on excessive glow effects or stacked pill badges. Measured whitespace and subtle hairline borders guide the reader straight to primary actions and content.',
        },
      },
      {
        heading: {
          id: 'Aksesibilitas Sebagai Standar Dasar',
          en: 'Accessibility as a Baseline Standard',
        },
        body: {
          id: 'Memastikan kontras teks memenuhi standar keterbacaan, ukuran tombol nyaman disentuh pada layar ponsel, dan animasi menghormati preferensi reduced-motion adalah bagian tak terpisahkan dari kualitas desain.',
          en: 'Ensuring high text contrast, comfortable mobile touch targets, and reduced-motion support is inseparable from thoughtful visual design.',
        },
      },
    ],
  },
  {
    id: 'demo-workstation-hardware-guide',
    slug: 'demo-workstation-hardware-guide',
    isDemo: true,
    title: {
      id: 'Panduan Memilih Komponen Workstation untuk Pengembangan & Desain',
      en: 'Tutorial: Selecting Workstation Hardware for Engineering & Design',
    },
    excerpt: {
      id: 'Pendekatan seimbang dalam menentukan prosesor, memori, penyimpanan NVMe, dan pendinginan sesuai beban kerja nyata.',
      en: 'A balanced approach to choosing CPUs, memory, NVMe storage, and thermal cooling based on actual daily workloads.',
    },
    category: 'Hardware',
    categoryLabel: {
      id: 'Perangkat Keras',
      en: 'Hardware',
    },
    publishedAt: '2026-11-12',
    publishedLabel: {
      id: '12 November 2026',
      en: 'November 12, 2026',
    },
    readingMinutes: 6,
    image: '/src/assets/images/hero_dilux_tech_1795578910701.jpg',
    imageAlt: {
      id: 'Interior arsitektur teknologi modern bernuansa biru navy gelap',
      en: 'Modern minimalist technology architecture interior in deep navy',
    },
    author: 'DILUX TECHNOLOGY (DEMO)',
    sections: [
      {
        heading: {
          id: 'Menyesuaikan Spesifikasi dengan Beban Kerja',
          en: 'Matching Specifications to Workloads',
        },
        body: {
          id: 'Alur kerja kompilasi kode dan kontainerisasi membutuhkan kapasitas RAM dan kecepatan baca-tulis SSD yang konsisten, sementara produksi visual memerlukan akurasi layar serta stabilitas GPU.',
          en: 'Code compilation and containerized environments benefit heavily from ample RAM and sustained NVMe throughput, while creative work depends on color-accurate displays and steady GPU thermals.',
        },
      },
      {
        heading: {
          id: 'Stabilitas Termal dan Daya',
          en: 'Thermal Stability and Power Delivery',
        },
        body: {
          id: 'Memilih catu daya (PSU) berefisiensi baik dan casing dengan aliran udara terarah memastikan komponen bekerja tenang dan awet dalam sesi kerja panjang.',
          en: 'Pairing an efficient power supply unit with a clean airflow chassis keeps acoustics low and sustains consistent clock speeds during extended sessions.',
        },
      },
    ],
  },
  {
    id: 'demo-bilingual-seo-tutorial',
    slug: 'demo-bilingual-seo-tutorial',
    isDemo: true,
    title: {
      id: 'Tutorial Praktis: Menyusun Situs Dwibahasa Tanpa Reload Halaman',
      en: 'Tutorial: Building Instant Bilingual Switching Without Page Reloads',
    },
    excerpt: {
      id: 'Cara mengelola kamus terjemahan terstruktur, persistensi localStorage, dan pembaruan metadata dokumen pada aplikasi React.',
      en: 'How to structure typed translation dictionaries, localStorage persistence, and dynamic document metadata in React.',
    },
    category: 'Tutorials',
    categoryLabel: {
      id: 'Tutorial',
      en: 'Tutorials',
    },
    publishedAt: '2026-11-19',
    publishedLabel: {
      id: '19 November 2026',
      en: 'November 19, 2026',
    },
    readingMinutes: 5,
    image: '/src/assets/images/insight_engineering_arch_1795578912165.jpg',
    imageAlt: {
      id: 'Gedung teknologi modern dengan pencahayaan hangat dan langit biru tua',
      en: 'Modern technology headquarters facade illuminated against a deep navy twilight sky',
    },
    author: 'DILUX DEVELOPMENT (DEMO)',
    sections: [
      {
        heading: {
          id: 'Kamus Terjemahan Bertipe Aman',
          en: 'Type-Safe Translation Dictionaries',
        },
        body: {
          id: 'Dengan menyelaraskan struktur objek bahasa Indonesia dan Inggris melalui tipe TypeScript, setiap perubahan teks akan langsung terdeteksi bila ada kunci yang belum diterjemahkan.',
          en: 'By mirroring Indonesian and English dictionary schemas with TypeScript types, any missing key across translations is caught immediately during compilation.',
        },
      },
      {
        heading: {
          id: 'Sinkronisasi Atribut Dokumen & Metadata',
          en: 'Syncing Document Attributes & Metadata',
        },
        body: {
          id: 'Selain menerjemahkan antarmuka, memperbarui atribut lang pada elemen html serta judul halaman (document.title) memastikan pengalaman navigasi terasa utuh di kedua bahasa.',
          en: 'Beyond UI strings, updating the html lang attribute and document.title keeps browser tabs, screen readers, and page previews aligned in both languages.',
        },
      },
    ],
  },
  {
    id: 'demo-technology-exploration-mindset',
    slug: 'demo-technology-exploration-mindset',
    isDemo: true,
    title: {
      id: 'Mengubah Eksplorasi Teknologi Menjadi Solusi yang Relevan',
      en: 'Turning Technology Exploration Into Practical Solutions',
    },
    excerpt: {
      id: 'Refleksi tentang pentingnya menguji konsep teknologi baru dengan parameter kebutuhan nyata sebelum diterapkan secara luas.',
      en: 'Notes on evaluating emerging technology concepts against real-world utility before full-scale implementation.',
    },
    category: 'Technology',
    categoryLabel: {
      id: 'Teknologi',
      en: 'Technology',
    },
    publishedAt: '2026-11-22',
    publishedLabel: {
      id: '22 November 2026',
      en: 'November 22, 2026',
    },
    readingMinutes: 3,
    image: '/src/assets/images/hero_dilux_tech_1795578910701.jpg',
    imageAlt: {
      id: 'Ruang arsitektur teknologi minimalis bernuansa biru gelap',
      en: 'Minimalist deep navy architectural technology corridor',
    },
    author: 'DILUX INNOVATION (DEMO)',
    sections: [
      {
        heading: {
          id: 'Eksplorasi yang Terarah',
          en: 'Purposeful Exploration',
        },
        body: {
          id: 'Mengikuti perkembangan teknologi bukan berarti sekadar mengejar tren sesaat. Eksplorasi terbaik dimulai dari pertanyaan sederhana: masalah apa yang menjadi lebih mudah, lebih cepat, atau lebih rapi untuk diselesaikan.',
          en: 'Following modern technology is not about chasing fleeting hype. Meaningful exploration starts by asking what becomes clearer, more reliable, or more accessible for real users.',
        },
      },
    ],
  },
];
