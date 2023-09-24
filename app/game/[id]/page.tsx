'use client';

import Exchange from '@/components/exchange/Exchange';
import endpoints from '@/utls/endpoints';
import { usePrivy, useLogin, useWallets } from '@privy-io/react-auth';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { ethers } from 'ethers';
import Home from '@/components/ui/Home';
import Leaderboard from '@/components/leaderboard/Leaderboard';

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

			const externalWallet = wallets.find((wallet) => wallet.walletClientType === 'metamask');
			console.log('USER====', id, externalWallet?.address);

			const { data } = await axios.post(endpoints.createPlayer, {
				primary: externalWallet?.address,
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
				toast.success('Staking started!');
				let loadingId = toast.loading('Waiting for staking to complete');

				// check if transaction is confirmed
				const receipt = await tx.wait();
				console.log('Transaction confirmed:', receipt);
				toast.dismiss(loadingId);

				// call server to join game
				const joiningEndpoint = endpoints.joinPlayer;

				const { data } = await axios.put(joiningEndpoint, {
					gameId: params.id,
					primaryAddr: externalWallet?.address,
					secondaryAddr: embeddedWallet?.address,
				});

				console.log('Player Joined:', data);
				setGame(data.data);
				toast.success('Joined Game!');
			} catch (error) {
				console.error('Error sending transaction:', error);
			}
		} else {
			console.log('No external wallet found');
		}
	};

	const handlePlayingDeposit = async () => {
		const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
		const externalWallet = wallets.find((wallet) => wallet.walletClientType === 'metamask');

		// make the external wallet sign and send a transaction of 2 ETH to 0x0000
		console.log('Embedded Wallet:', embeddedWallet);
		console.log('External Wallet:', externalWallet);

		if (externalWallet) {
			const provider = await externalWallet.getEthersProvider();
			const signer = provider.getSigner();
			const transaction = {
				to: embeddedWallet?.address,
				value: ethers.utils.parseEther(game?.stakeAmount?.toString() || '0'),
			};

			try {
				const tx = await signer.sendTransaction(transaction);
				console.log('Transaction sent:', tx);
				toast.success('Deposit started!');
				let loadingId = toast.loading('Waiting for deposit to complete');

				// check if transaction is confirmed
				const receipt = await tx.wait();
				console.log('Transaction confirmed:', receipt);
				toast.dismiss(loadingId);
				toast.success('Deposit completed!');
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
				<div> Loading </div>
			</div>
		);
	}

	const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');

	return (
		<main className="min-h-screen p-24 bg-black ">
			<Toaster />
			<div className="flex items-center justify-center space-x-4 text-white">
				<h1 className="text-2xl uppercase">{game?.gameName}</h1>
				{authenticated ? (
					//@ts-ignore
					game?.players?.includes(embeddedWallet?.address) ? (
						<button disabled className="p-2 rounded-lg bg-[#115d40] text-xs font-semibold text-white uppercase tracking-wider">
							{' '}
							Joined{' '}
						</button>
					) : (
						<motion.button
							onClick={handleJoinGame}
							whileTap={buttonClick}
							whileHover={buttonHover}
							className="p-2 rounded-lg bg-[#948a23] text-xs font-semibold text-white uppercase tracking-wider"
						>
							{' '}
							Join Contest{' '}
						</motion.button>
					)
				) : (
					<button onClick={privyLogin}> Connect Wallet </button>
				)}
				<br />
				{authenticated && <button onClick={logout}> Disconnect </button>}
			</div>
			<div className="flex justify-between w-full mt-12 text-white">
				<p className="px-3 py-1 rounded-md bg-white/10"> Stake Amount: {game?.stakeAmount + ' ETH'}</p>
				<div className="flex">
					<p className="px-3 py-1 rounded-md bg-white/10"> Required Balance to Start: {game?.balanceToStart + ' ETH'} </p>
					<button onClick={handlePlayingDeposit} className="px-2 py-1 bg-green-700 rounded-md">
						Deposit
					</button>
				</div>
				<p className="px-3 py-1 rounded-md bg-white/10"> Duration: {game?.duration + ' hours'} </p>
			</div>
			<div className="flex w-full mt-12 space-x-4 text-white">
				<div className="w-1/2">
					<Leaderboard
						players={
							//@ts-ignore
							game?.players ?? []
						}
					/>
				</div>
				<div className="w-1/2">
					<p> Chat </p>
					<Home />
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
