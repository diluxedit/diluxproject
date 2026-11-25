import type {ServiceItem} from '../types';

export const SERVICES: ServiceItem[] = [
  {
    id: 'website-development',
    number: '01',
    divisionId: 'dilux-development',
    icon: 'Globe',
    name: {
      id: 'Pengembangan Website',
      en: 'Website Development',
    },
    shortDescription: {
      id: 'Perancangan dan pembangunan situs web korporasi, profil organisasi, dan platform informasi yang responsif serta cepat.',
      en: 'Design and development of responsive corporate websites, organizational profiles, and structured information platforms.',
    },
    scopeDetails: {
      id: ['Arsitektur halaman responsif', 'Struktur SEO teknis', 'Optimasi performa muat'],
      en: ['Responsive page architecture', 'Technical SEO structure', 'Loading performance optimization'],
    },
  },
  {
    id: 'web-application-development',
    number: '02',
    divisionId: 'dilux-development',
    icon: 'AppWindow',
    name: {
      id: 'Pengembangan Aplikasi Web',
      en: 'Web Application Development',
    },
    shortDescription: {
      id: 'Pembuatan aplikasi berbasis browser dengan alur kerja interaktif, manajemen data terstruktur, dan antarmuka modern.',
      en: 'Custom browser-based applications featuring interactive workflows, structured data handling, and modern interfaces.',
    },
    scopeDetails: {
      id: ['Antarmuka React & TypeScript', 'Integrasi API terstruktur', 'Desain alur kerja pengguna'],
      en: ['React & TypeScript interfaces', 'Structured API integration', 'Interactive workflow design'],
    },
  },
  {
    id: 'software-development',
    number: '03',
    divisionId: 'dilux-development',
    icon: 'Terminal',
    name: {
      id: 'Pengembangan Perangkat Lunak',
      en: 'Software Development',
    },
    shortDescription: {
      id: 'Rekayasa perangkat lunak khusus yang disesuaikan dengan kebutuhan operasional serta sistem digital organisasi.',
      en: 'Tailored software engineering aligned with operational requirements and modular digital system architecture.',
    },
    scopeDetails: {
      id: ['Arsitektur sistem modular', 'Pengembangan backend & frontend', 'Dokumentasi teknis'],
      en: ['Modular system architecture', 'Frontend & backend engineering', 'Technical documentation'],
    },
  },
  {
    id: 'computer-networking',
    number: '04',
    divisionId: 'dilux-technology',
    icon: 'Network',
    name: {
      id: 'Jaringan Komputer',
      en: 'Computer Networking',
    },
    shortDescription: {
      id: 'Perencanaan dan konfigurasi jaringan lokal maupun antar-ruang untuk konektivitas kerja yang stabil dan tertata.',
      en: 'Planning and configuration of local and multi-room computer networks for reliable, well-structured connectivity.',
    },
    scopeDetails: {
      id: ['Konfigurasi router & switch', 'Segmentasi jaringan dasar', 'Pengujian konektivitas'],
      en: ['Router & switch configuration', 'Foundational network segmentation', 'Connectivity verification'],
    },
  },
  {
    id: 'network-infrastructure',
    number: '05',
    divisionId: 'dilux-technology',
    icon: 'Router',
    name: {
      id: 'Infrastruktur Jaringan',
      en: 'Network Infrastructure',
    },
    shortDescription: {
      id: 'Penataan jalur kabel terstruktur, rak perangkat, dan tata letak infrastruktur jaringan yang rapi serta mudah dirawat.',
      en: 'Structured cabling layouts, rack organization, and maintainable physical network infrastructure planning.',
    },
    scopeDetails: {
      id: ['Desain topologi infrastruktur', 'Penataan perangkat & kabel', 'Dokumentasi jalur jaringan'],
      en: ['Infrastructure topology planning', 'Hardware & cabling layout', 'Network path documentation'],
    },
  },
  {
    id: 'it-support',
    number: '06',
    divisionId: 'dilux-technology',
    icon: 'Headphones',
    name: {
      id: 'Dukungan TI (IT Support)',
      en: 'IT Support',
    },
    shortDescription: {
      id: 'Pendampingan teknis, pemecahan masalah perangkat lunak maupun sistem operasional, serta pemeliharaan berkala.',
      en: 'Technical assistance, system troubleshooting, and routine operational maintenance for digital environments.',
    },
    scopeDetails: {
      id: ['Diagnostik gangguan teknis', 'Konfigurasi lingkungan kerja', 'Pemeliharaan sistem dasar'],
      en: ['Technical diagnostics', 'Workstation setup & tuning', 'Routine system maintenance'],
    },
  },
  {
    id: 'hardware-solutions',
    number: '07',
    divisionId: 'dilux-technology',
    icon: 'Cpu',
    name: {
      id: 'Solusi Perangkat Keras',
      en: 'Hardware Solutions',
    },
    shortDescription: {
      id: 'Konsultasi spesifikasi, perakitan, dan optimalisasi perangkat keras komputer sesuai beban kerja teknis maupun kreatif.',
      en: 'Hardware specification consulting, workstation assembly, and tuning aligned with technical or creative workloads.',
    },
    scopeDetails: {
      id: ['Perencanaan spesifikasi PC/workstation', 'Perakitan & pengujian komponen', 'Evaluasi peningkatan sistem'],
      en: ['Workstation specification planning', 'Assembly & component validation', 'Hardware upgrade planning'],
    },
  },
  {
    id: 'ui-ux-design',
    number: '08',
    divisionId: 'dilux-creative',
    icon: 'Layout',
    name: {
      id: 'Desain UI/UX',
      en: 'UI/UX Design',
    },
    shortDescription: {
      id: 'Perancangan antarmuka pengguna dan alur pengalaman digital yang bersih, intuitif, dan mudah diakses di berbagai perangkat.',
      en: 'Designing clean, intuitive user interfaces and accessible digital user journeys across desktop and mobile devices.',
    },
    scopeDetails: {
      id: ['Wireframe & arsitektur informasi', 'Sistem desain komponen UI', 'Prototipe interaktif'],
      en: ['Wireframes & information architecture', 'Component design systems', 'Interactive prototypes'],
    },
  },
  {
    id: 'graphic-design',
    number: '09',
    divisionId: 'dilux-creative',
    icon: 'PenTool',
    name: {
      id: 'Desain Grafis',
      en: 'Graphic Design',
    },
    shortDescription: {
      id: 'Pembuatan aset komunikasi visual, materi presentasi, serta kebutuhan grafis digital dengan estetika modern dan konsisten.',
      en: 'Creation of visual communication assets, presentation layouts, and digital graphics with modern consistency.',
    },
    scopeDetails: {
      id: ['Materi komunikasi digital', 'Tata letak editorial & presentasi', 'Aset visual media sosial'],
      en: ['Digital communication materials', 'Editorial & deck layouts', 'Social media visual assets'],
    },
  },
  {
    id: 'digital-branding',
    number: '10',
    divisionId: 'dilux-creative',
    icon: 'Sparkles',
    name: {
      id: 'Digital Branding',
      en: 'Digital Branding',
    },
    shortDescription: {
      id: 'Pengembangan identitas visual digital, pedoman warna dan tipografi, serta karakter merek yang kohesif.',
      en: 'Shaping cohesive digital brand identities, color and typographic guidelines, and consistent visual language.',
    },
    scopeDetails: {
      id: ['Panduan identitas visual', 'Sistem tipografi & palet warna', 'Konsistensi aset lintas kanal'],
      en: ['Visual identity guidelines', 'Typography & color systems', 'Cross-channel asset consistency'],
    },
  },
];
