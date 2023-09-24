import { motion } from 'framer-motion';

const ChatBubble = ({ children }: { children: any }) => {
	return <div className="px-3 py-2 text-sm antialiased bg-blue-600 rounded-md">{children}</div>;
};

const TimeWrapper = ({ children }: { children: any }) => {
	return <div className="text-xs opacity-30">{children}</div>;
};

const MessageContainerWrapper = ({ children }: { children: any }) => {
	return <div className="h-[450px] overflow-scroll">{children}</div>;
};

const AuthorWrapper = ({ children }: { children: any }) => {
	return <div className="flex my-2 space-x-2 text-xs tracking-widest uppercase opacity-50">{children}</div>;
};

const ChatContainer = ({ children }: { children: any }) => {
	return <div className="flex flex-col w-full h-full bg-black">{children}</div>;
};

const ChatButton = ({ children }: { children: any }) => {
	return (
		<motion.button
			whileHover={{
				scale: 1.05,
			}}
			whileTap={{
				scale: 0.9,
			}}
			className="p-4 mt-36 m-auto w-1/2 rounded-lg bg-[#3B6D82] text-xs font-semibold text-white uppercase tracking-wider"
		>
			{children}
		</motion.button>
	);
};

export default ChatBubble;
export { TimeWrapper, MessageContainerWrapper, AuthorWrapper, ChatButton, ChatContainer };
