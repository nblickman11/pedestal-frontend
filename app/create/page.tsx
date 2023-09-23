'use client';

export default function CreateGame() {
	return (
		<main className="flex min-h-screen items-center justify-center p-24">
			<div>
				<div id="left">
					<div>
						<label>Game Name</label>
						<input type="text" />
					</div>
					<div>
						<label>Max No. of Players</label>
						<input type="text" />
					</div>
					<div>
						<label>Duration: 18 hours</label>
						<input type="text" />
					</div>
				</div>
				<div id="right">
					<div>
						<label>Game Name</label>
						<input type="text" />
					</div>
					<div>
						<label>Max No. of Players</label>
						<input type="text" />
					</div>
					<div>
						<label>Duration: 18 hours</label>
						<input type="text" />
					</div>
				</div>
			</div>
		</main>
	);
}
