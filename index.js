const board = document.getElementById('board');
const result = document.getElementById('result');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart');

let cells = Array(9).fill(null);
let currentPlayer = 'X';
let isGameOver = false;

// Winning combinations
const winCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// Initialize board
function drawBoard() {
  board.innerHTML = '';
  cells.forEach((cell, i) => {
    const cellDiv = document.createElement('div');
    cellDiv.classList.add('cell');
    cellDiv.dataset.index = i;
    cellDiv.innerText = cell || '';
    cellDiv.addEventListener('click', handleMove);
    board.appendChild(cellDiv);
  });
}

function handleMove(e) {
  const index = e.target.dataset.index;

  if (cells[index] || isGameOver) return;

  cells[index] = currentPlayer;
  drawBoard();
  if (checkWinner(currentPlayer)) {
    endGame(`${currentPlayer} Wins!`);
    highlightWinner(currentPlayer);
    return;
  }

  if (cells.every(c => c)) {
    endGame(`It's a Draw!`);
    return;
  }

  // Switch player
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  if (currentPlayer === 'O') {
    setTimeout(aiMove, 500);
  }
}

function aiMove() {
  if (isGameOver) return;
  let empty = cells.map((v, i) => v === null ? i : null).filter(v => v !== null);
  if (empty.length === 0) return;

  let randIndex = empty[Math.floor(Math.random() * empty.length)];
  cells[randIndex] = 'O';
  drawBoard();

  if (checkWinner('O')) {
    endGame('O Wins!');
    highlightWinner('O');
    return;
  }

  if (cells.every(c => c)) {
    endGame(`It's a Draw!`);
    return;
  }

  currentPlayer = 'X';
}

function checkWinner(player) {
  return winCombos.some(combo =>
    combo.every(i => cells[i] === player)
  );
}

function highlightWinner(player) {
  const winningCombo = winCombos.find(combo =>
    combo.every(i => cells[i] === player)
  );
  if (winningCombo) {
    winningCombo.forEach(i => {
      document.querySelectorAll('.cell')[i].classList.add('win');
    });
  }
}

function endGame(msg) {
  isGameOver = true;
  result.style.display = 'flex';
  message.innerText = msg;
}

restartBtn.addEventListener('click', () => {
  cells = Array(9).fill(null);
  currentPlayer = 'X';
  isGameOver = false;
  result.style.display = 'none';
  drawBoard();
});

drawBoard();
