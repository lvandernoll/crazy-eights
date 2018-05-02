class GameController {

	constructor(config) {
		console.log(this);

		this.CONFIG = config;

		// Create model
		this.MODEL = new GameModel();
		// Create deck
		this.DECK = new Deck(this.CONFIG);
		// Create user
		this.USER = new User(this.DECK.drawCard(5));
		// Create computers
		this.COMPUTERS = [];
		for( let i = 0; i < this.CONFIG.computerCount; i++ ) {
			this.COMPUTERS.push(new Computer(this.DECK.drawCard(5)));
		}
		// Create view
		this.VIEW = new GameView();
	}
}
