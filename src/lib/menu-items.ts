
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
    title: 'Asisten Belajar',
    items: [
      {
        href: '/tutor-ai',
        title: 'Tutor AI',
        icon: Bot,
      },
      {
        href: '/generator-peta-belajar',
        title: 'Peta Jalan Belajar',
        icon: Map,
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
    ],
  },
  {
    title: 'Informasi',
    items: [
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
