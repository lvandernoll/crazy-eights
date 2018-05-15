fetch('../.config')
	.then( response => response.json() )
	.then( responseJson => {
		const GAME = new GameController(responseJson);
	});
