const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let snake = [
  {x: 160, y: 160},
  {x: 140, y: 160},
  {x: 120, y: 120},

]
// Velocity
let dx = 0;
let dy = 0;
const tileSize = 20; // Size of each snake segment and apple

let apple = {x: 200, y: 200}; // Initial apple position

let score = 0;



// Listen for keyboard presses
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  const key_pressed = event.key;

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
}

function generateApple() {
  apple.x = Math.floor(Math.random() * (canvas.width / tileSize)) * tileSize;
  apple.y = Math.floor(Math.random() * (canvas.height / tileSize)) * tileSize;
}

generateApple(); // Generate the first apple

function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Create a new head based on the current direction
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Screen wrapping logic
    if (head.x >= canvas.width) head.x = 0;
    if (head.x < 0) head.x = canvas.width - tileSize;
    if (head.y >= canvas.height) head.y = 0;
    if (head.y < 0) head.y = canvas.height - tileSize;

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

}

setInterval(gameLoop, 75);