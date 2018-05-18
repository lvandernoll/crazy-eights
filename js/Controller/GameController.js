class GameController {

	constructor(config) {
		console.log(this);

		this.CONFIG = config;

		// Create model
		this.MODEL = new GameModel(this.CONFIG, this);
		// Create deck
		this.DECK = new Deck(this.CONFIG, this);
		for( let i = 0; i < this.CONFIG.deckCount; i++ ) {
			this.DECK.createDeck();
		}
		this.DECK.shuffle();
		// Put card from deck on pile
		this.MODEL.putCard(this.DECK.drawCard()[0]);
		// Create players
		this.PLAYERS = [];
		// Create user
		this.PLAYERS.push(new User(this.DECK.drawCard(this.CONFIG.startingCardsCount)));
		// Create computers
		for( let i = 0; i < this.CONFIG.computerCount; i++ ) {
			this.PLAYERS.push(new Computer(this, `Computer ${i + 1}`, this.DECK.drawCard(this.CONFIG.startingCardsCount)));
		}
		// Create view
		this.VIEW = new GameView(this.CONFIG, this);
		this.VIEW.constructPopup();
		this.updateView();
	}

	/**
	 * Draws an amount of cards and gives it to a player
	 * @param {number} playerId - The id of the player to give the drawn cards
	 * @param {number} amount - The amount of cards to be drawn
	 */
	drawCard(playerId, amount) {
		this.PLAYERS[playerId].giveCards(this.DECK.drawCard(amount));
		this.updateView();
	}
	
	/**
	 * Puts a card on top of the pile and removes it from the player's hand
	 * @param {number} playerId - The id of the player to remove a card from
	 * @param {number} cardId - The id of the card to be removed from and played
	 */
	playCard(playerId, cardId) {
		if( this.currentPlayerCanPlay() ) {
			let card = this.PLAYERS[playerId].getHand()[cardId];
			this.MODEL.putCard(card);
			this.PLAYERS[playerId].removeCard(cardId);
			if( !this.MODEL.playerMustPlayAgain() ) {
				if( this.PLAYERS[playerId].getHand().length < 1 ) {
					if( this.MODEL.getTopCard().code !== 'A'
					&& this.MODEL.getTopCard().code !== 2
					&& this.MODEL.getTopCard().code !== 7
					&& this.MODEL.getTopCard().code !== 8
					&& this.MODEL.getTopCard().code !== 'B'
					&& this.MODEL.getTopCard().code !== 'H'
					&& this.MODEL.getTopCard().code !== 'J' ) {
						console.log('win');
					} else {
						this.drawCard(playerId, this.CONFIG.specialEndPunishment);
					}
				}
				this.MODEL.nextTurn();
			} else {
				const THAT = this;
				setTimeout( () => {
					THAT.playComputer()
				}, 1000);
			}
			this.updateView();
		}
	}

	/**
	 * Clears and updates all HTML elements of the view
	 */
	updateView() {
		this.VIEW.clearView();
		// Opponents
		for( let i = 1; i < this.PLAYERS.length; i++ ) {
			let isCurrentPlayer;
			if( this.MODEL.currentPlayer() === i ) {
				isCurrentPlayer = true;
			} else {
				isCurrentPlayer = false;
			}
			this.VIEW.showOpponentHeader(this.PLAYERS[i].getName(), this.PLAYERS[i].getHand().length, isCurrentPlayer);
		}
		// Pile
		this.VIEW.showPile(this.MODEL.getTopCard().image);
		// Hand
		let userHand = this.PLAYERS[0].getHand();
		let checkedHand = [];
		let isCurrentPlayer;
		if( this.MODEL.isUserTurn() ) {
			isCurrentPlayer = true;
			checkedHand = this.checkHand(userHand);
		} else {
			isCurrentPlayer = false;
			userHand.forEach( () => {
				checkedHand.push(false);
			})
		}
		this.VIEW.showUserHand(userHand, checkedHand, isCurrentPlayer);
		// Deck
		let userCanPlay;
		if( this.MODEL.canPlay() && this.MODEL.isUserTurn() ) {
			userCanPlay = true;
		} else {
			userCanPlay = false;
		}
		let userHasValidCards = false
		for( let i = 0; i < checkedHand.length; i++ ) {
			if( checkedHand[i] ) {
				userHasValidCards = true;
				break;
			}
		};
		this.VIEW.showDeck(this.DECK.getDeck().length, userCanPlay, userHasValidCards);
	}

	/**
	 * Shuffles the pile into the deck
	 */
	reshuffle() {
		let takenCards = this.MODEL.takeCards();
		if( takenCards.length > 0 ) {
			this.DECK.putCards(takenCards);
			this.DECK.shuffle();
			this.updateView();
		} else {
			console.error('Pile is empty');
		}
	}

	/**
	 * Excecutes the function which makes the computer play a card
	 */
	playComputer() {
		let currentPlayerId = this.MODEL.currentPlayer();
		if( currentPlayerId !== 0 ) {
			this.PLAYERS[currentPlayerId].play();
		}
	}

	/**
	 * Opens a popup where the user can pick a type to choose the current playable type into
	 */
	openChangeTypePopup() {
		this.VIEW.togglePopup();
	}

	/**
	 * Changes the current playable type
	 * @param {String} type - The type to be changed into
	 */
	changeType(type) {
		this.MODEL.changeType(type);
		this.updateView();
	}

	/**
	 * Returns if the player who's turn it is can play
	 * @returns {Boolean} - The boolean which specifies if the current player can play
	 */
	currentPlayerCanPlay() {
		return this.MODEL.canPlay();
	}

	/**
	 * Returns if the current turn is the user's
	 * @returns {Boolean} - The boolean which specifies if the current turn is the user's
	 */
	isUserTurn() {
		return this.MODEL.isUserTurn();
	}

	/**
	 * Checks a hand and returns an array with booleans if the card can be played or not
	 * @param {Array} hand - The hand to check
	 * @returns {Array} - An array with booleans if the card can be played or not
	 */
	checkHand(hand) {
		let checkedHand = [];
		hand.forEach( (card, i) => {
			if( this.currentPlayerCanPlay() ) {
				checkedHand.push(this.MODEL.compareCard(hand[i]));
			} else {
				checkedHand.push(false);
			}
		});
		return checkedHand;
	}

	/**
	 * Returns the current player's id
	 * @returns {number} - The current player's id
	 */
	currentPlayerId() {
		return this.MODEL.currentPlayer();
	}

	/**
	 * Changes the turn to the id of the next player
	 */
	nextTurn() {
		this.MODEL.nextTurn();
		this.updateView();
	}

	/**
	 * Returns the hand of the player with a certain playerId
	 * @param {number} playerId - The id of the player
	 * @returns {Array} - An array containing all cards in that user's hand
	 */
	getHand(playerId) {
		return this.PLAYERS[playerId].getHand();
	}

	/**
	 * Returns the top card of the pile
	 * @returns {Object} - The card
	 */
	getTopCard() {
		return this.MODEL.getTopCard();
	}

	/**
	 * Makes a player draw an amount of cards based on the continuously played draw-cards
	 */
	handleDrawCard() {
		this.MODEL.handleDrawCard(this.MODEL.currentPlayer(), false);
	}

	/**
	 * Returns the continuous draw cards played
	 * @returns {Array} - The array containing the continuous draw cards
	 */
	continuousDrawCards() {
		return this.MODEL.getContinuousDrawCards();
	}
}
