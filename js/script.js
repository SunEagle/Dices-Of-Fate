const winnerSound = new Audio("/assets/sfx/mrstokes302-you-win-sfx-mrstokes302-442128.mp3");

let gameStarted = false;
let pl1rolled = false;
let pl2rolled = false;
let diceBorder = 1;
let pl1_diceScore = 0;
let pl2_diceScore = 0;
let isRolling = false;
let playerWon;
let initialBlinkTimer;
let blinkInterval;
let inactivity;

const pl1fontColor = "#4ecca3";
const pl2fontColor = "rgb(242, 157, 28)";
let winnerBanner = document.querySelector(".winner-banner");
let winnerPlayerSpan = document.querySelector(".winner-player");
let tieBanner = document.querySelector(".tie-banner");
let dice1 = document.querySelector(".img1");
let dice2 = document.querySelector(".img2");
let nextPlayerContainer = document.querySelector(".next-player");
let nextPlayerDisplayL1 = document.querySelector(".next-player p:nth-child(1)");
let nextPlayerDisplayL2 = document.querySelector(".next-player p:nth-of-type(2)");
let btnRoll1 = document.getElementById("btnRoll1");
let btnRoll2 = document.getElementById("btnRoll2");

const blinkDice = () => {
  if (isRolling) {
    return;
  }
  if (diceBorder === 1) {
    dice2.style.border = "none";
    dice1.style.border = "5px solid gold";
    diceBorder = 2;
  } else if (diceBorder === 2) {
    dice1.style.border = "none";
    dice2.style.border = "5px solid gold";
    diceBorder = 1;
  }
};

const blinkStart = () => {
  blinkInterval = setInterval(blinkDice, 300);
};

const isInactive = () => {
  clearInterval(blinkInterval);
  blinkStart();
};

const resetTimer = () => {
  clearTimeout(inactivity);
  inactivity = setTimeout(isInactive, 10000);
};

const inactivityDetector = () => {
  // If the game hasn't started, do absolutely nothing.
  // Let the pre-game blinking run continuously.
  if (!gameStarted) {
    return;
  }

  // 1. Check if the dice are currently tumbling. If they are, do nothing!
  // 2. Stop the blinking
  if (!isRolling) {
    clearInterval(blinkInterval);

    // 3. Restore the borders if the game has started
    // Hint: Use an if / else if statement checking pl1rolled and pl2rolled
    if (pl1rolled === true && pl2rolled === false) {
      // It's Player 2's turn!
      // Remove border from dice1
      dice1.style.border = "none";
      // Add 5px solid gold border to dice2
      dice2.style.border = "5px solid gold";
    } else if (pl2rolled === true && pl1rolled === false) {
      // It's Player 1's turn!
      // Remove border from dice2
      dice2.style.border = "none";
      // Add 5px solid gold border to dice1
      dice1.style.border = "5px solid gold";
    }

    // 4. Restart the 10 second timer using your helper function
    resetTimer();
  }
};

const disableRoll = (btn) => {
  if (btn.id === "btnRoll1") {
    btnRoll1.classList.remove("btnRoll-pl1");
    btnRoll1.classList.add("btnRoll-disabled", "btnRoll1-disabled-color");
  } else if (btn.id === "btnRoll2") {
    btnRoll2.classList.remove("btnRoll-pl2");
    btnRoll2.classList.add("btnRoll-disabled", "btnRoll2-disabled-color");
  }
};

const enableRoll = (btn) => {
  if (btn.id === "btnRoll1") {
    btnRoll1.classList.remove("btnRoll-disabled", "btnRoll1-disabled-color");
    btnRoll1.classList.add("btnRoll-pl1");
  } else if (btn.id === "btnRoll2") {
    btnRoll2.classList.remove("btnRoll-disabled", "btnRoll2-disabled-color");
    btnRoll2.classList.add("btnRoll-pl2");
    btnRoll2.style.visibility = "visible";
  }
};

const updateNextPlayerDisplay = (l1, l2, color) => {
  nextPlayerDisplayL1.style.fontWeight = "900";
  nextPlayerDisplayL1.style.fontSize = "40pt";
  nextPlayerDisplayL1.textContent = l1;
  nextPlayerDisplayL2.textContent = l2;
  nextPlayerDisplayL1.style.color = color;
  nextPlayerDisplayL2.style.color = color;
};

const callWinner = () => {
  if (pl1_diceScore > pl2_diceScore) {
    playerWon = 1;
    updateNextPlayerDisplay("Winner!", "Player 1", pl1fontColor);
    dice1.style.border = `5px solid ${pl1fontColor}`;
    nextPlayerDisplayL1.classList.add("next-player-winner-btnGamble");
    winnerPlayerSpan.textContent = "1";
    winnerBanner.classList.toggle("show");
  } else if (pl1_diceScore === pl2_diceScore) {
    playerWon = 0;
    updateNextPlayerDisplay("", "Roll the dice again!", "#e9cfb2");
    dice1.style.border = "5px solid #e9cfb2";
    dice2.style.border = "5px solid #e9cfb2";
    nextPlayerDisplayL1.classList.add("next-player-tie-btnGamble-1st-p");
    nextPlayerDisplayL2.classList.add("next-player-tie-btnGamble-2nd-p");
    tieBanner.classList.toggle("show");
  } else {
    playerWon = 2;
    updateNextPlayerDisplay("Winner!", "Player 2", pl2fontColor);
    dice2.style.border = `5px solid ${pl2fontColor}`;
    nextPlayerDisplayL1.classList.add("next-player-winner-btnGamble");
    winnerPlayerSpan.textContent = "2";
    winnerBanner.classList.toggle("show");
  }
};

const gambleAgain = () => {
  let btnGamble = document.createElement("button");
  btnGamble.textContent = "Gamble Again";
  btnGamble.id = "btnGamble";
  btnGamble.classList.add("btn-roll");

  btnGamble.onclick = () => {
    gameStarted = false;
    pl1rolled = false;
    pl2rolled = false;
    pl1_diceScore = 0;
    pl2_diceScore = 0;
    diceBorder = 1;
    dice1.style.border = "none";
    dice2.style.border = "none";
    // Reset inactivityDetector timer
    clearTimeout(inactivity);

    // Hides Winner/Tie Banner
    if (playerWon) {
      winnerBanner.classList.toggle("show");
    } else {
      tieBanner.classList.toggle("show");
    }

    // removes padding top from next-player display <p> when winner is elected
    nextPlayerDisplayL1.classList.remove("next-player-winner-btnGamble");
    nextPlayerDisplayL1.classList.remove("next-player-tie-btnGamble");
    // removes padding top from next-player display <p> when it's a tie
    nextPlayerDisplayL1.classList.remove("next-player-tie-btnGamble-1st-p");
    nextPlayerDisplayL2.classList.remove("next-player-tie-btnGamble-2nd-p");

    updateNextPlayerDisplay("", "", pl1fontColor);
    updateNextPlayerDisplay("Player 1 or 2", "Roll the Dice!", pl1fontColor);
    nextPlayerDisplayL1.style.fontSize = "22pt";
    btnRoll1.style.visibility = "initial";
    btnRoll2.style.visibility = "initial";
    btnRoll1.classList.remove("btnRoll-disabled", "btnRoll1-disabled-color");
    btnRoll2.classList.remove("btnRoll-disabled", "btnRoll2-disabled-color");
    btnRoll1.classList.add("btnRoll-pl1");
    btnRoll2.classList.add("btnRoll-pl2");
    document.querySelector(".img1").src = "./assets/img/dice6.png";
    document.querySelector(".img2").src = "./assets/img/dice6.png";
    blinkStart();
    btnGamble.remove();
  };
  nextPlayerContainer.appendChild(btnGamble);
};

let randDice = () => {
  return Math.floor(Math.random() * 6) + 1;
};

let randDice1 = () => {
  if (pl1rolled) {
    return;
  }

  disableRoll(btnRoll2);
  gameStarted = true;
  clearInterval(blinkInterval);
  dice1.style.border = "none";
  dice2.style.border = "none";
  pl1rolled = true;
  isRolling = true;
  clearTimeout(initialBlinkTimer);
  clearTimeout(inactivity);
  btnRoll1.style.visibility = "hidden";

  nextPlayerDisplayL1.textContent = "";
  nextPlayerDisplayL2.textContent = "";

  const container = document.querySelector(".container");
  const dice_img1 = container.querySelector(".dice img");

  let pl1_phase2 = (delay) => {
    let diceResult = randDice();

    dice_img1.setAttribute("src", `./assets/img/dice${diceResult}.png`);

    if (delay < 500) {
      setTimeout(() => pl1_phase2(delay + 60), delay);
    } else {
      setTimeout(() => {
        diceResult = randDice();
        pl1_diceScore = diceResult;

        dice_img1.setAttribute("src", `./assets/img/dice${diceResult}.png`);

        isRolling = false;
        resetTimer();

        setTimeout(() => {
          if (pl1rolled && pl2rolled) {
            callWinner();
            winnerSound.play();
            gambleAgain();
          } else {
            updateNextPlayerDisplay("Player 2", "It's Your Turn!", pl2fontColor);
            dice2.style.border = "5px solid gold";

            setTimeout(() => {
              enableRoll(btnRoll2);
            }, 1000);
          }
        }, 500);
      }, 800);
    }
  };

  let pl1_phase1_ticks = 0;

  let pl1_phase1 = setInterval(() => {
    let diceResult = randDice();

    dice_img1.setAttribute("src", `./assets/img/dice${diceResult}.png`);

    pl1_phase1_ticks++;

    if (pl1_phase1_ticks === 20) {
      clearInterval(pl1_phase1);
      pl1_phase2(100);
      console.log("Dice 1: ", diceResult);
    }
  }, 100);
};

let randDice2 = () => {
  if (pl2rolled) {
    return;
  }

  disableRoll(btnRoll1);
  gameStarted = true;
  clearInterval(blinkInterval);
  dice1.style.border = "none";
  dice2.style.border = "none";
  pl2rolled = true;
  isRolling = true;
  clearTimeout(initialBlinkTimer);
  clearTimeout(inactivity);
  btnRoll2.style.visibility = "hidden";

  const dice_img2 = document.querySelector(".img2");

  let pl2_phase2 = (delay) => {
    let diceResult = randDice();

    dice_img2.src = `./assets/img/dice${diceResult}.png`;

    if (delay < 500) {
      setTimeout(() => pl2_phase2(delay + 60), delay);
    } else {
      setTimeout(() => {
        diceResult = randDice();
        pl2_diceScore = diceResult;

        if (pl1rolled && pl2rolled) {
          console.log("Player 1 Score: ", pl1_diceScore, "\nPlayer 2 Score: ", pl2_diceScore);
        }

        dice_img2.src = `./assets/img/dice${diceResult}.png`;

        isRolling = false;
        resetTimer();

        setTimeout(() => {
          if (pl1rolled && pl2rolled) {
            callWinner();
            winnerSound.play();
            gambleAgain();
          } else {
            updateNextPlayerDisplay("Player 1", "It's Your Turn!", pl1fontColor);
            dice1.style.border = "5px solid gold";

            setTimeout(() => {
              enableRoll(btnRoll1);
            }, 1000);
          }
        }, 500);
      }, 800);
    }
  };

  let pl2_phase1_ticks = 0;

  let pl2_phase1 = setInterval(() => {
    let diceResult = randDice();

    dice_img2.setAttribute("src", `./assets/img/dice${diceResult}.png`);

    pl2_phase1_ticks++;

    if (pl2_phase1_ticks === 20) {
      clearInterval(pl2_phase1);
      pl2_phase2(100);
      console.log("Dice 2: ", diceResult);
    }
  }, 100);
};

document.addEventListener("mousemove", inactivityDetector);
document.addEventListener("keydown", inactivityDetector);
document.addEventListener("scroll", inactivityDetector);
document.addEventListener("touchstart", inactivityDetector);

initialBlinkStart = setTimeout(() => {
  blinkStart();
}, 3000);
