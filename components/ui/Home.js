import { Client } from '@xmtp/xmtp-js';
import { Wallet, ethers } from 'ethers';
import React, { useEffect, useState, useRef } from 'react';
import styles from '../../styles/Home.module.css';
import Chat from './Chat';
import { usePrivy, useWallets } from '@privy-io/react-auth';

const PEER_ADDRESS = '0x7E0b0363404751346930AF92C80D1fef932Cc48a';

export default function Home() {
	const [messages, setMessages] = useState(null);
	const convRef = useRef(null);
	const clientRef = useRef(null);
	const [isOnNetwork, setIsOnNetwork] = useState(false);

	const { wallets } = useWallets();

	const newConversation = async (xmtp_client, addressTo) => {
		if (await xmtp_client?.canMessage(addressTo)) {
			const conversation = await xmtp_client.conversations.newConversation(addressTo);
			convRef.current = conversation;
			const messages = await conversation.messages();
			setMessages(messages);
		} else {
			console.log('cant message because address is not on the network.');
		}
	};

	const initXmtp = async () => {
		const externalWallet = wallets.find((wallet) => wallet.walletClientType === 'metamask');
		const provider = await externalWallet.getEthersProvider();
		const signer = provider.getSigner();

		const xmtp = await Client.create(signer, { env: 'production' });
		newConversation(xmtp, PEER_ADDRESS);

		setIsOnNetwork(!!xmtp.address);
		clientRef.current = xmtp;
	};

	useEffect(() => {
		if (isOnNetwork && convRef.current) {
			const streamMessages = async () => {
				const newStream = await convRef.current.streamMessages();
				for await (const msg of newStream) {
					const exists = messages.find((m) => m.id == msg.id);
					if (!exists) {
						setMessages((prevMessages) => {
							const msgnew = [...prevMessages, msg];
							return msgnew;
						});
					}
				}
			};
			streamMessages();
		}
	}, [messages, isOnNetwork]);

	return (
		<div className={styles.Home}>
			{!isOnNetwork && (
				<button onClick={initXmtp} className={styles.btnXmtp}>
					Connect to Chat
				</button>
			)}
			{isOnNetwork && messages && <Chat client={clientRef.current} conversation={convRef.current} messageHistory={messages} />}
		</div>
	);
}
