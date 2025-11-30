'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import { ReactNode } from 'react';

export function ClerkThemeProvider({ children }: { children: ReactNode }) {
	const { resolvedTheme } = useTheme();
	const isDark = resolvedTheme === 'dark';

	return (
		<ClerkProvider
			appearance={{
				baseTheme: isDark ? dark : undefined,
			}}
		>
			{children}
		</ClerkProvider>
	);
}
