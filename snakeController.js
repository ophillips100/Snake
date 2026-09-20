const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let snake = [
  {x: 200, y: 200},
]
// Velocity
let dx = 0;
let dy = 0;
let newMovePossible = true; // Prevent multiple direction changes in one frame
const tileSize = 20; // Size of each snake segment and apple

let apple = {x: 200, y: 200}; // Initial apple position

let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
document.getElementById('highScore').textContent = highScore;
let gameInterval = setInterval(gameLoop, 75);

// Listen for keyboard presses
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  const key_pressed = event.key;
  if (!newMovePossible) return; // Ignore if a move has already been made in this frame

  // Prevent snake from reversing into itself
  const goingUp = dy === -tileSize;
  const goingDown = dy === tileSize;
  const goingRight = dx === tileSize;
  const goingLeft = dx === -tileSize;

  

  if (key_pressed === "ArrowUp" && !goingDown) {
    dx = 0;
    dy = -tileSize;
  }
  if (key_pressed === "ArrowDown" && !goingUp) {
    dx = 0;
    dy = tileSize;
  }
  if (key_pressed === "ArrowLeft" && !goingRight) {
    dx = -tileSize;
    dy = 0;
  }
  if (key_pressed === "ArrowRight" && !goingLeft) {
    dx = tileSize;
    dy = 0;
  }
  newMovePossible = false; // Mark that a move has been made in this frame
}

function generateApple() {
  apple.x = Math.floor(Math.random() * (canvas.width / tileSize)) * tileSize;
  apple.y = Math.floor(Math.random() * (canvas.height / tileSize)) * tileSize;
  if (snake.some(segment => segment.x === apple.x && segment.y === apple.y)) {
    generateApple(); // Regenerate if apple is on the snake
  }
}

generateApple(); // Generate the first apple

function endGame() {
  clearInterval(gameInterval);
  alert("Game Over!\nYour score: " + score + "\nHigh Score: " + highScore);
  document.location.reload();
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('snakeHighScore', highScore); // Save permanently
  }
}

function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Create a new head based on the current direction
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        endGame();
        return;
      }
    }
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
      endGame();
      return;
    }

    // Add head to front of array
    snake.unshift(head);

    // Remove tail unless apple is eaten, regenerate apple and increase score
    if (head.x === apple.x && head.y === apple.y) {
      score += 1;
      document.getElementById('score').textContent = score;
      generateApple();
    } else {
      snake.pop();
    }
    
    // Draw the apple
    ctx.fillStyle = "red";
        ctx.fillRect(apple.x, apple.y, tileSize, tileSize);
        ctx.strokeStyle = "darkred";
        ctx.lineWidth = 2;
        ctx.strokeRect(apple.x, apple.y, tileSize, tileSize);

    // Draw the snake
    snake.forEach(part => {
        ctx.fillStyle = "lime";
        ctx.fillRect(part.x, part.y, tileSize, tileSize);
        ctx.strokeStyle = "darkgreen";
        ctx.lineWidth = 2;
        ctx.strokeRect(part.x, part.y, tileSize, tileSize);
    });

    newMovePossible = true; // Allow new direction change in the next frame

}