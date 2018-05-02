class Deck {

	constructor() {
		console.log(this);

		this.includesJoker = false;
		this.deck = [];

		this.createDeck();
		this.shuffleDeck();
	}

	// Adds objects to the deck array
	createDeck() {
		let types = [
			'harten',
			'klavers',
			'ruiten',
			'schoppen',
		];

		let typeIndex = 0;
		for( let i = 0; i < 52; i++ ) {
			let type = types[typeIndex];
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
				type	: type,
				card	: card,
				image	: `/img/${type}/${card}.png`,
			});

			if( i % 13 === 12 ) {
				typeIndex++;
			}
		}
		if( this.includesJoker ) {
			for( let i = 0; i < 2; i++ ) {
				this.deck.push({
					type	: 'joker',
					card	: 'J',
					image	: `/img/${type}/${card}.png`,
				});
			}
		}
	}

	// Shuffles the deck array
	shuffleDeck() {
		this.deck.sort(() => Math.random() - 0.5);
	}

	// Removes last n object(s) from deck array
	// Returns array with those object(s)
	drawCard(amount = 1) {
		let cards = [];
		for( let i = 0; i < amount; i++ ) {
			cards.push(this.deck.pop());
		}
		return cards;
	}
}
