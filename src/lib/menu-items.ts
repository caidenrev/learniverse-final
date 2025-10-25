
import type { LucideIcon } from 'lucide-react';
import {
  BrainCircuit,
  LayoutTemplate,
  BookCopy,
  GraduationCap,
  Search,
  Quote,
  Languages,
  Bot,
  Map,
  Info,
  Mail,
  FileText,
  FileQuestion,
  BookDown,
  Gem,
  History,
  Archive,
  LayoutDashboard,
  FileCheck,
} from 'lucide-react';

interface MenuItem {
  href: string;
  title: string;
  icon: LucideIcon;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export const menuItems: MenuGroup[] = [
   {
    title: 'Navigasi',
    items: [
       {
        href: '/brainstorm-topik',
        title: 'Dasbor',
        icon: LayoutDashboard,
      },
    ]
  },
  {
    title: 'Asisten Belajar',
    items: [
      {
        href: '/tutor-ai',
        title: 'Tutor AI',
        icon: Bot,
      },
      {
        href: '/jawaban-cepat',
        title: 'Jawaban Cepat',
        icon: FileCheck,
      },
      {
        href: '/generator-peta-belajar',
        title: 'Roadmap Belajar',
        icon: Map,
      },
      {
        href: '/cv-reviewer',
        title: 'CV Reviewer',
        icon: FileText,
      },
      {
        href: '/pembuat-pertanyaan',
        title: 'Pembuat Pertanyaan',
        icon: FileQuestion,
      },
    ],
  },
  {
    title: 'Katalisator Ide',
    items: [
      {
        href: '/brainstorm-topik',
        title: 'Brainstorm Topik',
        icon: BrainCircuit,
      },
      {
        href: '/kerangka-presentasi',
        title: 'Kerangka Presentasi',
        icon: LayoutTemplate,
      },
      {
        href: '/pencari-analogi',
        title: 'Pencari Analogi',
        icon: BookCopy,
      },
    ],
  },
  {
    title: 'Asisten Riset',
    items: [
      {
        href: '/generator-kerangka-penelitian',
        title: 'Kerangka Penelitian',
        icon: GraduationCap,
      },
      {
        href: '/pencari-referensi-cerdas',
        title: 'Pencari Referensi Cerdas',
        icon: Search,
      },
      {
        href: '/parafrase-akademik',
        title: 'Parafrase Akademik',
        icon: Quote,
      },
      {
        href: '/peringkas-jurnal',
        title: 'Peringkas Jurnal',
        icon: Languages,
      },
      {
        href: '/rangkum-dokumen',
        title: 'Peringkas Dokumen',
        icon: BookDown,
      },
    ],
  },
  {
    title: 'Akun',
    items: [
       {
        href: '/riwayat-projek',
        title: 'Riwayat Projek',
        icon: Archive,
      },
      {
        href: '/pricing',
        title: 'Harga',
        icon: Gem,
      },
      {
        href: '/riwayat-transaksi',
        title: 'Riwayat Transaksi',
        icon: History,
      },
      {
        href: '/tentang',
        title: 'Tentang',
        icon: Info,
      },
      {
        href: '/kontak',
        title: 'Kontak',
        icon: Mail,
      },
    ],
  },
];
