class Player {

	/**
	 * @param {Array} cards - An array including the starting cards for the player
	 */
	constructor(cards) {
		console.log(this);

		this.hand = cards;
	}

	getHand() {
		return this.hand;
	}
}
