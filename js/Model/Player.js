class Player {

	/**
	 * @param {Array} cards - An array containing the starting cards for the player
	 */
	constructor(cards) {
		console.log(this);

		this.hand = cards;
	}

	/**
	 * @returns {Array} - An array containing the starting cards for the player
	 */
	getHand() {
		return this.hand;
	}

	/**
	 * Adds a card to the player's hand
	 * @param {Array} cards - An array containing the cards to be added to the player's hand
	 */
	giveCards(cards) {
		for( let i = 0; i < cards.length; i++ ) {
			this.hand.push(cards[i]);
		}
	}

	/**
	 * Removes a card from the player's hand
	 * @param {number} cardId - The index of the card to be removed from the player's hand
	 */
	removeCard(cardId) {
		this.hand.splice(cardId, 1);
	}
}
