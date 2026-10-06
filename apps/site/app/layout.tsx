import { DEFAULT_THEME_STATE, ThemeProvider, ThemeScript } from '@vkieu/mui';
import { NextRouterProvider } from '@vkieu/mui/next';
import type { Metadata } from 'next';
import { Roboto_Flex } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  axes: ['wdth', 'opsz', 'GRAD'],
  variable: '--md-ref-typeface-brand',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '@vkieu/mui',
  description: 'Documentation for @vkieu/mui — Material Design 3 Expressive for React.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={robotoFlex.variable}>
      <head>
        {/* Applies the stored theme before first paint, so the static export never flashes. */}
        <ThemeScript defaults={DEFAULT_THEME_STATE} />
      </head>
      <body
        className="bg-surface text-on-surface font-plain"
        style={{ ['--md-ref-typeface-plain' as string]: 'var(--md-ref-typeface-brand)' }}
      >
        <NextRouterProvider>
          <ThemeProvider
            defaultTheme={DEFAULT_THEME_STATE.theme}
            defaultMode={DEFAULT_THEME_STATE.mode}
            defaultContrast={DEFAULT_THEME_STATE.contrast}
            defaultMotion={DEFAULT_THEME_STATE.motion}
          >
            {children}
          </ThemeProvider>
        </NextRouterProvider>
      </body>
    </html>
  );
}
