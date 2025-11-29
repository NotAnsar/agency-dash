import { ClerkProvider } from '@clerk/nextjs';

import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';

const fontSans = Inter({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['200', '300', '400', '500', '600', '700'],
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang='en' suppressHydrationWarning>
				<body
					className={cn(
						`${fontSans.variable} font-sans antialiased bg-background`
					)}
				>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem
						disableTransitionOnChange
					>
						{children}
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
