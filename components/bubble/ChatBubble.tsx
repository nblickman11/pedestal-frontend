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

export default ChatBubble;
export { TimeWrapper, MessageContainerWrapper, AuthorWrapper };
