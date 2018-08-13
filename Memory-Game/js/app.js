/*
 * Create a list that holds all of your cards
 */
const deck = document.querySelector('.deck');
const ALL_CARDS = 16;
const TIME_DISPLAY = document.querySelector('.timeDisplay');
const MOVES_DISPLAY = document.querySelector('.movesDisplay');

let toggledCards = [];
let matchedCards = 0;
let moves = 0;
let clockOff = true;
let timeCounting = 0;
let oneSecond;


function shuffleDeck() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardsToShuffle);
  for (card of shuffledCards) {
    deck.appendChild(card);
  }
}
shuffleDeck();

// Increment the move counter and display it on the page (put
// this functionality in another function that you call from this one)
function addMove() {
  moves++;
  MOVES_DISPLAY.innerHTML = moves;
}

// shuffler function
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


// Cards

// Display the card's symbol (put this functionality in
// another function that you call from this one).
function toggleCard(clickTarget) {
   clickTarget.classList.toggle('open');
   clickTarget.classList.toggle('show');
}

// Toggle class for clicked cards to match
function toggleMatched(clickTarget) {
  toggledCards[0].classList.toggle('match');
  toggledCards[1].classList.toggle('match');
}

// Toggle classes for clicked cards that don't match
function toggleNoMatch(clickTarget) {
  toggledCards[0].classList.toggle('not-matched');
  toggledCards[1].classList.toggle('not-matched');
}

// Add the card to a *list* of "open" cards (put this functionality
// in another function that you call from this one).
function addToggled(clickTarget) {
  toggledCards.push(clickTarget);
}

function checkMatch() {
  if (//check if classes of opened cards match and if they do add them both to
    // matchedCards. If matchedCards equals the initially set number then
    // we run the endGame function and remove all cards from toggledCards array.
    toggledCards[0].firstElementChild.className ===
    toggledCards[1].firstElementChild.className) {
      toggleMatched();
      matchedCards += 2;
      matchedCards === ALL_CARDS ? endGame() : undefined;
      toggledCards = [];
    } else {
      toggleNoMatch();
      setTimeout(() => {//we set up a one second timer in which to view both
         // cards' symbol after which we flip them back again and remove them
         // from toggledCards array.
        resetToCard();
        toggledCards = [];
      }, 1000);
    }
}

function cardAvailable(clickTarget) {
  return (
    clickTarget.classList.contains('card') &&
    !clickTarget.classList.contains('match') &&
    toggledCards.length < 2 &&
    !toggledCards.includes(clickTarget)
  );
}

// Stars

function hideStar() {
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    if (star.style.display !== 'none') {
      star.style.display = 'none';
      break;
    }
  }
}

// Score

function checkScore() {
  (moves === 14 || moves === 22) ? hideStar() : undefined;
}

// Time
function startClock() {
  oneSecond = setInterval(() => {
  timeCounting++;
  timeInMinAndSec();
  }, 1000);
}

function stopClock() {
  clearInterval(oneSecond);
}

function timeInMinAndSec() {
  // const clock = document.querySelector('.timeDisplay');
  TIME_DISPLAY.innerHTML = timeCounting;
  const minutes = Math.floor(timeCounting / 60);
  const seconds = timeCounting % 60;
  seconds < 10 ?
    (TIME_DISPLAY.innerHTML = `${minutes}:0${seconds}`) :
    (TIME_DISPLAY.innerHTML = `${minutes}:${seconds}`)
}

deck.addEventListener('click', event => {
  const clickTarget = event.target;
  if (cardAvailable(clickTarget)) {
    if (clockOff) {
      startClock();
      clockOff = '';
    }
    toggleCard(clickTarget);
    addToggled(clickTarget);
    /* - if the list already has another card, check to see if the two cards match */
    if (toggledCards.length === 2) {
    checkMatch(clickTarget);
    addMove();
    checkScore();
    }
  }
});

// Modal

function toggleModal() {
  const modal = document.querySelector('.modal');
  modal.classList.toggle('hide');
}

function getStars() {
  stars = document.querySelectorAll('.stars li');
  starCount = 0;
  for (star of stars) {
    if (star.style.display !== 'none') {
      starCount++;
    }
  }
  return starCount;
}

function writeModalStats() {
  const timeStat = document.querySelector('.modal_time');
  const innerTime = TIME_DISPLAY.innerHTML;
  const movesStat = document.querySelector('.modal_moves');
  const starsStat = document.querySelector('.modal_stars');
  const stars = getStars();

  timeStat.innerHTML = `Time = ${innerTime}`;
  movesStat.innerHTML = `Moves = ${moves}`;
  starsStat.innerHTML =`Stars = ${stars}`;
}

// Game reset

document.querySelector('.restart').addEventListener('click', () => {
  resetGame();
});

document.querySelector('.modal_button').addEventListener('click', () => {
  toggleModal();
  resetGame();
});

function resetClockAndTime() {
   stopClock();
   clockOff = true;
   timeCounting = 0;
   timeInMinAndSec();
 }

function resetMoves() {
   moves = 0;
   document.querySelector('.movesDisplay').innerHTML = moves;
}

function resetStars() {
   stars = 0;
   const starList = document.querySelectorAll('.stars li');
   for (star of starList) {
     star.style.display = 'inline';
   }
}

function resetToCard() {
  toggledCards[0].className = 'card';
  toggledCards[1].className = 'card';
}

function resetAllCards() {
  const cardsToReset = document.querySelectorAll('.deck li');
  for (let card of cardsToReset) {
    card.className = 'card';
  }
}

function resetMatched() {
  matchedCards = 0;
}

function resetGame() {
   resetClockAndTime();
   resetMoves();
   resetStars();
   shuffleDeck();
   resetAllCards();
   resetMatched();
}

function endGame() {
  stopClock();
  writeModalStats();
  toggleModal();
  resetMatched();
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
