class GameController {

	constructor(config) {
		console.log(this);

		this.CONFIG = config;

		// Create model
		this.MODEL = new GameModel();
		// Create deck
		this.DECK = new Deck(this.CONFIG);
		// Create players
		this.PLAYERS = [];
		// Create user
		this.PLAYERS.push(new User(this.DECK.drawCard(this.CONFIG.startingCardsCount)));
		// Create computers
		for( let i = 0; i < this.CONFIG.computerCount; i++ ) {
			this.PLAYERS.push(new Computer(`Computer ${i + 1}`, this.DECK.drawCard(this.CONFIG.startingCardsCount)));
		}
		// Create view
		this.VIEW = new GameView(this.CONFIG, this.PLAYERS, this.DECK);
		for( let i = 1; i < this.PLAYERS.length; i++ ) {
			this.VIEW.showOpponentHeader(this.PLAYERS[i].getName(), this.PLAYERS[i].getHand().length);
		}
		this.VIEW.showUserHand(this.PLAYERS[0].getHand());
		this.VIEW.showDeck(this.DECK.getDeck().length);
		this.VIEW.showPile('/img/joker/J.png');
	}
}
