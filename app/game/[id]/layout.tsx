import PrivyWrapper from '@/components/wrappers/PrivyWrapper';
import '../../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Game Page',
	description: 'Outinvest everyone',
};

export default function GameLayout({ children }: { children: React.ReactNode }) {
	return (
		<PrivyWrapper>
			<html lang="en">
				<body className={inter.className}>{children}</body>
			</html>
		</PrivyWrapper>
	);
}
