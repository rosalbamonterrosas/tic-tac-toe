const turnChoices = ["x", "o"];
const N = 3; // grid size
const computerStateVal = 2; // value stored in movesState to indicate computer move
const playerStateVal = 1; // value stored in movesState to indicate player move
const score = {computer: 0, player: 0};
const scoreCat = {
  win: 2,
  tie: 1,
};
// Game state
let gridChoices;
let movesState;

/***********************************
 * Utility function for randomness 
 ***********************************/
/**
 * Returns random index from the gridChoices array, which contains the ids of 
 * the remaining buttons on the board
 */
const findNextGridIndex = () => {
  console.log("Function findNextGridIndex() has been called.");
  return Math.floor(Math.random() * gridChoices.length);
}

/**
 * Returns a random wait time between minTime and maxTime
 * @param {*} minTime: minimum time 
 * @param {*} maxTime: maximum time
 */
const getRandomWaitTime = (minTime = 500, maxTime = 1000) => {
  console.log("Function getRandomWaitTime() has been called.");
  return Math.floor(maxTime - Math.random() * minTime);
}

/**
 * Randomly determines the first move
 */
const firstMove = () => {
  console.log("Function firstMove() has been called.");
  const randomIndex = Math.floor(Math.random()*turnChoices.length);
  const turn = turnChoices[randomIndex]
  if (turn == "x") {
    $("#move").text("It's your turn!");
  } else {
    computerMove()
  }
}


/***********************************
 * DOM modification
 ***********************************/
 /**
 * Show the X or O icon on the button and disable clicking on the button 
 * @param {*} elementId: The id of a button
 */
const showIcon = (elementId, turn) => {
  console.log("Function showIcon() has been called.");
  $("#" + elementId).addClass(`fa-solid fa-${turn}`);
  $("#" + elementId).attr("disabled", true);
}

/**
 * Highlights the grid tiles that triggered the win
 * @param {[]string} ids: the id of a button
 */
const highlightGrid = (ids) => {
  console.log("Function highlightGrid() has been called.");
  ids.forEach(id => $("#" + id).addClass("bg-success"));
}

/**
 * Updates the score of the computer or player when the game ends.
 * @param {string} entity: computer or player 
 * @param {string} gameResult: win or tie
 */
const updateScore = (entity, gameResult) => {
  console.log("Function updateScore() has been called.");
  score[entity] += scoreCat[gameResult];
  $(`#score-${entity}`).text(score[entity]);  // Update score
}

/**
 * Displays text of who won the game or if it was a tied game. Disables clicking 
 * on the grid, and shows the "play again" button.
 * @param {string} winner: winner of the game, including possible values of 
 * tie, computer, or player
 */
const handleGameOver = (winner) => {
  console.log("Function handleGameOver() has been called.");
  if (winner === 'tie') {
    $("#move").text("Game is tied!");
  } else if (winner === 'computer') {
    $("#move").text('The computer won!');
  } else {
    $("#move").text('You won!');
  }
  // Game over, cannot modify grid anymore
  $('#grid').css('pointer-events', 'none');  
  $('#play-again-button').css('display', ''); // Show the play again button
}

/**
 * Reset game to allow clicking on grid, and remove icons and winning tiles 
 * highlighting
 */
const resetGame = () => {
  console.log("Function resetGame() has been called.");
  gridChoices.forEach(elementId => {  
    $("#" + elementId).attr("disabled", false);
    ['fa-solid fa-x', 'fa-solid fa-o', "bg-success"].forEach(className => {
      if ($('#' + elementId).hasClass(className)) {
        $('#' + elementId).removeClass(className);
      }
    })
  });
  $('#play-again-button').css('display', 'none'); // Hide the play again button
}


/***********************************
 * State manipulation
 ***********************************/
/**
 * Parses the string id of a grid tile into an array of integers.
 * @param {number} elementId: the id of a button (grid tile) 
 */
const parseElementId = elementId => {
  console.log("Function parseElementId() has been called.");
  return [parseInt(elementId.charAt(0)), parseInt(elementId.charAt(1))];
}

/**
 * Store new move into movesState array
 * @param {number} rowIdx: Row index
 * @param {number} colIdx: Column index
 * @param {number} stateVal: 1 represents X move (player); 
 * 2 represents O move (computer)
 */
const storeMoveState = (rowIdx, colIdx, stateVal) => {
  console.log("Function storeMoveState() has been called.");
  movesState[rowIdx][colIdx] = stateVal;
}

/**
 * Initializes the game, including allowing for clicking on the grid, 
 * initializing gridChoices and movesState 2D arrays, resetting the game, and 
 * randomly determining the first move.
 */
const initialize = () => {
  console.log("Function initialize() has been called.");
  // Set the stage
  $('#grid').css('pointer-events', '');  // Game start, allow click on the grid
  // Initializes gridChoices to an NxN array filled with their id. 
  // For example, a 3x3 array would look like: 
  // [[00, 01, 02], [10, 11, 12], [20, 21, 22]]
  gridChoices = [...Array(N * N).keys()].map(
    k => String(Math.floor(k / N)) + String(k % N)
  ); 
  // Initializes movesState to an NxN array filled with 0s 
  movesState = [...Array(N)].map(a => Array(N).fill(0));  
  resetGame();
  firstMove();  // Determine the first move
}


/***********************************
 * Check for winner
 ***********************************/
/**
 * Count the number of tiles that have the same state value as the current 
 * move. For example, if N is 3, counting three tiles indicates a win. Returns 
 * array of the ids of the winning grid tiles
 * @param {number} rowIdx: row index
 * @param {number} colIdx: column index
 */
const checkWin = (rowIdx, colIdx) => {
  console.log("Function checkWin() has been called.");
  const stateVal = movesState[rowIdx][colIdx];
  // row
  const rowCount = movesState[rowIdx].reduce(
    (pre, cur) => pre + (cur === stateVal), 0,
  );
  if (rowCount === N) {  
    return [...Array(N).keys()].map(k => String(rowIdx) + String(k));  
  }
  // col
  const colCount = movesState.map(row => row[colIdx]).reduce(
    (pre, cur) => pre + (cur === stateVal), 0,
  );
  if (colCount === N) {
    return [...Array(N).keys()].map(k => String(k) + String(colIdx));
  }
  // diag top left to bottom right
  if (rowIdx === colIdx) {
    const leftDiagCount = [...Array(N).keys()].map(k => movesState[k][k]).reduce(
      (pre, cur) => pre + (cur === stateVal), 0,
      );
    if(leftDiagCount === N) {
      return [...Array(N).keys()].map(k => String(k) + String(k));
    }
  }
  // diag top right to bottom left
  if (rowIdx + colIdx === N - 1) {
    const rightDiagCount = [...Array(N).keys()].map(k => movesState[k][N - k - 1]).reduce(
      (pre, cur) => pre + (cur === stateVal), 0,
      );
    if( rightDiagCount === N) {
      return [...Array(N).keys()].map(k => String(k) + String(N - k - 1));
    }
  }
  return []; // No win yet
}

/**
 * When the document finishes loading, initialize the game.
 */
$(document).ready(() => {
  console.log("Document is ready.");
  initialize();
});

/**
 * Make a computer move by placing an O icon on a randomly selected button, 
 * store the new move, and check for win. If there is a win, highlight the 
 * winning tiles, update the score, and end the game. If there is no win and 
 * there are still empty grid tiles remaining, it is now the player's turn. 
 * If there are no more empty grid tiles remaining, update the score and end 
 * the game with a tied game result.
 */
const computerMove = () => {
  console.log("Function computerMove() has been called.");
  $("#move").text("It's the computer's turn!");
  // Disable clicking while waiting for computer's move
  $('#grid').css('pointer-events', 'none');  
  setTimeout(() => { // Wait for computer's move
    const gridIdx = findNextGridIndex();
    const elementId = gridChoices[gridIdx];  // Choose random grid tile
    const [rowIdx, colIdx] = parseElementId(elementId);
    showIcon(elementId, 'o')  // Place O icon on the tile
    storeMoveState(rowIdx, colIdx, computerStateVal);  // Store new move
    gridChoices.splice(gridIdx, 1);  // Remove index from gridChoices array

    const winElementIds = checkWin(rowIdx, colIdx);
    if (winElementIds.length > 0) {  // Computer wins
      highlightGrid(winElementIds);  // Highlight winning tiles
      updateScore('computer', 'win');
      handleGameOver('computer');
    } else {  // No win yet
      // Enable clicking since computer has made move
      $('#grid').css('pointer-events', '');  
      if (gridChoices.length > 0) {  // There are still empty grid tiles left
        $("#move").text("It's your turn!");
      } else {  // Tied game
        updateScore('computer', 'tie');
        updateScore('player', 'tie');
        handleGameOver('tie');
      }
    }
  }, getRandomWaitTime());  // Use a random wait time for the computer move
}; 

/**
 * Place an X icon on button clicked, store the new move, and check for win. 
 * If there is a win, highlight the winning tiles, update the score, and end 
 * the game. If there is no win and there are still empty grid tiles 
 * remaining, make a computer move. If there are no more empty grid tiles 
 * remaining, update the score and end the game with a tied game result.
 */
$(".clickable").click((event) => {
  console.log("Grid tile has been clicked on.");
  const elementId = event.target.id;  // Get id of button clicked on
  const [rowIdx, colIdx] = parseElementId(elementId);
  showIcon(elementId, 'x');  // Place X icon on the tile
  storeMoveState(rowIdx, colIdx, playerStateVal);  // Store new move
  // Remove index from gridChoices array
  gridChoices.splice(gridChoices.indexOf(elementId), 1); 
  
  const winElementIds = checkWin(rowIdx, colIdx);
  if (winElementIds.length > 0) {  // Player wins
    highlightGrid(winElementIds);  // Highlight winning tiles
    updateScore('player', 'win');
    handleGameOver('player');
  } else {  // No win yet
    if (gridChoices.length > 0) {  // There are still empty grid tiles remaining
      computerMove()
    } else {  // Tied game
      updateScore('computer', 'tie');
      updateScore('player', 'tie');
      handleGameOver('tie');
    }
  }
});

/**
 * Call back when the "play again" button is pressed
 */
$('#play-again-button').click(() => {
  console.log("Play again button has been clicked on.");
  initialize()
});