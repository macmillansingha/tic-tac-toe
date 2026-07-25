const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const resetScoreBtn = document.getElementById('resetScoreBtn');
const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const scoreDEl = document.getElementById('scoreD');

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

let cells = Array(9).fill(null);
let current = 'X';
let gameOver = false;
let scores = { X: 0, O: 0, D: 0 };

function buildBoard() {
  boardEl.innerHTML = '';
  cells.forEach((val, i) => {
    const btn = document.createElement('button');
    btn.className = 'cell';
    btn.dataset.index = i;
    btn.addEventListener('click', () => handleMove(i));
    boardEl.appendChild(btn);
  });
}

function handleMove(i) {
  if (gameOver || cells[i]) return;
  cells[i] = current;
  render();
  const result = checkWin();
  if (result) {
    gameOver = true;
    highlightWin(result.line);
    statusEl.innerHTML = `Player <span class="${result.winner.toLowerCase()}">${result.winner}</span> wins!`;
    scores[result.winner]++;
    updateScores();
    return;
  }
  if (cells.every(c => c)) {
    gameOver = true;
    statusEl.textContent = "It's a draw";
    scores.D++;
    updateScores();
    return;
  }
  current = current === 'X' ? 'O' : 'X';
  statusEl.innerHTML = `Player <span class="${current.toLowerCase()}">${current}</span>'s turn`;
}

function checkWin() {
  for (const line of WIN_LINES) {
    const [a,b,c] = line;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { winner: cells[a], line };
    }
  }
  return null;
}

function highlightWin(line) {
  line.forEach(i => {
    boardEl.children[i].classList.add('win');
  });
}

function render() {
  cells.forEach((val, i) => {
    const btn = boardEl.children[i];
    btn.textContent = val || '';
    btn.className = 'cell' + (val ? ' ' + val.toLowerCase() : '');
    btn.disabled = !!val || gameOver;
  });
}

function updateScores() {
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDEl.textContent = scores.D;
}

function newRound() {
  cells = Array(9).fill(null);
  current = 'X';
  gameOver = false;
  statusEl.innerHTML = `Player <span class="x">X</span>'s turn`;
  buildBoard();
}

resetBtn.addEventListener('click', newRound);
resetScoreBtn.addEventListener('click', () => {
  scores = { X: 0, O: 0, D: 0 };
  updateScores();
  newRound();
});

buildBoard();