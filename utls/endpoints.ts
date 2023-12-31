const baseURL = 'https://pedestal-backend.vercel.app/v1';

const endpoints = {
	createGame: `${baseURL}/createGame`,
	manageGame: `${baseURL}/manageGame`,
	createPlayer: `${baseURL}/player/privy`,
	joinPlayer: `${baseURL}/gamePlay/join`,
	depositDone: `${baseURL}/gamePlay/deposits`,
};

export default endpoints;
