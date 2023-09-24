const Leaderboard = ({ players }: { players: [] }) => {
	return (
		<div>
			<h1>Leaderboard</h1>
			<div>
				{players?.map((player: any, index: number) => {
					return (
						<div
							key={index}
							className="flex items-center justify-between w-full px-3 py-2 mt-2 text-xs font-semibold text-white rounded-md bg-white/10"
						>
							<div className="flex items-center space-x-2">
								<div className="w-6 h-6 rounded-full bg-white/20"></div>
								<p>
									{
										// show only first 3 and last 3 characters of the address
										player?.substring(0, 3) + '...' + player?.substring(player?.length - 3)
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
