'use client';

import { Slider } from '@/components/ui/slider';
import endpoints from '@/utls/endpoints';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CreateGame() {
	const [duration, setDuration] = useState(24);
	const [gameName, setGameName] = useState('');
	const [maxPlayers, setMaxPlayers] = useState(4);
	const [stakeAmount, setStakeAmount] = useState(1);
	const [balanceToStart, setBalanceToStart] = useState(1);

	const router = useRouter();

	const handleCreateGame = async () => {
		// check if title is empty
		if (gameName === '') {
			toast.error('Game name cannot be empty');
			return;
		}

		// check if stake amount is empty
		if (stakeAmount === 0) {
			toast.error('Stake amount cannot be empty');
			return;
		}

		// check if balance to start is empty
		if (balanceToStart === 0) {
			toast.error('Balance to start cannot be empty');
			return;
		}

		// check if max players is empty
		if (maxPlayers === 0) {
			toast.error('Max players cannot be empty');
			return;
		}

		// check if duration is empty
		if (duration === 0) {
			toast.error('Duration cannot be empty');
			return;
		}

		const reqObj = {
			duration,
			gameName,
			maxPlayers,
			stakeAmount,
			balanceToStart,
		};

		console.log(endpoints.createGame, reqObj);

		const response = await axios.post(endpoints.createGame, reqObj, {
			headers: {
				'Content-Type': 'application/json',
			},
		});

		console.log(response.data);

		if (response.data.gameId) {
			toast.loading('Game created successfully! Redirecting you...');
			setTimeout(() => {
				router.push(`/game/${response.data.gameId}`);
			}, 2000);
		} else {
			toast.error('Something went wrong. Please try again.');
		}

		// get the form ID and redirect to the game page
	};

	return (
		<main className="flex min-h-screen items-center justify-center bg-black text-white p-24 antialiased">
			<Toaster />
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleCreateGame();
				}}
			>
				<div className="flex space-x-8">
					<div id="left" className="space-y-12">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.2, delay: 0.1 }}
							className="flex flex-col"
						>
							<label className="text-white font-bold">Game Name</label>
							<motion.input
								className="bg-transparent mt-4 text-white text-3xl placeholder-white/20 outline-none focus-within:outline-none focus:outline-none active:outline-none"
								placeholder="Trade Week"
								type="text"
								value={gameName}
								onChange={(e) => setGameName(e.target.value)}
							/>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.2, delay: 0.1 }}
							className="flex flex-col mt-4"
						>
							<label className="text-white font-bold">Max Players</label>
							<input
								className="bg-transparent mt-4 text-white text-3xl placeholder-white/10 outline-none focus-within:outline-none focus:outline-none active:outline-none"
								placeholder="4"
								type="number"
								step={1}
								min={2}
								value={maxPlayers}
								onChange={(e) => {
									const value = parseInt(e.target.value);
									if (!isNaN(value)) {
										setMaxPlayers(value);
									} else {
										setMaxPlayers(2);
									}
								}}
							/>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.2, delay: 0.15 }}
							className="flex flex-col mt-4"
						>
							<label className="text-white font-bold">Duration: {duration} hours </label>
							<Slider
								className="mt-4 w-1/2"
								defaultValue={[duration]}
								max={60}
								min={6}
								step={4}
								onValueChange={(values) => setDuration(values[0])}
							/>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.2, delay: 0.15 }}
							className="flex flex-col mt-4"
						>
							<label className="text-white font-bold">Game Type</label>
							<p className="uppercase mt-3 font-medium text-xs w-1/2 tracking-widest py-2 rounded-md inline-block">🏆 – Winner takes all</p>
						</motion.div>
					</div>
					<div className="space-y-12" id="right">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.2, delay: 0.1 }}
							className="flex flex-col"
						>
							<label className="text-white font-bold">Stake Amount</label>
							<div className="flex items-end justify-start">
								<input
									className="bg-transparent mt-4 w-1/2 text-white text-3xl placeholder-white/10 outline-none focus-within:outline-none focus:outline-none active:outline-none inline-block"
									placeholder="0.3"
									type="number"
									step={0.1}
									min={0}
									value={stakeAmount}
									onChange={(e) => {
										const value = parseFloat(e.target.value);
										if (!isNaN(value)) {
											setStakeAmount(value);
										} else {
											setStakeAmount(0);
										}
									}}
								/>
								<div>
									<span> ETH </span>
								</div>
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.2, delay: 0.1 }}
							className="flex flex-col mt-4"
						>
							<label className="text-white font-bold">Starting Balance</label>
							<div className="flex items-end justify-start">
								<input
									className="bg-transparent mt-4 w-1/2 text-white text-3xl placeholder-white/10 outline-none focus-within:outline-none focus:outline-none active:outline-none inline-block"
									placeholder="0.3"
									type="number"
									step={0.1}
									min={0}
									value={balanceToStart}
									onChange={(e) => {
										const value = parseFloat(e.target.value);
										if (!isNaN(value)) {
											setBalanceToStart(value);
										} else {
											setBalanceToStart(0);
										}
									}}
								/>
								<div>
									<span> ETH </span>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
				<div className="mt-12 w-full">
					<motion.button
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0, transition: { duration: 0.2, delay: 0.2 } }}
						whileTap={{ scale: 0.9 }}
						whileHover={{ scale: 1.1 }}
						transition={{ duration: 0.1 }}
						type="submit"
						className="px-3 py-4 bg-[#3B6D82] text-sm text-white rounded-sm w-1/2"
					>
						Create Game
					</motion.button>
				</div>
			</form>
		</main>
	);
}
