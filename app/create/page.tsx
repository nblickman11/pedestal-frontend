'use client';

import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

export default function CreateGame() {
	const [duration, setDuration] = useState(12);

	return (
		<main className="flex min-h-screen items-center justify-center bg-black text-white p-24 antialiased">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					console.log('submitted');
				}}
			>
				<div className="flex space-x-8">
					<div id="left" className="space-y-12">
						<div className="flex flex-col">
							<label className="text-white font-bold">Game Name</label>
							<input
								className="bg-transparent mt-4 text-white text-3xl placeholder-white/20 outline-none focus-within:outline-none focus:outline-none active:outline-none"
								placeholder="Trade Week"
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
							<Slider className="mt-4" defaultValue={[duration]} max={60} min={6} step={4} onValueChange={(values) => setDuration(values[0])} />
						</div>
					</div>
					<div className="space-y-12" id="right">
						<div className="flex flex-col">
							<label className="text-white font-bold">Stake Amount</label>
							<div className="flex items-end justify-start">
								<input
									className="bg-transparent mt-4 w-1/2 text-white text-3xl placeholder-white/10 outline-none focus-within:outline-none focus:outline-none active:outline-none inline-block"
									placeholder="0.3"
									type="text"
								/>
								<div>
									<span> ETH </span>
								</div>
							</div>
						</div>
						<div className="flex flex-col mt-4">
							<label className="text-white font-bold">Starting Balance</label>
							<div className="flex items-end justify-start">
								<input
									className="bg-transparent mt-4 w-1/2 text-white text-3xl placeholder-white/10 outline-none focus-within:outline-none focus:outline-none active:outline-none inline-block"
									placeholder="0.3"
									type="text"
								/>
								<div>
									<span> ETH </span>
								</div>
							</div>
						</div>
						<div className="flex flex-col mt-4">
							<label className="text-white font-bold">Game Type</label>

							<p className="uppercase mt-3 text-xs tracking-widest px-3 py-2 bg-white/10 rounded-md">Winner takes all</p>
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
