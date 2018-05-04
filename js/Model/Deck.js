class Deck {

	/**
	 * @param {Object} config - An object containing the {Object} cardtypes, {Boolean} includesJoker
	 * @param {Controller} controller - The game's controller
	 */
	constructor(config, controller) {
		console.log(this);

		this.CONFIG = config;
		this.CONTROLLER = controller;

		this.cardTypes = this.CONFIG.cardTypes;
		this.includesJoker = this.CONFIG.includesJoker;
		this.deck = [];
	}

	/**
	 * Adds objects to the deck array
	 */
	createDeck() {
		let typeIndex = 0;
		for( let i = 0; i < 52; i++ ) {
			let type = this.cardTypes[Object.keys(this.cardTypes)[typeIndex]];
			let card;

			switch( i % 13 ) {
				case 0:
					card = 'A';
					break;
				case 10:
					card = 'B';
					break;
				case 11:
					card = 'V';
					break;
				case 12:
					card = 'H';
					break;
				default:
					card = (i % 13) + 1;
			}
			
			this.deck.push({
				type: type,
				card: card,
				image: `${this.CONFIG.imagesPath}/${typeIndex}/${card}.png`,
			});

			if( i % 13 === 12 ) {
				typeIndex++;
			}
		}
		if( this.includesJoker ) {
			for( let i = 0; i < 2; i++ ) {
				this.deck.push({
					type: 'joker',
					card: 'J',
					image: `${this.CONFIG.imagesPath}/${type}/${card}.png`,
				});
			}
		}
	}

	/**
	 * Shuffles the deck array
	 */
	shuffle() {
		this.deck.sort( () => Math.random() - 0.5);
	}

	/**
	 * Removes last n object(s) from deck array
	 * @param {number} amount - The amount of cards you want to draw
	 * @returns {Array} - An array with the cards you drew
	 */
	drawCard(amount = 1) {
		let cards = [];
		for( let i = 0; i < amount; i++ ) {
			if( this.deck.length > 0 ) {
				cards.push(this.deck.pop());
			} else {
				this.CONTROLLER.reshuffle();
			}
		}
		return cards;
	}

	/**
	 * Returns an array containing all cards currently in the deck
	 * @returns {Array} - The array containing all cards currently in the deck
	 */
	getDeck() {
		return this.deck;
	}

	/**
	 * Puts cards on the bottom of the deck
	 * @param {Array} cards - An array containing the cards to be added to the bottom of the deck
	 */
	putCards(cards) {
		this.deck = [...cards, ...this.deck];
	}
}
