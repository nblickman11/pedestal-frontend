'use client';

import endpoints from '@/utls/endpoints';
import { usePrivy, useLogin } from '@privy-io/react-auth';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Game = {
	balanceToStart: number;
	createdAt: string;
	duration: number;
	gameName: string;
	maxPlayers: number;
	players: [];
	stakeAmount: number;
	updatedAt: string;
};

const buttonClick = {
	scale: 0.9,
	transition: { duration: 0.1 },
};

const buttonHover = {
	scale: 1.1,
	transition: { duration: 0.1 },
};

export default function Game({ params }: { params: { id: string } }) {
	const { authenticated, logout } = usePrivy();

	const { login: privyLogin } = useLogin({
		onComplete: async (user, isNewUser, wasAlreadyAuthenticated) => {
			console.log('LOGIN====', user, isNewUser, wasAlreadyAuthenticated);
		},
		onError: (error) => {
			console.log(error);
		},
	});

	const [game, setGame] = useState<Game | null>(null);

	useEffect(() => {
		// fetch game data
		const fetchGame = async () => {
			const { data } = await axios.get(endpoints.manageGame + '/' + params.id);
			console.log('Retrieved Data:', data);
			setGame(data);
		};

		fetchGame();
	}, []);

	return (
		<main className=" bg-black min-h-screen p-24">
			<div className="text-white flex items-center justify-center space-x-4">
				<h1 className="text-2xl uppercase">{game?.gameName}</h1>
				{authenticated ? (
					<motion.button
						whileTap={buttonClick}
						whileHover={buttonHover}
						className="p-2 rounded-lg bg-[#3B6D82] text-xs font-semibold text-white uppercase tracking-wider"
					>
						{' '}
						Join Game{' '}
					</motion.button>
				) : (
					<button onClick={privyLogin}> Login </button>
				)}
				<br />
				{authenticated && <button onClick={logout}> Logout </button>}
			</div>
			<div className="w-full text-white flex justify-between mt-12">
				<p> Stake Amount: {game?.stakeAmount + ' ETH'}</p>
				<p> Balance to Start: {game?.balanceToStart + ' ETH'} </p>
				<p> Balance to Start: {game?.duration + ' hours'} </p>
			</div>
			<div className="w-full flex space-x-4 text-white mt-6">
				<div className="w-1/2">
					<p> Leaderboard </p>
					<div className="w-full h-[500px] bg-white/10 rounded-md mt-2"></div>
				</div>
				<div className="w-1/2">
					<p> Chat </p>
					<div className="w-full h-[500px] bg-white/10 rounded-md mt-2"></div>
				</div>
			</div>
			]
			<div className="w-full flex space-x-4 text-white mt-6">
				<div className="w-1/2">
					<p> Exchange </p>
					<div className="w-full h-[500px] bg-white/10 rounded-md mt-2"></div>
				</div>
				<div className="w-1/2">
					<p> Activity </p>
					<div className="w-full h-[500px] bg-white/10 rounded-md mt-2"></div>
				</div>
			</div>
		</main>
	);
}
