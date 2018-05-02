class GameController {

	constructor() {
		console.log(this);

		this.MODEL = new GameModel();
		this.DECK = new Deck(this.MODEL.cardTypes);
		this.PLAYER = new Player();
		this.COMPUTERS = [];
		this.COMPUTERS.push(new Computer());
		this.VIEW = new GameView();
	}
}
