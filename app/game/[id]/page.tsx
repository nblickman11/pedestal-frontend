'use client';

import Exchange from '@/components/exchange/Exchange';
import endpoints from '@/utls/endpoints';
import { usePrivy, useLogin, useWallets } from '@privy-io/react-auth';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';

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
	const { ready, authenticated, logout, createWallet } = usePrivy();

	const { login: privyLogin } = useLogin({
		onComplete: async (user, isNewUser, wasAlreadyAuthenticated) => {
			const { id, wallet } = user;
			console.log('USER====', id, wallet?.address);

			const { data } = await axios.post(endpoints.createPlayer, {
				primary: wallet?.address,
				privyId: id,
			});

			console.log('Player Created', data);
			toast.success('Logged In!');
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

	const { wallets } = useWallets();

	const handleJoinGame = async () => {
		// sends the transaction to the smart contract

		const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
		const externalWallet = wallets.find((wallet) => wallet.walletClientType === 'metamask');

		// make the external wallet sign and send a transaction of 2 ETH to 0x0000
		console.log('Embedded Wallet:', embeddedWallet);
		console.log('External Wallet:', externalWallet);

		if (externalWallet) {
			const provider = await externalWallet.getEthersProvider();
			const signer = provider.getSigner();
			const transaction = {
				to: '0x1B9AD081E4a94fbB566486F3D86F97a1dA1C94B0',
				value: ethers.utils.parseEther(game?.stakeAmount?.toString() || '0'),
			};

			try {
				const tx = await signer.sendTransaction(transaction);
				console.log('Transaction sent:', tx);

				// check if transaction is confirmed
				const receipt = await tx.wait();
				console.log('Transaction confirmed:', receipt);

				// call server to join game
			} catch (error) {
				console.error('Error sending transaction:', error);
			}
		} else {
			console.log('No external wallet found');
		}
	};

	if (!ready) {
		// Do nothing while the PrivyProvider initializes with updated user state
		return (
			<div className="flex items-center justify-center min-h-screen bg-black">
				<div> Loading</div>
			</div>
		);
	}

	return (
		<main className="min-h-screen p-24 bg-black ">
			<div className="flex items-center justify-center space-x-4 text-white">
				<h1 className="text-2xl uppercase">{game?.gameName}</h1>
				{authenticated ? (
					<motion.button
						onClick={handleJoinGame}
						whileTap={buttonClick}
						whileHover={buttonHover}
						className="p-2 rounded-lg bg-[#3B6D82] text-xs font-semibold text-white uppercase tracking-wider"
					>
						{' '}
						Join Contest{' '}
					</motion.button>
				) : (
					<button onClick={privyLogin}> Connect Wallet </button>
				)}
				<br />
				{authenticated && <button onClick={logout}> Disconnect </button>}
			</div>
			<div className="flex justify-between w-full mt-12 text-white">
				<p> Stake Amount: {game?.stakeAmount + ' ETH'}</p>
				<div>
					<p> Required Balance to Start: {game?.balanceToStart + ' ETH'} </p>
					<p> Current Balance: 0 ETH </p>
				</div>
				<p> Duration: {game?.duration + ' hours'} </p>
			</div>
			<div className="flex w-full mt-12 space-x-4 text-white">
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
			<div className="flex w-full mt-12 space-x-4 text-white">
				<div className="w-1/2">
					<Exchange />
				</div>
				<div className="w-1/2">
					<p> Activity </p>
					<div className="w-full h-[400px] bg-white/5 rounded-md mt-2"></div>
				</div>
			</div>
		</main>
	);
}
