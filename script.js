const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('reset');
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (board[index] !== '' || !gameActive) {
        return;
    }

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    if (checkWin(currentPlayer)) {
        statusDisplay.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (checkTie()) {
        statusDisplay.textContent = 'It\'s a tie!';
        gameActive = false;
        return;
    }

    currentPlayer = 'O';
    statusDisplay.textContent = 'AI\'s turn';
    setTimeout(aiMove, 500);
}

function evaluate(board) {
    for (let combo of winningCombos) {
        if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
            if (board[combo[0]] === 'O') return 10;
            if (board[combo[0]] === 'X') return -10;
        }
    }
    return 0;
}

function minimax(board, isMaximizing) {
    let score = evaluate(board);
    if (score !== 0) return score;
    if (checkTie()) return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                best = Math.max(best, minimax(board, false));
                board[i] = '';
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                best = Math.min(best, minimax(board, true));
                board[i] = '';
            }
        }
        return best;
    }
}

function aiMove() {
    const availableCells = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    if (availableCells.length === 0) return;

    let bestMove = -1;
    let bestValue = -Infinity;
    for (let i of availableCells) {
        board[i] = 'O';
        let moveValue = minimax(board, false);
        board[i] = '';
        if (moveValue > bestValue) {
            bestValue = moveValue;
            bestMove = i;
        }
    }

    const cellIndex = bestMove;

    board[cellIndex] = 'O';
    cells[cellIndex].textContent = 'O';
    cells[cellIndex].classList.add('o');

    if (checkWin('O')) {
        statusDisplay.textContent = 'AI wins!';
        gameActive = false;
        return;
    }

    if (checkTie()) {
        statusDisplay.textContent = 'It\'s a tie!';
        gameActive = false;
        return;
    }

    currentPlayer = 'X';
    statusDisplay.textContent = 'Player X\'s turn';
}

function checkWin(player) {
    for (let combo of winningCombos) {
        if (board[combo[0]] === player && board[combo[1]] === player && board[combo[2]] === player) {
            combo.forEach(index => cells[index].classList.add('win'));
            return true;
        }
    }
    return false;
}

function checkTie() {
    return board.every(cell => cell !== '');
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusDisplay.textContent = 'Player X\'s turn';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'win');
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);