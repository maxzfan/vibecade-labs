export const snakeGameCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Retro Snake</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        body {
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #000;
            color: #0F0;
            font-family: 'Press Start 2P', cursive;
        }
        #score {
            font-size: 2rem;
            margin-bottom: 20px;
        }
        canvas {
            border: 2px solid #0F0;
            background-color: #080808;
        }
        #instructions {
            margin-top: 20px;
            font-size: 0.8rem;
            color: #0a0;
        }
    </style>
</head>
<body>
    <div id="score">SCORE: 0</div>
    <canvas id="gameCanvas" width="400" height="400"></canvas>
    <div id="instructions">Use Arrow Keys to Move</div>

    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');

        const gridSize = 20;
        const tileCount = canvas.width / gridSize;
        
        let snake = [{ x: 10, y: 10 }];
        let food = { x: 15, y: 15 };
        let velocity = { x: 0, y: 0 };
        let score = 0;
        let gameOver = false;
        let gameStarted = false;

        function gameLoop() {
            if (gameOver) {
                ctx.fillStyle = 'rgba(0,0,0,0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#F00';
                ctx.font = '30px "Press Start 2P"';
                ctx.textAlign = 'center';
                ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
                ctx.fillStyle = '#FFF';
                ctx.font = '14px "Press Start 2P"';
                ctx.fillText('Press Enter to Restart', canvas.width / 2, canvas.height / 2 + 20);
                return;
            }

            if (gameStarted) {
                update();
            }
            draw();
            setTimeout(gameLoop, 1000 / 10); // Game speed: 10 fps
        }

        function update() {
            const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

            // Wall collision
            if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
                gameOver = true;
                return;
            }

            // Self collision
            for (let i = 1; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    gameOver = true;
                    return;
                }
            }

            snake.unshift(head);

            // Food collision
            if (head.x === food.x && head.y === food.y) {
                score++;
                scoreElement.textContent = 'SCORE: ' + score;
                placeFood();
            } else {
                snake.pop();
            }
        }

        function draw() {
            // Background
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Snake
            ctx.fillStyle = '#0F0';
            snake.forEach(part => {
                ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
            });

            // Food
            ctx.fillStyle = '#F00'; // Red food for contrast
            ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
        }

        function placeFood() {
            let validPosition = false;
            while (!validPosition) {
                food = {
                    x: Math.floor(Math.random() * tileCount),
                    y: Math.floor(Math.random() * tileCount)
                };
                validPosition = !snake.some(part => part.x === food.x && part.y === food.y);
            }
        }
        
        function restartGame() {
            snake = [{ x: 10, y: 10 }];
            velocity = { x: 0, y: 0 };
            score = 0;
            scoreElement.textContent = 'SCORE: 0';
            gameOver = false;
            gameStarted = false;
            placeFood();
            gameLoop();
        }

        document.addEventListener('keydown', e => {
            if (e.key === 'Enter' && gameOver) {
                restartGame();
                return;
            }
        
            if (!gameStarted) {
                gameStarted = true;
            }
            
            switch (e.key) {
                case 'ArrowUp':
                    if (velocity.y === 0) velocity = { x: 0, y: -1 };
                    break;
                case 'ArrowDown':
                    if (velocity.y === 0) velocity = { x: 0, y: 1 };
                    break;
                case 'ArrowLeft':
                    if (velocity.x === 0) velocity = { x: -1, y: 0 };
                    break;
                case 'ArrowRight':
                    if (velocity.x === 0) velocity = { x: 1, y: 0 };
                    break;
            }
        });

        placeFood();
        gameLoop();
    </script>
</body>
</html>`;