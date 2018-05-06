class GameController {

	constructor(config) {
		console.log(this);

		this.CONFIG = config;

		// Create model
		this.MODEL = new GameModel();
		// Create deck
		this.DECK = new Deck(this.CONFIG, this);
		for( let i = 0; i < this.CONFIG.deckCount; i++ ) {
			this.DECK.createDeck();
		}
		this.DECK.shuffle();
		this.MODEL.putCard(this.DECK.drawCard()[0]); // Will be removed later
		// Create players
		this.PLAYERS = [];
		// Create user
		this.PLAYERS.push(new User(this.DECK.drawCard(this.CONFIG.startingCardsCount)));
		// Create computers
		for( let i = 0; i < this.CONFIG.computerCount; i++ ) {
			this.PLAYERS.push(new Computer(`Computer ${i + 1}`, this.DECK.drawCard(this.CONFIG.startingCardsCount)));
		}
		// Create view
		this.VIEW = new GameView(this.CONFIG, this);
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
		let card = this.PLAYERS[playerId].getHand()[cardId];
		if( this.MODEL.compareCard(card) ) {
			this.MODEL.putCard(card);
			this.PLAYERS[playerId].removeCard(cardId);
			this.updateView();
		}
	}

	/**
	 * Clears and updates all HTML elements of the view
	 */
	updateView() {
		this.VIEW.clearView();
		for( let i = 1; i < this.PLAYERS.length; i++ ) {
			this.VIEW.showOpponentHeader(this.PLAYERS[i].getName(), this.PLAYERS[i].getHand().length);
		}
		this.VIEW.showDeck(this.DECK.getDeck().length);
		this.VIEW.showPile(this.MODEL.getTopCard().image);
		
		let userHand = this.PLAYERS[0].getHand();
		let checkedHand = [];
		for( let i = 0; i < userHand.length; i++ ) {
			checkedHand.push(this.MODEL.compareCard(userHand[i]));
		}
		this.VIEW.showUserHand(this.PLAYERS[0].getHand(), checkedHand);
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
}
