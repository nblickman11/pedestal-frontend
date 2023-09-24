const Leaderboard = ({ players }: { players: [] }) => {
	return (
		<div>
			<h1 className="m-auto text-xs tracking-widest uppercase text-white/50">Leaderboard</h1>
			<div>
				{players?.map((player: any, index: number) => {
					return (
						<div
							key={index}
							className="flex items-center justify-between w-full px-3 py-2 m-auto mt-2 text-sm font-semibold text-white rounded-md bg-white/10"
						>
							<div className="flex items-center space-x-2">
								<div className="w-6 h-6 rounded-full bg-white/20"></div>
								<p>
									{
										// show only first 3 and last 3 characters of the address
										player?.substring(0, 5) + '...' + player?.substring(player?.length - 4)
									}
								</p>
							</div>
							<p>RANK {index + 1}</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Leaderboard;
