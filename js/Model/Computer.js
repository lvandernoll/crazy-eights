class Computer extends Player {

	/**
	 * 
	 * @param {String} name - The computer's username
	 * @param {Array} cards - An array containing the computer's cards
	 */
	constructor(name, cards) {
		super(cards);
		console.log(this);

		this.NAME = name;
	}

	getName() {
		return this.NAME;
	}
}
