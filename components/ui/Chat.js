import React, { useState } from 'react';
import styles from '../../styles/Chat.module.css';
import ChatBubble, { AuthorWrapper, MessageContainerWrapper, TimeWrapper } from '../bubble/ChatBubble';

const Chat = ({ client, messageHistory, conversation }) => {
	const [inputValue, setInputValue] = useState('');

	const handleSend = async () => {
		if (inputValue) {
			await onSendMessage(inputValue);
			setInputValue('');
		}
	};

	const onSendMessage = async (value) => {
		return conversation.send(value);
	};

	const MessageList = ({ messages }) => {
		messages = messages.filter((v, i, a) => a.findIndex((t) => t.id == v.id) === i);

		return (
			<ul className="">
				{messages.map((message, index) => (
					<li key={message.id} className="w-full" title="Click to log this message to the console">
						<ChatBubble>
							<span className="px-2 py-1">{message.content}</span>
							<br />
						</ChatBubble>
						<AuthorWrapper>
							<div>{message.senderAddress === client.address ? 'You' : 'Bot'}</div>
							<TimeWrapper>
								<span className="text-xs"> {message.sent.toLocaleTimeString()}</span>
							</TimeWrapper>
						</AuthorWrapper>
					</li>
				))}
			</ul>
		);
	};

	const handleInputChange = (event) => {
		if (event.key === 'Enter') {
			handleSend();
		} else {
			setInputValue(event.target.value);
		}
	};
	return (
		<div className={'bg-black'}>
			<MessageContainerWrapper>
				<div className={styles.messageContainer}>
					<MessageList messages={messageHistory} />
				</div>
			</MessageContainerWrapper>
			<div className={styles.inputContainer}>
				<input
					type="text"
					className={'bg-black w-full outline-none focus:outline-none active:outline-none'}
					onKeyUp={handleInputChange}
					onChange={handleInputChange}
					value={inputValue}
					placeholder="Type a message..."
				/>
				<button className={'bg-white p-4 rounded-md'} onClick={handleSend}>
					&#128073;
				</button>
			</div>
		</div>
	);
};

export default Chat;
