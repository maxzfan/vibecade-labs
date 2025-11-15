export const twenty48GameCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>2048</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        :root {
            --bg-color: #1a1a1a;
            --grid-bg: #333;
            --tile-bg: #444;
            --text-color: #eee;
        }
        body {
            font-family: 'Press Start 2P', cursive;
            background-color: var(--bg-color);
            color: var(--text-color);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            text-align: center;
        }
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .header {
            width: 400px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        h1 {
            font-size: 3rem;
            margin: 0;
        }
        .score-container {
            background-color: var(--grid-bg);
            padding: 10px 20px;
            border-radius: 5px;
        }
        #game-board {
            width: 400px;
            height: 400px;
            background-color: var(--grid-bg);
            border-radius: 6px;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(4, 1fr);
            gap: 10px;
            padding: 10px;
            box-sizing: border-box;
        }
        .tile {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 2rem;
            border-radius: 3px;
            background-color: var(--tile-bg);
            font-weight: bold;
        }
        .tile[data-value="2"] { background-color: #5a5a5a; color: #fff; }
        .tile[data-value="4"] { background-color: #7a7a7a; color: #fff; }
        .tile[data-value="8"] { background-color: #ff9900; color: #fff; }
        .tile[data-value="16"] { background-color: #ff7700; color: #fff; }
        .tile[data-value="32"] { background-color: #ff5500; color: #fff; }
        .tile[data-value="64"] { background-color: #ff3300; color: #fff; }
        .tile[data-value="128"] { background-color: #ffcc00; color: #000; }
        .tile[data-value="256"] { background-color: #ffc400; color: #000; }
        .tile[data-value="512"] { background-color: #ffbb00; color: #000; }
        .tile[data-value="1024"] { background-color: #ffb300; color: #000; }
        .tile[data-value="2048"] { background-color: #ffaa00; color: #000; }
        
        .game-over-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 100;
            color: #ff0000;
            visibility: hidden;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }
        .game-over-overlay.visible {
            visibility: visible;
            opacity: 1;
        }
        #restart-button {
            margin-top: 20px;
            padding: 10px 20px;
            background: #444;
            color: #eee;
            border: 2px solid #eee;
            border-radius: 5px;
            font-family: 'Press Start 2P', cursive;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>2048</h1>
            <div class="score-container">
                <div>SCORE</div>
                <div id="score">0</div>
            </div>
        </div>
        <div id="game-board"></div>
    </div>
    <div id="game-over" class="game-over-overlay">
        <h2>GAME OVER!</h2>
        <button id="restart-button">Restart</button>
    </div>

    <script>
        const gameBoard = document.getElementById('game-board');
        const scoreDisplay = document.getElementById('score');
        const gameOverOverlay = document.getElementById('game-over');
        const restartButton = document.getElementById('restart-button');
        const size = 4;
        let board = [];
        let score = 0;

        function startGame() {
            board = Array(size * size).fill(0);
            score = 0;
            updateScore();
            addNumber();
            addNumber();
            drawBoard();
            gameOverOverlay.classList.remove('visible');
        }

        function drawBoard() {
            gameBoard.innerHTML = '';
            for (let i = 0; i < board.length; i++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                const value = board[i];
                if (value > 0) {
                    tile.textContent = value;
                    tile.dataset.value = value;
                }
                gameBoard.appendChild(tile);
            }
        }

        function addNumber() {
            let emptyTiles = [];
            for (let i = 0; i < board.length; i++) {
                if (board[i] === 0) {
                    emptyTiles.push(i);
                }
            }
            if (emptyTiles.length > 0) {
                const index = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
                board[index] = Math.random() < 0.9 ? 2 : 4;
            }
        }

        function updateScore() {
            scoreDisplay.textContent = score;
        }

        function handleKey(e) {
            let moved = false;
            switch (e.key) {
                case 'ArrowUp': moved = moveUp(); break;
                case 'ArrowDown': moved = moveDown(); break;
                case 'ArrowLeft': moved = moveLeft(); break;
                case 'ArrowRight': moved = moveRight(); break;
                default: return;
            }
            if (moved) {
                addNumber();
                drawBoard();
                if (isGameOver()) {
                    gameOverOverlay.classList.add('visible');
                }
            }
        }
        
        function getRow(index) {
            const row = [];
            for (let i = 0; i < size; i++) {
                row.push(board[index * size + i]);
            }
            return row;
        }

        function getCol(index) {
            const col = [];
            for (let i = 0; i < size; i++) {
                col.push(board[i * size + index]);
            }
            return col;
        }
        
        function setRow(index, newRow) {
            for (let i = 0; i < size; i++) {
                board[index * size + i] = newRow[i];
            }
        }
        
        function setCol(index, newCol) {
            for (let i = 0; i < size; i++) {
                board[i * size + index] = newCol[i];
            }
        }

        function slide(row) {
            let arr = row.filter(val => val);
            let missing = size - arr.length;
            let zeros = Array(missing).fill(0);
            return arr.concat(zeros);
        }

        function combine(row) {
            let moved = false;
            for (let i = 0; i < size - 1; i++) {
                if (row[i] !== 0 && row[i] === row[i + 1]) {
                    row[i] *= 2;
                    score += row[i];
                    row[i + 1] = 0;
                    moved = true;
                }
            }
            updateScore();
            return { combinedRow: row, moved };
        }
        
        function operate(row) {
            let original = [...row];
            row = slide(row);
            const { combinedRow, moved: combineMoved } = combine(row);
            row = combinedRow;
            row = slide(row);
            let changed = original.join(',') !== row.join(',');
            return { resultRow: row, moved: changed || combineMoved };
        }

        function moveLeft() {
            let moved = false;
            for (let i = 0; i < size; i++) {
                let row = getRow(i);
                const { resultRow, moved: rowMoved } = operate(row);
                if (rowMoved) moved = true;
                setRow(i, resultRow);
            }
            return moved;
        }
        
        function moveRight() {
            let moved = false;
            for (let i = 0; i < size; i++) {
                let row = getRow(i).reverse();
                const { resultRow, moved: rowMoved } = operate(row);
                if (rowMoved) moved = true;
                setRow(i, resultRow.reverse());
            }
            return moved;
        }
        
        function moveUp() {
            let moved = false;
            for (let i = 0; i < size; i++) {
                let col = getCol(i);
                const { resultRow, moved: colMoved } = operate(col);
                if (colMoved) moved = true;
                setCol(i, resultRow);
            }
            return moved;
        }
        
        function moveDown() {
            let moved = false;
            for (let i = 0; i < size; i++) {
                let col = getCol(i).reverse();
                const { resultRow, moved: colMoved } = operate(col);
                if (colMoved) moved = true;
                setCol(i, resultRow.reverse());
            }
            return moved;
        }
        
        function isGameOver() {
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (board[i * size + j] === 0) return false; // empty cell
                    if (j < size - 1 && board[i * size + j] === board[i * size + j + 1]) return false; // can merge horizontally
                    if (i < size - 1 && board[i * size + j] === board[(i + 1) * size + j]) return false; // can merge vertically
                }
            }
            return true;
        }

        document.addEventListener('keydown', handleKey);
        restartButton.addEventListener('click', startGame);
        startGame();
    </script>
</body>
</html>`;