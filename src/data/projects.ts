import type {ProjectItem} from '../types';

export const PROJECTS: ProjectItem[] = [
  {
    id: 'demo-corporate-portal',
    slug: 'demo-corporate-portal',
    isDemo: true,
    title: {
      id: 'Portal Digital Korporasi Modular (DEMO)',
      en: 'Modular Corporate Digital Portal (DEMO)',
    },
    category: 'Website',
    categoryLabel: {
      id: 'Website',
      en: 'Website',
    },
    divisionId: 'dilux-development',
    year: '2026',
    status: {
      id: 'Proyek Contoh (DEMO)',
      en: 'Sample Entry (DEMO)',
    },
    image: '/src/assets/images/insight_engineering_arch_1795578912165.jpg',
    imageAlt: {
      id: 'Fasad gedung perkantoran kaca modern saat senja dengan grid arsitektural rapi',
      en: 'Modern glass corporate building facade at twilight with clean architectural grid lines',
    },
    shortDescription: {
      id: 'Konsep situs web perusahaan dwibahasa dengan arsitektur halaman multi-rute dan sistem desain minimalis.',
      en: 'A bilingual corporate website concept featuring multi-route page architecture and a minimalist design system.',
    },
    overview: {
      id: 'Entri proyek DEMO ini memperlihatkan pendekatan DILUX DEVELOPMENT dalam membangun situs web profil organisasi yang memprioritaskan kecepatan akses, keterbacaan konten dwibahasa, serta struktur SEO yang bersih.',
      en: 'This DEMO project entry demonstrates DILUX DEVELOPMENT’s approach to building organizational websites focused on fast load times, bilingual clarity, and clean technical SEO.',
    },
    architectureNotes: {
      id: 'Dibangun dengan arsitektur komponen React dan TypeScript yang memisahkan data statis, kamus terjemahan, serta logika pemfilteran agar siap dikembangkan bersama backend di masa depan.',
      en: 'Built with modular React and TypeScript components separating static data, translation dictionaries, and pure filtering logic for straightforward future backend integration.',
    },
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'React Router'],
  },
  {
    id: 'demo-operations-web-app',
    slug: 'demo-operations-web-app',
    isDemo: true,
    title: {
      id: 'Aplikasi Manajemen Alur Kerja (DEMO)',
      en: 'Workflow Operations Web App (DEMO)',
    },
    category: 'Software',
    categoryLabel: {
      id: 'Perangkat Lunak',
      en: 'Software',
    },
    divisionId: 'dilux-development',
    year: '2026',
    status: {
      id: 'Prototipe (DEMO)',
      en: 'Prototype (DEMO)',
    },
    image: '/src/assets/images/project_web_platform_1795578912321.jpg',
    imageAlt: {
      id: 'Tampilan aplikasi web operasional pada laptop modern di atas meja batu slate',
      en: 'Operational web application dashboard shown on a dark aluminum laptop on a slate desk',
    },
    shortDescription: {
      id: 'Konsep aplikasi web untuk pencatatan tugas terstruktur, manajemen dokumentasi proyek, dan navigasi antar-modul.',
      en: 'A web application concept for structured task tracking, project documentation, and modular workspace navigation.',
    },
    overview: {
      id: 'Dirancang sebagai studi kasus DEMO untuk mendemonstrasikan struktur antarmuka aplikasi web yang tenang, mudah dipindai, dan bebas dari kerumitan visual yang tidak perlu.',
      en: 'Designed as a DEMO case study demonstrating calm, scannable web application layouts free of unnecessary visual clutter.',
    },
    architectureNotes: {
      id: 'Menggunakan pola pengelolaan state terprediksi, validasi input yang ketat di sisi klien, dan struktur modul data yang siap dipadukan dengan REST API atau Firestore.',
      en: 'Applies predictable state management, strict client-side input validation, and modular data layers ready to connect with REST APIs or Firestore.',
    },
    technologies: ['TypeScript', 'React', 'Node.js', 'Modular State'],
  },
  {
    id: 'demo-structured-lan',
    slug: 'demo-structured-lan',
    isDemo: true,
    title: {
      id: 'Cetak Biru Infrastruktur Jaringan Kantor (DEMO)',
      en: 'Structured Office Network Blueprint (DEMO)',
    },
    category: 'Networking',
    categoryLabel: {
      id: 'Jaringan',
      en: 'Networking',
    },
    divisionId: 'dilux-technology',
    year: '2026',
    status: {
      id: 'Studi Konsep (DEMO)',
      en: 'Concept Study (DEMO)',
    },
    image: '/src/assets/images/project_network_infra_1795578911622.jpg',
    imageAlt: {
      id: 'Lorong ruang server modern dengan rak jaringan tertata dan kabel fiber optik rapi',
      en: 'Modern server corridor with organized network racks and structured fiber optic cabling',
    },
    shortDescription: {
      id: 'Model penataan rak server, segmentasi VLAN dasar, dan dokumentasi jalur kabel untuk lingkungan kerja modern.',
      en: 'A reference model for server rack organization, foundational VLAN segmentation, and structured cabling documentation.',
    },
    overview: {
      id: 'Entri DEMO dari DILUX TECHNOLOGY yang memaparkan bagaimana infrastruktur jaringan fisik yang tertata membantu mempercepat penelusuran masalah dan menjaga stabilitas konektivitas harian.',
      en: 'A DEMO entry from DILUX TECHNOLOGY outlining how disciplined physical network organization accelerates troubleshooting and sustains daily connectivity.',
    },
    architectureNotes: {
      id: 'Mencakup pembagian segmen jaringan kerja dan tamu, pelabelan port patch-panel, serta standar penataan aliran udara pada kabinet perangkat.',
      en: 'Includes separation of internal and guest network segments, patch-panel port labeling standards, and rack airflow planning.',
    },
    technologies: ['VLAN Segmentation', 'Structured Cabling', 'Switch Config', 'Network Docs'],
  },
  {
    id: 'demo-visual-identity-grid',
    slug: 'demo-visual-identity-grid',
    isDemo: true,
    title: {
      id: 'Sistem Identitas Visual & UI Editorial (DEMO)',
      en: 'Visual Identity & Editorial UI System (DEMO)',
    },
    category: 'Creative Design',
    categoryLabel: {
      id: 'Desain Kreatif',
      en: 'Creative Design',
    },
    divisionId: 'dilux-creative',
    year: '2026',
    status: {
      id: 'Eksplorasi Desain (DEMO)',
      en: 'Design Exploration (DEMO)',
    },
    image: '/src/assets/images/project_brand_system_1795578912566.jpg',
    imageAlt: {
      id: 'Meja studio desain dengan sketsa grid arsitektural, buku catatan navy gelap, dan spesimen huruf',
      en: 'Design studio desk featuring architectural grid sheets, navy notebook, and type specimens',
    },
    shortDescription: {
      id: 'Eksplorasi tata letak tipografi, pedoman warna korporasi, dan sistem kartu informasi berhierarki tinggi.',
      en: 'An exploration of typographic hierarchy, corporate color discipline, and structured editorial card layouts.',
    },
    overview: {
      id: 'Dikembangkan oleh DILUX CREATIVE sebagai contoh bagaimana estetika minimalis modern dapat memperkuat kredibilitas sebuah merek teknologi tanpa elemen dekoratif yang berlebihan.',
      en: 'Developed by DILUX CREATIVE as a DEMO reference showing how minimalist layout restraint elevates credibility for technology organizations.',
    },
    architectureNotes: {
      id: 'Mengandalkan skala tipografi yang konsisten, ruang putih yang lega, serta aturan kontras aksesibel di atas permukaan terang maupun navy gelap.',
      en: 'Built around deliberate type scaling, generous whitespace, and accessible contrast tokens across light and deep navy surfaces.',
    },
    technologies: ['UI/UX Systems', 'Typography Grid', 'Brand Guidelines', 'Design Tokens'],
  },
  {
    id: 'demo-rd-lab-framework',
    slug: 'demo-rd-lab-framework',
    isDemo: true,
    title: {
      id: 'Eksperimen Arsitektur Sistem Ringan (DEMO)',
      en: 'Lightweight Systems Architecture Lab (DEMO)',
    },
    category: 'Digital Innovation',
    categoryLabel: {
      id: 'Inovasi Digital',
      en: 'Digital Innovation',
    },
    divisionId: 'dilux-innovation',
    year: '2026',
    status: {
      id: 'Riset Internal (DEMO)',
      en: 'Internal R&D (DEMO)',
    },
    image: '/src/assets/images/hero_dilux_tech_1795578910701.jpg',
    imageAlt: {
      id: 'Koridor arsitektur kaca dan baja gelap dengan garis pencahayaan biru elektrik minimalis',
      en: 'Dark glass and steel architectural corridor illuminated by minimalist electric blue lines',
    },
    shortDescription: {
      id: 'Kerangka eksperimen R&D untuk menguji ide otomasi alur kerja, struktur antarmuka adaptif, dan kesiapan cloud.',
      en: 'An R&D experimentation framework for testing workflow automation ideas, adaptive interfaces, and cloud deployment readiness.',
    },
    overview: {
      id: 'Entri DEMO milik DILUX INNOVATION yang mendokumentasikan proses eksplorasi teknologi baru secara terstruktur sebelum diadopsi ke dalam layanan atau produk nyata.',
      en: 'A DEMO entry by DILUX INNOVATION documenting how emerging technical ideas are tested in structured sandboxes before entering production.',
    },
    architectureNotes: {
      id: 'Menekankan eksperimen berisiko rendah dengan pengujian unit otomatis dan konfigurasi kontainer yang siap dijalankan di lingkungan cloud modern.',
      en: 'Emphasizes low-risk prototyping backed by automated unit tests and container-ready configurations for modern cloud hosting.',
    },
    technologies: ['R&D Prototyping', 'Automated Testing', 'Cloud Readiness', 'System Design'],
  },
];
