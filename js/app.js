/*
 * Create a list that holds all of your cards
 */
let cards = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor", "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf", "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];

let matches, moves, openCard, stars, timer;

startGame();

function startGame() {
	// Initialize variables
	openCard = [];
	timer = 0;
	moves = 0;
	stars = 3;
	timer = 0;
	matches = 0;
	// Calling function to add card on the deck and refresh the numbers of moves and stars on the page
	addCard();
	updateMoves();
	// Hide win pop up
	$(".winPopUp").css("display", "none");
}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Add each card's HTML to the page
function addCard() {
	let cardList = shuffle(cards);
	cardList.forEach(function(card) {
		$(".deck").append('<li><i class = "card fa ' + card + '"></i></li>');
	})
}

// Start timer on first click on the card board
$(".deck").on("click", () => {
	if (moves === 0) {
		startTimer();
	}
});

// Timer function
function startTimer() {
	let minutes = 0;
	let seconds = 0;

	timer = setInterval(() => {
		seconds++;
		if (seconds === 59) {
			seconds = 0;
			minutes++;
		}
		seconds < 10 ? seconds = "0" + seconds : seconds;
		$(".minutes").text(minutes + ":");
		$(".seconds").text(seconds);
	}, 1000);
}

// Restart game when top right button is pressed
$(".restart").on("click", () => {
	restartGame();
})

/*
 * Display the cards on the page
 *   - Find matches
 *   - Manage card color in function of matching or not
 *   - Update numbers of moves and stars
 *   - Check if the player wins
 * 	 - Disable cheating by clicking on a third card to see it during the find match process
 */
// Return cards and find matches
$(".card").on("click", function() {
	//On click show card
	if ($(this).hasClass("open show")) { 
		return;
	}
	$(this).toggleClass("flipInY open show");
	openCard.push($(this));
	// Verify matching
	if (openCard.length === 2) {
		moves++;
		// Avoid cheating, disable click on a third card during match check
		$(".deck").css("pointer-events", "none");
		if (openCard[0][0].className === openCard[1][0].className) {
			matches ++;
			openCard[0][0].classList.add("match");
			openCard[1][0].classList.add("match");
			openCard = [];
			findWinner();
			// Enable click on card
			$(".deck").css("pointer-events", "auto");
		} else {
			openCard[0][0].classList.add("wrong");
			openCard[1][0].classList.add("wrong");
			// Let time to the user to see a wrong match
			setTimeout(removeClasses, 1000);
		}
		updateMoves();
	}
})

// Remove classes of card in case of a wrong match
function removeClasses() {
	$(".card").removeClass("show open flipInY bounceIn shake wrong");
	openCard = [];
	// Enable click on card after wrong match display
	$(".deck").css("pointer-events", "aut0o");
}

// Update number of moves and stars
function updateMoves() {
	// Update number of moves in HTML
	$('.moves').text(moves);
	if (moves < 2) {
		$('.movesText').text(' Move');
	} else {
		$('.movesText').text(' Moves');
	}
	// Manage the star number
	if (moves > 0 && moves < 14){
		stars = 3;
	} else if (moves >= 14 && moves < 20) {
		stars = 2;
		$("#thirdStar").removeClass("fa-star");
	} else if (moves >= 20) {
		stars = 1;
		$("#secondStar").removeClass("fa-star");
	}
}

/*
 * Determine if the player win
 *   - stop the timer
 *   - update the star number inside the win pop up
 *   - display the win pop up
 */
function findWinner() {
	if (matches === 8) {
		clearInterval(timer);
		$(".finalStars").text(stars);
		$(".winPopUp").css("display", "block");
	}
}

/*
 * Restart the game when top right button is pressed or the restart button inside the win pop up
 *   - refresh the page
 *   - stop the timer
 *   - prepare the set of card and initialize variables
 */
function restartGame() {
	location.reload();
	clearInterval(timer);
	startGame();
}
