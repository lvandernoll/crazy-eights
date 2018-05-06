class GameModel {

	/**
	 * @param {Controller} controller - The game's controller
	 */
	constructor(controller) {
		console.log(this);

		this.CONTROLLER = controller;

		this.pile = [];
		this.currentType;
		this.currentPlayerId = 0;
	}

	/**
	 * Removes all cards but the top one from the pile and returns these cards
	 * @returns {Array} - An array containing all taken cards
	 */
	takeCards() {
		let takenCards = this.pile;
		this.pile = [];
		this.pile.push(takenCards.pop());
		return takenCards;
	}

	/**
	 * Puts a card on top of the pile and changes the currentType variable to the type of that card
	 * @param {Object} card - The card to be added to the pile
	 */
	putCard(card) {
		this.pile.push(card);
		this.currentType = this.pile[this.pile.length - 1].type;
		this.checkCardRules(card);
	}

	/**
	 * Checks if there are any rules bound to a card and executes the rule if so
	 * @param {Object} card - The card to check
	 */
	checkCardRules(card) {
		switch( card.code ) {
			case 'B':
				this.CONTROLLER.openChangeTypePopup();
				break;
		}
	}

	/**
	 * Changes the current type
	 * @param {String} type - The type to change to
	 */
	changeType(type) {
		this.currentType = type;
	}

	/**
	 * Returns the top card of the pile
	 * @returns {Object} - An object containing the info of the top card
	 */
	getTopCard() {
		return this.pile[this.pile.length - 1];
	}

	/**
	 * Compares a card with the top card on the pile to see if it can be played
	 * @param {Object} card - The card to be compared
	 */
	compareCard(card) {
		if( this.pile.length === 0
		|| card.type === this.currentType
		|| card.code === this.getTopCard().code
		|| card.type === 'joker'
		|| this.getTopCard().type === 'joker' ) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Returns the player who's turn it currently is
	 * @returns {number} - The id of the current player
	 */
	currentPlayer() {
		return this.currentPlayer;
	}
}
