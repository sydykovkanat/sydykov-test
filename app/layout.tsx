import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { TanstackQueryProvider } from '@/providers';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Sydykov Cloud',
	description: 'Персональное облачное хранилище',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='ru'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<TanstackQueryProvider>
					{children}
					<Toaster position='bottom-right' richColors closeButton />
				</TanstackQueryProvider>
			</body>
		</html>
	);
}
