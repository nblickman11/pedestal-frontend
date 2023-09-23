'use client';

import { Slider } from '@/components/ui/slider';

export default function CreateGame() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-[#101010] text-white p-24">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					console.log('submitted');
				}}
			>
				<div className="flex">
					<div id="left">
						<div className="flex flex-col">
							<label className="text-white font-bold">Game Name</label>
							<input
								className="bg-transparent mt-4 text-white text-3xl placeholder-white/10 outline-none focus-within:outline-none focus:outline-none active:outline-none"
								placeholder="Party Night"
								type="text"
							/>
						</div>
						<div className="flex flex-col mt-4">
							<label className="text-white font-bold">Max Players</label>
							<input
								className="bg-transparent mt-4 text-white text-3xl placeholder-white/10 outline-none focus-within:outline-none focus:outline-none active:outline-none"
								placeholder="4"
								type="text"
							/>
						</div>
						<div className="flex flex-col mt-4">
							<label className="text-white font-bold">Duration</label>
							<Slider className="mt-4" min={1} max={10} step={1} />
						</div>
					</div>
					<div id="right">
						<div className="flex flex-col">
							<label className="text-white font-bold">Stake Amount</label>
							<input
								className="bg-transparent mt-4 text-white text-3xl placeholder-white/10 outline-none focus-within:outline-none focus:outline-none active:outline-none"
								placeholder="0.3 ETH"
								type="text"
							/>
						</div>
						<div className="flex flex-col mt-4">
							<label className="text-white font-bold">Starting Balance</label>
							<input
								className="bg-transparent mt-4 text-white text-3xl placeholder-white/10 outline-none focus-within:outline-none focus:outline-none active:outline-none"
								placeholder="0.1 ETH"
								type="text"
							/>
						</div>
						<div className="flex flex-col mt-4">
							<label>Game Type</label>
							<p className="disabled">Winner takes all</p>
						</div>
					</div>
				</div>
				<div className="mt-6">
					<button className="px-3 py-2 bg-white/10 text-white rounded-sm"> Create Game</button>
				</div>
			</form>
		</main>
	);
}
