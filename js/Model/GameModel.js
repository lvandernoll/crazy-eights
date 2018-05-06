class GameModel {

	constructor() {
		console.log(this);

		this.pile = [];
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
	 * Puts a card on top of the pile
	 * @param {Object} card - The card to be added to the pile
	 */
	putCard(card) {
		this.pile.push(card);
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
		|| card.type === this.getTopCard().type
		|| card.code === this.getTopCard().code
		|| card.type === 'joker'
		|| this.getTopCard().type === 'joker' ) {
			return true;
		} else {
			return false;
		}
	}
}
