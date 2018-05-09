class GameModel {

	/**
	 * @param {Object} config - An object containing the amount of players and more
	 * @param {Controller} controller - The game's controller
	 */
	constructor(config, controller) {
		console.log(this);

		this.CONFIG = config;
		this.CONTROLLER = controller;

		this.pile = [];
		this.currentType;
		this.playerCanPlay = true;
		this.currentPlayerId = 0;
		this.direction = 'clockwise';
		this.turn = 0;
		this.playAgain = false;
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
		// Only execute rules if the played card is not the starting card
		if( this.pile.length > 1 ) {
			this.checkCardRules(card);
		}
	}

	/**
	 * Checks if there are any rules bound to a card and executes the rule if so
	 * @param {Object} card - The card to check
	 */
	checkCardRules(card) {
		this.playAgain = false;
		switch( card.code ) {
			case 'A': // Change direction
				this.switchDirection();
				break;
			case 2: // Next player draws 2 cards
				this.CONTROLLER.drawCard(this.getNextPlayer(), 2);
				break;
			case 7: // Player has to play another turn
			case 'H':
				this.playAgain = true;
				break;
			case 8: // Next player has to skip a turn
				this.nextTurn();
				break;
			case 'B': // Player can choose the type of card to be played next
				this.playerCanPlay = false;
				this.CONTROLLER.openChangeTypePopup();
				this.playAgain = false;
				break;
			case 'J': // Next player draws {jokerWorth} cards
				this.CONTROLLER.drawCard(this.getNextPlayer(), this.CONFIG.jokerWorth);
				break;
		}
	}

	/**
	 * Changes the current type
	 * @param {String} type - The type to change to
	 */
	changeType(type) {
		this.playerCanPlay = true;
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
		return this.currentPlayerId;
	}

	/**
	 * Returns if the player can play at the moment
	 * @returns {Boolean} - A boolean which specifies if the player can play or not at the moment
	 */
	canPlay() {
		return this.playerCanPlay;
	}

	/**
	 * Switches the direction the turns go to either clockwise or counter-clockwise
	 */
	switchDirection() {
		if( this.direction === 'clockwise' ) {
			this.direction = 'counter-clockwise';
		} else {
			this.direction = 'clockwise';
		}
	}

	/**
	 * Changes the turn to the id of the next player
	 */
	nextTurn() {
		if( this.direction === 'clockwise' ) {
			this.turn++;
			if( this.turn > this.CONFIG.computerCount ) {
				this.turn = 0;
			}
		} else {
			this.turn--;
			if( this.turn < 0 ) {
				this.turn = this.CONFIG.computerCount;
			}
		}
	}

	/**
	 * Returns the id of the next player
	 */
	getNextPlayer() {
		if( this.direction == 'clockwise' ) {
			if( this.turn + 1 > this.CONFIG.computerCount ) {
				return 0;
			}
			return this.turn + 1;
		} else {
			if( this.turn - 1 < 0 ) {
				return this.CONFIG.computerCount;
			}
			return this.turn - 1;
		}
	}

	/**
	 * Returns if the current player has to play again
	 */
	playerMustPlayAgain() {
		if( this.playAgain === true ) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Returns if the current turn is the user's
	 */
	isUserTurn() {
		if( this.turn === 0 ) {
			return true;
		} else {
			return false;
		}
	}
}
