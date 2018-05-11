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
		this.playAgain = false;
		this.continuousDrawCards = [];
	}

	/**
	 * Removes all cards but the top one (and any continuous draw-cards at the top) from the pile and returns these cards
	 * @returns {Array} - An array containing all taken cards
	 */
	takeCards() {
		let takenCards = this.pile;
		if( this.continuousDrawCards.length > 0 ) {
			this.pile = takenCards.splice(-this.continuousDrawCards.length, this.continuousDrawCards.length);
		} else {
			this.pile.push(takenCards.pop());
		}
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
		if( this.continuousDrawCards.length > 0 && card.code !== 2
		&& this.continuousDrawCards.length > 0 && card.code !== 'J' ) {
			this.handleDrawCard(this.currentPlayerId, true);
		}
		this.playAgain = false;
		switch( card.code ) {
			case 'A': // Change direction
				this.switchDirection();
				break;
			case 2: // Next player draws 2 cards (if that player does not have any draw-cards)
				this.handleOpponentDraw();
				break;
			case 7: // Player has to play another turn
			case 'H':
				this.playAgain = true;
				break;
			case 8: // Next player has to skip a turn
				this.nextTurn();
				break;
			case 'B': // Player can choose the type of card to be played next
				if( this.isUserTurn() ) {
					this.playerCanPlay = false;
					this.playAgain = true;
					this.CONTROLLER.openChangeTypePopup();
				} else {
					this.currentType = this.CONFIG.cardTypes[Object.keys(this.CONFIG.cardTypes)[Math.floor(Math.random() * 4)]];
				}
				break;
			case 'J': // Next player draws {jokerWorth} cards (if that player does not have any draw-cards)
				this.handleOpponentDraw();
				break;
		}
	}

	/**
	 * Changes the current type
	 * @param {String} type - The type to change to
	 */
	changeType(type) {
		this.playerCanPlay = true;
		this.playAgain = false;
		this.currentType = type;
		this.nextTurn();
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
			this.currentPlayerId++;
			if( this.currentPlayerId > this.CONFIG.computerCount ) {
				this.currentPlayerId = 0;
			}
		} else {
			this.currentPlayerId--;
			if( this.currentPlayerId < 0 ) {
				this.currentPlayerId = this.CONFIG.computerCount;
			}
		}
		const THAT = this;
		setTimeout( () => {
			THAT.CONTROLLER.playComputer();
		}, 1000);
		
	}

	/**
	 * Returns the id of the next player
	 */
	getNextPlayer() {
		if( this.direction == 'clockwise' ) {
			if( this.currentPlayerId + 1 > this.CONFIG.computerCount ) {
				return 0;
			}
			return this.currentPlayerId + 1;
		} else {
			if( this.currentPlayerId - 1 < 0 ) {
				return this.CONFIG.computerCount;
			}
			return this.currentPlayerId - 1;
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
		if( this.currentPlayerId === 0 ) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Handles the '2' and 'Joker' card rules
	 */
	handleOpponentDraw() {
		this.continuousDrawCards.push(this.getTopCard());
		const NEXTPLAYERID = this.getNextPlayer();
		const HAND = this.CONTROLLER.getHand(NEXTPLAYERID);

		let hasDrawCard = false;
		for( let i = 0; i < HAND.length; i++ ) {
			if( HAND[i].code === 2 || HAND[i].code === 'J' ) {
				hasDrawCard = true;
				break;
			}
		}

		if( !hasDrawCard ) {
			this.handleDrawCard(NEXTPLAYERID, true);
		}
	}

	/**
	 * Makes a player draw an amount of cards based on the continuously played draw-cards
	 * @param {number} playerId - The id of the player
	 * @param {Boolean} playedACard - A boolean which specifies if the player has played a card this turn
	 */
	handleDrawCard(playerId, playedACard) {
		if( playedACard
		|| !playedACard && this.getTopCard().code === 2
		|| !playedACard && this.getTopCard().code === 'J' ) {
			let amountToDraw = 0;
			this.continuousDrawCards.forEach( (card) => {
				if( card.code === 2 ) {
					amountToDraw += 2;
				} else {
					amountToDraw += this.CONFIG.jokerWorth;
				}
			});
			this.CONTROLLER.drawCard(playerId, amountToDraw);
			this.continuousDrawCards = [];
		}
	}

	/**
	 * Returns the continuous draw cards played
	 * @returns {Array} - The array containing the continuous draw cards
	 */
	getContinuousDrawCards() {
		return this.continuousDrawCards;
	}
}
