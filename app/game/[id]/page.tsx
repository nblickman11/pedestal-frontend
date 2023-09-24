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
	deposits: [];
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
	const { ready, authenticated, logout } = usePrivy();

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

				// call server to join game
				const depositDoneEndpoint = endpoints.depositDone;

				const { data } = await axios.put(depositDoneEndpoint, {
					gameId: params.id,
					primaryAddr: externalWallet?.address,
					secondaryAddr: embeddedWallet?.address,
				});

				console.log('Player Deposit Completed:', data.data);
				setGame(data.data);

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

	// isAlreadyJoined
	//@ts-ignore
	const isAlreadyJoined = game?.players?.includes(embeddedWallet?.address);
	// isAlreadyDeposited
	//@ts-ignore
	const isAlreadyDeposited = game?.deposits?.includes(embeddedWallet?.address);

	console.log('isAlreadyJoined:', isAlreadyJoined);
	console.log('isAlreadyDeposited:', isAlreadyDeposited);

	return (
		<main className="min-h-screen p-12 bg-black ">
			<Toaster />
			<div className="flex items-center justify-center space-x-4 text-white">
				<h1 className="text-2xl uppercase">{game?.gameName}</h1>

				{authenticated ? (
					<span> </span>
				) : (
					<button className="px-3 py-2 text-white rounded-md bg-white/10" onClick={privyLogin}>
						{' '}
						Connect Wallet{' '}
					</button>
				)}
				<br />
				{authenticated && (
					<button className="px-3 py-2 text-white rounded-md bg-white/10" onClick={logout}>
						{' '}
						Disconnect{' '}
					</button>
				)}
				<div className="flex px-3 py-2 space-x-2 border rounded-md border-white/10">
					<p> Pool Prize </p>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12Z"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
						<path
							d="M4.75 7.77772L5.09234 7.11041C4.85983 6.99113 4.58201 7.00147 4.35901 7.1377C4.13601 7.27393 4 7.5164 4 7.77772H4.75ZM19.25 7.77772H20C20 7.52567 19.8734 7.29048 19.663 7.15169L19.25 7.77772ZM4.75 16.25H4C4 16.5171 4.14208 16.7641 4.373 16.8984L4.75 16.25ZM19.25 16.25L18.9889 16.9531C19.2191 17.0386 19.4766 17.006 19.6782 16.8658C19.8798 16.7256 20 16.4956 20 16.25H19.25ZM4.75 7.77772C4.40766 8.44503 4.40799 8.4452 4.40833 8.44537C4.40846 8.44544 4.40881 8.44562 4.40907 8.44575C4.40959 8.44602 4.41016 8.44631 4.41078 8.44662C4.41203 8.44726 4.41347 8.44799 4.41512 8.44882C4.41841 8.45047 4.42251 8.45252 4.4274 8.45494C4.43718 8.45977 4.45015 8.46607 4.46623 8.47369C4.49837 8.48893 4.54297 8.50943 4.59942 8.53387C4.71225 8.58274 4.87276 8.64751 5.07597 8.71754C5.48191 8.85742 6.06138 9.01934 6.77387 9.1163C8.2023 9.31068 10.1668 9.24343 12.3226 8.21638L11.6774 6.86222C9.83315 7.74087 8.1727 7.79283 6.97613 7.63C6.37612 7.54835 5.89309 7.41255 5.56466 7.29938C5.40068 7.24287 5.27603 7.19227 5.19551 7.1574C5.15527 7.13998 5.12614 7.12652 5.10873 7.11826C5.10002 7.11414 5.09425 7.11131 5.09149 7.10995C5.09011 7.10927 5.08949 7.10895 5.08962 7.10902C5.08969 7.10906 5.08995 7.10919 5.0904 7.10942C5.09063 7.10953 5.0909 7.10967 5.09123 7.10984C5.09139 7.10992 5.09167 7.11006 5.09175 7.1101C5.09204 7.11025 5.09234 7.11041 4.75 7.77772ZM12.3226 8.21638C14.1399 7.35058 15.7744 7.40648 16.959 7.67528C17.554 7.81027 18.0344 7.99911 18.3627 8.1522C18.5265 8.22858 18.6512 8.29552 18.7322 8.34148C18.7726 8.36443 18.8019 8.38209 18.8196 8.39297C18.8285 8.39841 18.8344 8.40215 18.8373 8.40401C18.8388 8.40494 18.8395 8.4054 18.8394 8.40537C18.8394 8.40535 18.8392 8.40521 18.8388 8.40494C18.8386 8.40481 18.8383 8.40464 18.838 8.40444C18.8379 8.40434 18.8376 8.40417 18.8375 8.40412C18.8373 8.40394 18.837 8.40375 19.25 7.77772C19.663 7.15169 19.6627 7.15148 19.6624 7.15127C19.6623 7.15119 19.6619 7.15096 19.6617 7.1508C19.6612 7.15047 19.6606 7.15011 19.66 7.14972C19.6588 7.14893 19.6574 7.14802 19.6558 7.14698C19.6526 7.1449 19.6486 7.14231 19.6438 7.13924C19.6342 7.1331 19.6213 7.12504 19.6054 7.11524C19.5735 7.09565 19.5292 7.06909 19.4729 7.03715C19.3605 6.97329 19.2001 6.88761 18.9967 6.79275C18.5906 6.60338 18.0085 6.37528 17.291 6.21246C15.8506 5.88562 13.8601 5.82231 11.6774 6.86222L12.3226 8.21638ZM4.75 16.25C4.373 16.8984 4.37329 16.8985 4.3736 16.8987C4.37372 16.8988 4.37404 16.899 4.37428 16.8991C4.37475 16.8994 4.37528 16.8997 4.37586 16.9C4.37702 16.9007 4.37838 16.9015 4.37993 16.9024C4.38305 16.9041 4.38697 16.9064 4.39169 16.909C4.40112 16.9143 4.41372 16.9213 4.42943 16.9299C4.46084 16.9469 4.50468 16.9701 4.56033 16.9981C4.67159 17.0541 4.83043 17.1295 5.03188 17.2134C5.43424 17.381 6.01007 17.5843 6.71911 17.735C8.13833 18.0365 10.1044 18.1294 12.2707 17.2908L11.7293 15.892C9.89564 16.6018 8.23667 16.5239 7.03089 16.2677C6.42743 16.1395 5.94076 15.9671 5.60874 15.8288C5.44301 15.7597 5.31669 15.6995 5.23459 15.6582C5.19357 15.6376 5.16368 15.6217 5.14552 15.6118C5.13645 15.6069 5.13032 15.6035 5.1272 15.6017C5.12564 15.6009 5.12484 15.6004 5.12481 15.6004C5.12479 15.6004 5.12496 15.6005 5.12533 15.6007C5.12551 15.6008 5.12574 15.6009 5.12602 15.6011C5.12616 15.6012 5.12641 15.6013 5.12648 15.6013C5.12673 15.6015 5.127 15.6016 4.75 16.25ZM12.2707 17.2908C14.1437 16.5658 15.8386 16.4866 17.0634 16.5875C17.6757 16.638 18.1683 16.7334 18.5031 16.8145C18.6703 16.855 18.7977 16.8919 18.8804 16.9175C18.9217 16.9303 18.9519 16.9403 18.9702 16.9466C18.9793 16.9497 18.9855 16.9519 18.9886 16.953C18.9902 16.9536 18.991 16.9539 18.9911 16.9539C18.9911 16.9539 18.9909 16.9538 18.9906 16.9537C18.9904 16.9536 18.9901 16.9535 18.9899 16.9534C18.9897 16.9534 18.9895 16.9533 18.9894 16.9533C18.9892 16.9532 18.9889 16.9531 19.25 16.25C19.5111 15.5469 19.5108 15.5468 19.5105 15.5467C19.5104 15.5467 19.5101 15.5465 19.5098 15.5464C19.5094 15.5463 19.5088 15.5461 19.5083 15.5459C19.5071 15.5454 19.5057 15.5449 19.5042 15.5444C19.5011 15.5432 19.4972 15.5418 19.4925 15.5402C19.4831 15.5368 19.4705 15.5324 19.4549 15.5271C19.4236 15.5164 19.38 15.502 19.3247 15.4848C19.214 15.4505 19.0562 15.4051 18.8563 15.3567C18.4567 15.2599 17.8868 15.1503 17.1866 15.0926C15.7864 14.9772 13.8563 15.0686 11.7293 15.892L12.2707 17.2908ZM5.5 16.25V7.77772H4V16.25H5.5ZM18.5 7.77772V16.25H20V7.77772H18.5Z"
							fill="currentColor"
						></path>
					</svg>
					<div>
						{
							// players array length * stake amount
							//@ts-ignore
							game?.players?.length * game?.stakeAmount + ' ETH'
						}
					</div>
				</div>
			</div>
			<div className="flex justify-center w-full mt-12 space-x-6 text-white">
				<div className="flex">
					<p className="px-3 py-1 rounded-l-md bg-white/10"> Stake Amount: {game?.stakeAmount + ' ETH'}</p>
					{isAlreadyJoined ? (
						<button disabled className="p-2 rounded-r-md bg-[#115d40] text-xs font-semibold text-white uppercase tracking-wider">
							{' '}
							Joined{' '}
						</button>
					) : (
						<motion.button
							onClick={handleJoinGame}
							whileTap={buttonClick}
							whileHover={buttonHover}
							className="p-2 bg-[#948a23] rounded-r-md text-xs font-semibold text-white uppercase tracking-wider"
						>
							{' '}
							Join Contest{' '}
						</motion.button>
					)}
				</div>
				<div
					className={`flex cursor-not-allowed ${
						//@ts-ignore
						!isAlreadyJoined && 'opacity-20'
					}`}
				>
					<p className="px-3 py-1 rounded-md bg-white/10"> Required Balance to Start: {game?.balanceToStart + ' ETH'} </p>
					<button
						onClick={
							isAlreadyJoined
								? isAlreadyDeposited
									? () => {
											toast.error('Deposit complete');
									  }
									: handlePlayingDeposit
								: () => {
										toast.error('You are not playing this game');
								  }
						}
						className={`p-2 rounded-r-md bg-[#948a23] text-xs font-semibold text-white uppercase tracking-wider ${
							// @ts-ignore
							isAlreadyJoined && isAlreadyDeposited ? 'cursor-not-allowed' : ''
						}`}
					>
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
					<h1 className="m-auto text-xs tracking-widest uppercase text-white/50">Chat</h1>
					<Home />
				</div>
			</div>
			]
			<div className="flex w-full mt-12 space-x-4 text-white">
				<div className="w-1/2">
					<Exchange />
				</div>
				<div className="w-1/2">
					<h1 className="m-auto text-xs tracking-widest uppercase text-white/50">Activity</h1>

					<div className="w-full h-[400px] bg-white/5 rounded-md mt-2"></div>
				</div>
			</div>
		</main>
	);
}
