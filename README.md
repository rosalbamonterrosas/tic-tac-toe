# Tic Tac Toe Game
Rosalba Monterrosas

## About the Project

This project is a Tic Tac Toe game of the player (X) versus the computer (O). It is randomly picked who starts, either the player or the computer. The game displays whose move it is. 

At the end of the game, the game displays who won the game or if the game is tied. The tiles that triggered the win are highlighted in a green color.

The score of the player and the computer is displayed below the Tic Tac Toe board. Two points are earned for winning the game, both the player and the computer earn one point for a tied game, and zero points are earned for losing the game. 

### Built With

* [HTML](https://html.com)
* [CSS](https://www.w3.org/Style/CSS/)
* [Bootstrap](https://getbootstrap.com)
* [JavaScript](https://www.javascript.com/)
* [JQuery](https://jquery.com)
* [Font Awesome](https://fontawesome.com/)

## Code Explanation

 The function below returns random index from the gridChoices array, which contains the ids of the remaining buttons on the board.
 ```
const findNextGridIndex = () => {
  console.log("Function findNextGridIndex() has been called.");
  return Math.floor(Math.random() * gridChoices.length);
}
```

The function below returns a random wait time between minTime and maxTime

```
const getRandomWaitTime = (minTime = 500, maxTime = 1000) => {
  console.log("Function getRandomWaitTime() has been called.");
  return Math.floor(maxTime - Math.random() * minTime);
}
```

The function below randomly determines the first move
 ```
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
```


The function below shows the X or O icon on the button and disable clicking on the button 
```
const showIcon = (elementId, turn) => {
  console.log("Function showIcon() has been called.");
  $("#" + elementId).addClass(`fa-solid fa-${turn}`);
  $("#" + elementId).attr("disabled", true);
}
```

The function below highlights the grid tiles that triggered the win
```
const highlightGrid = (ids) => {
  console.log("Function highlightGrid() has been called.");
  ids.forEach(id => $("#" + id).addClass("bg-success"));
}
```

The function below updates the score of the computer or player when the game ends.
```
const updateScore = (entity, gameResult) => {
  console.log("Function updateScore() has been called.");
  score[entity] += scoreCat[gameResult];
  $(`#score-${entity}`).text(score[entity]);  // Update score
}
```

The function below displays text of who won the game or if it was a tied game. Disables clicking on the grid, and shows the "play again" button.
```
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
```

The function below resets the game to allow clicking on grid, and remove icons and winning tiles 
```
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
```

The function below parses the string id of a grid tile into an array of integers.
```
const parseElementId = elementId => {
  console.log("Function parseElementId() has been called.");
  return [parseInt(elementId.charAt(0)), parseInt(elementId.charAt(1))];
}
```

The function below stores a new move into movesState array
```
const storeMoveState = (rowIdx, colIdx, stateVal) => {
  console.log("Function storeMoveState() has been called.");
  movesState[rowIdx][colIdx] = stateVal;
}
```

The function below initializes the game, including allowing for clicking on the grid, initializing gridChoices and movesState 2D arrays, resetting the game, and randomly determining the first move.
```
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
```


The function below counts the number of tiles that have the same state value as the current move. For example, if N is 3, counting three tiles indicates a win. Returns array of the ids of the winning grid tiles
```
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
```

The function below handles when the document finishes loading, initialize the game.
```
$(document).ready(() => {
  console.log("Document is ready.");
  initialize();
});
```

The function below makes a computer move by placing an O icon on a randomly selected button, stores the new move, and check for win. If there is a win, highlight the winning tiles, update the score, and end the game. If there is no win and there are still empty grid tiles remaining, it is now the player's turn. If there are no more empty grid tiles remaining, update the score and end the game with a tied game result.
```
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
```

The function below places an X icon on button clicked, stores the new move, and checks for a win. If there is a win, highlight the winning tiles, update the score, and end the game. If there is no win and there are still empty grid tiles remaining, make a computer move. If there are no more empty grid tiles remaining, update the score and end the game with a tied game result.
```
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
```

The function below calls back when the "play again" button is pressed
```
$('#play-again-button').click(() => {
  console.log("Play again button has been clicked on.");
  initialize()
});
```