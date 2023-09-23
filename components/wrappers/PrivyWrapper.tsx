'use client';

import { PrivyProvider } from '@privy-io/react-auth';

interface PrivyWrapperProps {
	children: React.ReactNode;
}

function PrivyWrapper({ children }: PrivyWrapperProps) {
	const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID as string;
	return (
		<PrivyProvider appId={appId} onSuccess={() => console.log('Success!')}>
			{children}
		</PrivyProvider>
	);
}

export default PrivyWrapper;
