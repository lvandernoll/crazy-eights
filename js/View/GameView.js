class GameView {

	/**
	 * @param {Object} config - An object containing the {Object} cardtypes, {Boolean} includesJoker
	 * @param {Array} players - An array containing all {User|Computer} players
	 */
	constructor(config, players) {
		console.log(this);

		this.CONFIG = config;
		this.PLAYERS = players;

		this.OPPONENTHEADER = document.querySelector('#opponentHeader');
		this.showOpponentHeader();

	}

	/**
	 * Shows all opponent names, a card image, and their card count
	 */
	showOpponentHeader() {
		for( let i = 1; i <= this.CONFIG.computerCount; i++ ) {
			let opponentField = document.createElement('div');
			opponentField.setAttribute('id', 'opponent');
			let nameField = document.createTextNode(`Computer ${i}`);
			let imageField = document.createElement('img');
			imageField.setAttribute('src', `${this.CONFIG.imagesPath}/back.png`);
			let cardCountField = document.createTextNode(`× ${this.PLAYERS[i].hand.length}`);

			opponentField.appendChild(nameField);
			opponentField.appendChild(imageField);
			opponentField.appendChild(cardCountField);
			this.OPPONENTHEADER.appendChild(opponentField);
		}
	}
}
