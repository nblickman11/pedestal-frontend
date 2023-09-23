'use client';

import { usePrivy } from '@privy-io/react-auth';

export default function Game() {
	const { authenticated, login, logout } = usePrivy();

	return (
		<main className="flex min-h-screen items-center justify-center p-24">
			<div>
				<h1>Game page</h1>
				{authenticated ? <button> Join Game </button> : <button onClick={login}> Login </button>}
				<br />
				{authenticated && <button onClick={logout}> Logout </button>}
			</div>
		</main>
	);
}
