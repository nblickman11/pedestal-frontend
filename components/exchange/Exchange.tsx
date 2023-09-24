'use client';
import React, { useEffect, useState } from 'react';
import { darkTheme, lightTheme, Theme, SwapWidget } from '@uniswap/widgets';
import '@uniswap/widgets/fonts.css';
import { usePrivy, useWallets } from '@privy-io/react-auth';

// We recommend you pass your own JSON-RPC endpoints.
const jsonRpcUrlMap = {
	5: ['https://eth-goerli.g.alchemy.com/v2/9WV1x_q7J1aA5kmLv9VGVSX82yJjN6Gs'],
};

const myDarkTheme: Theme = {
	...darkTheme, // Extend the darkTheme
	accent: '#2172E5',
};

const Exchange = () => {
	const { authenticated } = usePrivy();
	const { wallets } = useWallets();
	const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');

	console.log('Wallets:', wallets);
	console.log('Embedded Wallet:', embeddedWallet);
	const [provider, setProvider] = useState<any | undefined>();

	useEffect(() => {
		const fetchProvider = async () => {
			if (embeddedWallet) {
				await embeddedWallet?.switchChain(5);
				const provider = await embeddedWallet.getEthersProvider();
				console.log('Provider:', provider);
				setProvider(provider);
			} else {
				console.log('Unable to fetch any embedded wallet');
			}
		};

		if (authenticated) {
			fetchProvider();
		}
	}, [embeddedWallet]);

	return (
		<div>
			{provider && (
				<div className="flex items-center justify-center Uniswap">
					<SwapWidget brandedFooter={false} hideConnectionUI theme={myDarkTheme} provider={provider} width={'100%'} jsonRpcUrlMap={jsonRpcUrlMap} />
				</div>
			)}
			{!provider && (
				<div className="w-full">
					<h1>Unable to load exchange interface</h1>
				</div>
			)}
		</div>
	);
};

export default Exchange;
