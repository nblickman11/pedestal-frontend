'use client';

import { motion } from 'framer-motion';

const buttonClick = {
	scale: 0.9,
	transition: { duration: 0.1 },
};

const buttonHover = {
	scale: 1.1,
	transition: { duration: 0.1 },
};

export default function Home() {
	return (
		<main className="flex min-h-screen items-center justify-center p-24 bg-black antialiased">
			<div>
				<h1 className="text-6xl text-center font-bold text-white">
					Out–invest <br /> your friends
				</h1>
				<div className="flex items-center justify-center space-x-4 mt-8">
					<motion.button
						whileTap={buttonClick}
						whileHover={buttonHover}
						className="p-4 rounded-lg bg-[#1A1A1A] text-sm text-white uppercase tracking-wider"
					>
						{' '}
						Create Game{' '}
					</motion.button>
					<motion.button
						whileTap={buttonClick}
						whileHover={buttonHover}
						className="p-4 rounded-lg bg-[#3B6D82] text-sm text-white uppercase tracking-wider"
					>
						{' '}
						Join Game{' '}
					</motion.button>
				</div>
			</div>
		</main>
	);
}
