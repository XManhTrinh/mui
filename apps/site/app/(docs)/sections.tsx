import type { ReactElement } from 'react';
import {
  AccessibilityIcon,
  CodeIcon,
  HomeIcon,
  MotionIcon,
  PaletteIcon,
  TuneIcon,
  WidgetsIcon,
} from '../../components/icons';

export interface DocsSection {
  href: string;
  label: string;
  icon: ReactElement;
}

/** The primary documentation sections, shared by the rail, the bar and the modal drawer. */
export const DOCS_SECTIONS: DocsSection[] = [
  { href: '/getting-started', label: 'Start', icon: <HomeIcon /> },
  { href: '/theming', label: 'Theming', icon: <PaletteIcon /> },
  { href: '/motion', label: 'Motion', icon: <MotionIcon /> },
  { href: '/customisation', label: 'Custom', icon: <TuneIcon /> },
  { href: '/accessibility', label: 'A11y', icon: <AccessibilityIcon /> },
  { href: '/nextjs', label: 'Next.js', icon: <CodeIcon /> },
  { href: '/components', label: 'Components', icon: <WidgetsIcon /> },
];
