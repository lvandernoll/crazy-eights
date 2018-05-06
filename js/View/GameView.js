class GameView {

	/**
	 * @param {Object} config - An object containing the {Object} cardtypes, {Boolean} includesJoker
	 * @param {Controller} controller - The game's controller
	 */
	constructor(config, controller) {
		console.log(this);

		this.CONFIG = config;
		this.CONTROLLER = controller;

		// Get elements
		this.OPPONENTVIEW = document.querySelector('#opponentHeader');
		this.USERHANDVIEW = document.querySelector('#userHand');
		this.DECKVIEW = document.querySelector('#gameDeck');
		this.PILEVIEW = document.querySelector('#gamePile');
		this.POPUPVIEW = document.querySelector('#popup');
		this.POPUPHEADERVIEW = document.querySelector('#popupHeader');
		this.CONFIRMPOPUPVIEW = document.querySelector('#confirmPopup');
		this.POPUPSELECTORVIEW = document.querySelector('#popupSelector');
	}

	/**
	 * Constructs the popup with text, fills the selector with text and adds a click event on the button
	 */
	constructPopup() {
		this.POPUPHEADERVIEW.innerText = this.CONFIG.text.selectType;

		this.CONFIRMPOPUPVIEW.addEventListener('click', () => {
			this.togglePopup();
			this.CONTROLLER.changeType(this.POPUPSELECTORVIEW.value)
		});

		let cardTypes = this.CONFIG['cardTypes'];
		for( let i = 0; i < 4; i++ ) {
			let option = document.createElement('option');
			option.innerText = cardTypes[Object.keys(cardTypes)[i]];
			this.POPUPSELECTORVIEW.appendChild(option);
		}
	}

	/**
	 * Toggles the visibility of the popup which lets you choose a type (for when playing the jack)
	 */
	togglePopup() {
		this.POPUPVIEW.classList.toggle('hidden');
	}

	/**
	 * Shows all opponent names, a card image, and their card count
	 * @param {String} name - The opponent's name
	 * @param {number} cardCount - The amount of cards the opponent has in his hand
	 */
	showOpponentHeader(name, cardCount) {
		let opponentField = document.createElement('div');
		opponentField.setAttribute('class', `opponent__block`);
		let nameField = document.createElement('div');
		nameField.innerText = name;
		let imageField = document.createElement('img');
		imageField.setAttribute('src', `${this.CONFIG.imagesPath}/back.png`);
		let cardCountField = document.createElement('div');
		cardCountField.innerText = `x ${cardCount}`;

		opponentField.appendChild(nameField);
		opponentField.appendChild(imageField);
		opponentField.appendChild(cardCountField);
		this.OPPONENTVIEW.appendChild(opponentField);
	}

	/**
	 * Shows all user cards, adds click/hover events and darkens the image if the card cannot be played
	 * @param {Array} userHand - An array containing all the cards in the user's hand
	 * @param {Array} checkedHand - An array containing the booleans for if the card can be played or not
	 */
	showUserHand(userHand, checkedHand) {
		let textField = document.createElement('header');
		textField.innerText = this.CONFIG.text.yourHand;
		let cardField = document.createElement('div');
		cardField.setAttribute('id', 'userHand');
		for( let i = 0; i < userHand.length; i++ ) {
			let cardImage = document.createElement('img');
			cardImage.setAttribute('src', userHand[i].image);
			cardField.appendChild(cardImage);
			if( checkedHand[i] ) {
				// Click event
				cardImage.addEventListener('click', () => {
					this.CONTROLLER.playCard(0, i);
				});
				// Hover event
				cardImage.addEventListener('mouseover', () => {
					cardImage.style.filter = 'brightness(75%)';
				});
				cardImage.addEventListener('mouseout', () => {
					cardImage.style.filter = 'brightness(100%)';
				});
			} else {
				// Darken image if cannot be played
				cardImage.style.filter = 'brightness(50%)';
			}
			
		}
		this.USERHANDVIEW.appendChild(textField);
		this.USERHANDVIEW.appendChild(cardField);
	}

	/**
	 * Shows the deck containing the remaining cards
	 * @param {Array} deckCount - The amount of cards left in the deck
	 */
	showDeck(deckCount) {
		let textField = document.createElement('header');
		textField.innerText = this.CONFIG.text.deck;
		let cardImage = document.createElement('img');
		cardImage.setAttribute('src', `${this.CONFIG.imagesPath}/back.png`);
		let cardCount = document.createElement('div');
		cardCount.innerText = deckCount;

		this.DECKVIEW.appendChild(textField);
		this.DECKVIEW.appendChild(cardImage);
		this.DECKVIEW.appendChild(cardCount);
		// Click listener
		cardImage.addEventListener('click', () => {
			this.CONTROLLER.drawCard(0, 1);
		});
	}

	/**
	 * Shows the last card played
	 * @param {String} lastCardImage - The url to the card's image
	 */
	showPile(lastCardImage) {
		let textField = document.createElement('header'); // Will be removed later
		textField.innerText = 'Pile'; // Will be removed later
		let cardImage = document.createElement('img');
		cardImage.setAttribute('src', lastCardImage);
		cardImage.addEventListener('click', () => { // Will be removed later
			this.CONTROLLER.reshuffle();
		});

		this.PILEVIEW.appendChild(textField);
		this.PILEVIEW.appendChild(cardImage);
	}

	/**
	 * Clears all HTML elements of the view
	 */
	clearView() {
		this.OPPONENTVIEW.innerHTML = '';
		this.USERHANDVIEW.innerHTML = '';
		this.DECKVIEW.innerHTML = '';
		this.PILEVIEW.innerHTML = '';
	}
}
