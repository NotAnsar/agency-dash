import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';

import { ClerkThemeProvider } from '@/components/ClerkThemeProvider';

const fontSans = Inter({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['200', '300', '400', '500', '600', '700'],
});

export const metadata = {
	title: 'Agency Dash',
	description: 'Manage your agencies with ease.',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body
				className={cn(
					`${fontSans.variable} font-sans antialiased bg-background`
				)}
				suppressHydrationWarning
			>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					<ClerkThemeProvider>{children}</ClerkThemeProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
