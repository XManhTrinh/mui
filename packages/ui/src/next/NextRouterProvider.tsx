'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { RouterProvider } from 'react-aria';

export interface NextRouterProviderProps {
  children?: ReactNode;
}

/**
 * Routes every library link (`href` on buttons, menu items, tabs, …) through the
 * Next.js router for client-side navigation. Render it once inside the root layout.
 */
export function NextRouterProvider({ children }: NextRouterProviderProps) {
  const router = useRouter();
  return <RouterProvider navigate={(href) => router.push(href)}>{children}</RouterProvider>;
}
