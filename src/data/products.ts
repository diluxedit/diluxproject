import type {ProductItem} from '../types';

export const PRODUCTS: ProductItem[] = [
  {
    id: 'demo-workspace-core',
    slug: 'demo-workspace-core',
    isDemo: true,
    name: 'Dilux Workspace Core (DEMO)',
    category: 'Web Applications',
    categoryLabel: {
      id: 'Aplikasi Web',
      en: 'Web Applications',
    },
    status: {
      id: 'Konsep DEMO',
      en: 'DEMO Concept',
    },
    image: '/src/assets/images/project_web_platform_1795578912321.jpg',
    imageAlt: {
      id: 'Pratinjau antarmuka aplikasi web modular pada laptop di meja kerja modern',
      en: 'Modular web application interface preview displayed on a modern laptop workstation',
    },
    shortDescription: {
      id: 'Kerangka portal operasional internal berbasis web untuk pengelolaan dokumen, tugas, dan kolaborasi tim lintas divisi.',
      en: 'A modular web-based internal portal concept for structured team tasks, documentation, and cross-division workflows.',
    },
    fullDescription: {
      id: 'Entri DEMO ini merepresentasikan konsep aplikasi web modular yang disiapkan untuk kebutuhan tata kelola kerja internal. Struktur data dapat disesuaikan dengan integrasi backend seperti Firebase atau REST API pada tahap pengembangan lanjutan.',
      en: 'This DEMO entry represents a modular web application concept designed for internal operations. Its data layer is structured to support future backend integration such as Firebase or REST APIs.',
    },
    capabilities: {
      id: [
        'Struktur modul terpisah untuk manajemen tim dan catatan kerja',
        'Antarmuka responsif untuk desktop maupun perangkat seluler',
        'Siap dihubungkan dengan sistem autentikasi dan basis data eksternal',
      ],
      en: [
        'Modular structure for team coordination and workspace records',
        'Responsive interface across desktop and mobile screens',
        'Prepared for external authentication and persistent database integration',
      ],
    },
  },
  {
    id: 'demo-netmap-kit',
    slug: 'demo-netmap-kit',
    isDemo: true,
    name: 'NetTopology Planner (DEMO)',
    category: 'Digital Tools',
    categoryLabel: {
      id: 'Perangkat Digital',
      en: 'Digital Tools',
    },
    status: {
      id: 'Prototipe DEMO',
      en: 'DEMO Prototype',
    },
    image: '/src/assets/images/project_network_infra_1795578911622.jpg',
    imageAlt: {
      id: 'Ilustrasi rak server jaringan terstruktur dengan pencahayaan biru halus',
      en: 'Structured network server rack with subtle blue indicator lighting',
    },
    shortDescription: {
      id: 'Alat bantu dokumentasi topologi jaringan, inventaris perangkat keras, dan pemetaan port untuk tim infrastruktur TI.',
      en: 'A documentation utility concept for mapping network topology, hardware inventory, and port assignments.',
    },
    fullDescription: {
      id: 'Entri DEMO yang dirancang sebagai alat bantu pencatatan topologi jaringan lokal. Berfokus pada kejelasan dokumentasi alokasi IP, jalur kabel, serta catatan pemeliharaan perangkat keras.',
      en: 'A DEMO utility concept focused on keeping local network documentation clear—covering IP allocation notes, cabling paths, and hardware maintenance logs.',
    },
    capabilities: {
      id: [
        'Pencatatan inventaris perangkat router, switch, dan workstation',
        'Struktur dokumentasi segmen jaringan yang mudah ditinjau',
        'Format ringkas untuk kebutuhan audit internal tim TI',
      ],
      en: [
        'Structured inventory records for routers, switches, and workstations',
        'Clear documentation layout for local network segments',
        'Concise reference format for internal IT maintenance',
      ],
    },
  },
  {
    id: 'demo-design-tokens',
    slug: 'demo-design-tokens',
    isDemo: true,
    name: 'Dilux UI System Kit (DEMO)',
    category: 'Software',
    categoryLabel: {
      id: 'Perangkat Lunak',
      en: 'Software',
    },
    status: {
      id: 'Konsep DEMO',
      en: 'DEMO Concept',
    },
    image: '/src/assets/images/project_brand_system_1795578912566.jpg',
    imageAlt: {
      id: 'Lembar spesimen tipografi dan sistem tata letak desain minimalis di studio',
      en: 'Minimalist typography specimen and layout grid system on a design studio table',
    },
    shortDescription: {
      id: 'Pustaka komponen antarmuka dan token desain minimalis untuk mempercepat konsistensi visual di berbagai aplikasi.',
      en: 'A minimalist UI component and design-token starter kit built to keep visual interfaces consistent across applications.',
    },
    fullDescription: {
      id: 'Entri DEMO ini menampilkan konsep sistem desain internal DILUX CREATIVE yang memadukan keterbacaan tipografi, kontras warna navy-putih, dan komponen aksesibel.',
      en: 'This DEMO entry illustrates an internal design system concept by DILUX CREATIVE combining typographic clarity, navy-and-white contrast, and accessible components.',
    },
    capabilities: {
      id: [
        'Token warna, spasi, dan skala tipografi terpusat',
        'Komponen tombol, kartu, dan formulir yang aksesibel',
        'Dukungan penuh tata letak dwibahasa',
      ],
      en: [
        'Centralized color, spacing, and typography tokens',
        'Accessible button, card, and form primitives',
        'Built-in support for bilingual interface layouts',
      ],
    },
  },
  {
    id: 'demo-edge-node',
    slug: 'demo-edge-node',
    isDemo: true,
    name: 'Modular Workstation Spec (DEMO)',
    category: 'Technology Products',
    categoryLabel: {
      id: 'Produk Teknologi',
      en: 'Technology Products',
    },
    status: {
      id: 'Eksplorasi DEMO',
      en: 'DEMO Exploration',
    },
    image: '/src/assets/images/hero_dilux_tech_1795578910701.jpg',
    imageAlt: {
      id: 'Arsitektur ruang teknologi modern bernuansa navy gelap dan pencahayaan biru',
      en: 'Modern minimalist technology architecture in deep navy with subtle blue lighting',
    },
    shortDescription: {
      id: 'Cetak biru konfigurasi perangkat keras workstation dan node jaringan ringkas untuk lingkungan pengembangan serta studio kreatif.',
      en: 'A hardware configuration blueprint concept for compact developer workstations and local studio network nodes.',
    },
    fullDescription: {
      id: 'Entri DEMO dari kolaborasi DILUX TECHNOLOGY dan DILUX INNOVATION dalam menyusun referensi konfigurasi perangkat keras yang seimbang antara efisiensi termal, keheningan kerja, dan keandalan komputasi.',
      en: 'A DEMO exploration from DILUX TECHNOLOGY and DILUX INNOVATION outlining balanced hardware blueprints focused on thermal stability, quiet operation, and dependable daily computing.',
    },
    capabilities: {
      id: [
        'Referensi konfigurasi komponen yang terverifikasi kompatibilitasnya',
        'Fokus pada aliran udara, efisiensi daya, dan kemudahan perawatan',
        'Dapat disesuaikan dengan kebutuhan pengembangan atau desain',
      ],
      en: [
        'Compatibility-checked hardware component reference blueprints',
        'Focus on thermal airflow, power efficiency, and serviceability',
        'Adaptable to software engineering or creative production workloads',
      ],
    },
  },
];
