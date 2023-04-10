// Canvas setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const game = document.getElementById("game-container");
const menu = document.getElementById("menu");

// Ball setup
const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 4;
let ballSpeedY = 4;

// Paddle setup
const paddleWidth = 10;
const paddleHeight = 100;
let player1Y = canvas.height / 2 - paddleHeight / 2;
let player2Y = canvas.height / 2 - paddleHeight / 2;
const paddleSpeed = 10;

// Score setup
let player1Score = 0;
let player2Score = 0;
let winningScore = 5;

// Game setup
let gameState = "menu"; // Can be "menu", "playing", or "gameOver"
let difficulty = "medium"; // Can be "easy", "medium", or "hard"
const difficulties = {
  easy: {
    player2Speed: 4,
  },
  medium: {
    player2Speed: 6,
  },
  hard: {
    player2Speed: 8,
  },
};

const obstacles = [
  { x: 200, y: 150, width: 20, height: 100 },
  { x: 400, y: 200, width: 50, height: 20 },
  { x: 600, y: 100, width: 30, height: 70 },
];

// Event listeners
canvas.addEventListener("mousemove", function (event) {
  if (gameState === "playing") {
    player1Y =
      event.clientY - canvas.getBoundingClientRect().top - paddleHeight / 2;
  }
});

canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  const easyBtn = {
    x: canvas.width / 2 - 75,
    y: canvas.height / 2 - 75,
    width: 150,
    height: 50,
  };
  const mediumBtn = {
    x: canvas.width / 2 - 75,
    y: canvas.height / 2,
    width: 150,
    height: 50,
  };
  const hardBtn = {
    x: canvas.width / 2 - 75,
    y: canvas.height / 2 + 75,
    width: 150,
    height: 50,
  };

  if (
    clickX >= easyBtn.x &&
    clickX <= easyBtn.x + easyBtn.width &&
    clickY >= easyBtn.y &&
    clickY <= easyBtn.y + easyBtn.height
  ) {
    difficulty = "easy";
    gameState = "playing";
  } else if (
    clickX >= mediumBtn.x &&
    clickX <= mediumBtn.x + mediumBtn.width &&
    clickY >= mediumBtn.y &&
    clickY <= mediumBtn.y + mediumBtn.height
  ) {
    difficulty = "medium";
    gameState = "playing";
  } else if (
    clickX >= hardBtn.x &&
    clickX <= hardBtn.x + hardBtn.width &&
    clickY >= hardBtn.y &&
    clickY <= hardBtn.y + hardBtn.height
  ) {
    difficulty = "hard";
    gameState = "playing";
  }
  if (gameState === "gameOver") {
    player1Score = 0;
    player2Score = 0;
    gameState = "menu";
  }
});

// Game loop
function gameLoop() {
  if (gameState === "playing") {
    // Update ball position
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Check for collision with top/bottom walls
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
      ballSpeedY = -ballSpeedY;
    }

    // // Check for collision with ball
    // if (
    //   ballX + ballRadius > obstacle.x &&
    //   ballX - ballRadius < obstacle.x + obstacle.width &&
    //   ballY + ballRadius > obstacle.y &&
    //   ballY - ballRadius < obstacle.y + obstacle.height
    // ) {
    //   ball.dy *= -1;
    // }

    // Check for collision with paddles
    if (ballX - ballRadius < 0) {
      // Player 2 missed the ball
      player2Score++;
      resetBall();
    } else if (ballX + ballRadius > canvas.width) {
      // Player 1 missed the ball
      player1Score++;
      resetBall();
    } else {
      if (
        ballX - ballRadius <= paddleWidth &&
        ballY >= player1Y &&
        ballY <= player1Y + paddleHeight
      ) {
        ballSpeedX = -ballSpeedX;
        const deltaY = ballY - (player1Y + paddleHeight / 2);
        ballSpeedY = deltaY * 0.2;
      }

      if (
        ballX + ballRadius >= canvas.width - paddleWidth &&
        ballY >= player2Y &&
        ballY <= player2Y + paddleHeight
      ) {
        ballSpeedX = -ballSpeedX;
        const deltaY = ballY - (player2Y + paddleHeight / 2);
        ballSpeedY = deltaY * 0.2;
      }
    }

    // Move player 2 paddle
    const player2Center = player2Y + paddleHeight / 2;
    if (player2Center < ballY - 35) {
      player2Y += difficulties[difficulty].player2Speed;
    } else if (player2Center > ballY + 35) {
      player2Y -= difficulties[difficulty].player2Speed;
    }

    // Update scoreboard
    updateScoreboard();

    // Check for game over
    if (player1Score === winningScore || player2Score === winningScore) {
      gameState = "gameOver";
    }
  }

  // Draw everything on canvas
  drawBackground();
  drawNet();
  drawBall();
  drawPaddles();
  // drawObstacles(obstacles);

  requestAnimationFrame(gameLoop);
}

// Reset ball to starting position and random speed
function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = Math.floor(Math.random() * 8 - 4);
}

// Update scoreboard with current score
function updateScoreboard() {
  const player1Scoreboard = document.getElementById("player1-score");
  const player2Scoreboard = document.getElementById("player2-score");

  player1Scoreboard.innerText = player1Score;
  player2Scoreboard.innerText = player2Score;
}

// Draw background
function drawBackground() {
  ctx.fillStyle = "#2c3e50";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw net
function drawNet() {
  ctx.beginPath();
  ctx.setLineDash([10, 15]);
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = "#ecf0f1";
  ctx.stroke();
}

// Draw ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#ecf0f1";
  ctx.fill();
}

// Draw Obsctales
function drawObstacles(obstacles) {
  ctx.fillStyle = "#fff";
  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  }
}

// Draw paddles
function drawPaddles() {
  // Player 1 paddle
  ctx.fillStyle = "#ecf0f1";
  ctx.fillRect(0, player1Y, paddleWidth, paddleHeight);

  // Player 2 paddle
  ctx.fillStyle = ctx.fillRect(
    canvas.width - paddleWidth,
    player2Y,
    paddleWidth,
    paddleHeight
  );
}

// Handle mouse movement for player 1 paddle
function handleMouseMove(event) {
  const mousePosition = calculateMousePosition(event);
  player1Y = mousePosition.y - paddleHeight / 2;
}

// Calculate mouse position relative to canvas
function calculateMousePosition(event) {
  const rect = canvas.getBoundingClientRect();
  const root = document.documentElement;
  const mouseX = event.clientX - rect.left - root.scrollLeft;
  const mouseY = event.clientY - rect.top - root.scrollTop;
  return { x: mouseX, y: mouseY };
}

// Start game when user chooses difficulty
function startGame(difficultyOption) {
  game.style.display = "flex";
  menu.style.display = "none";

  // document.getElementById('game-container').style.display = 'block'
  difficulty = difficultyOption.value;
  console.log(difficulty);
  player2Speed = difficulties[difficulty].player2Speed;
  player1Score = 0;
  player2Score = 0;
  gameState = "playing";
}

// Show game over screen and winner
function showGameOverScreen(winner) {
  ctx.fillStyle = "#2c3e50";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ecf0f1";
  ctx.font = "50px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${winner} wins!`, canvas.width / 2, canvas.height / 2);

  ctx.font = "30px sans-serif";
  ctx.fillText("Click to play again", canvas.width / 2, canvas.height / 2 + 50);

  canvas.addEventListener("click", handleGameOverScreenClick);
}

// Handle click on game over screen to restart game
function handleGameOverScreenClick() {
  canvas.removeEventListener("click", handleGameOverScreenClick);
  startGame(document.querySelector('input[name="difficulty"]:checked'));
}

// Initialize game
function init() {
  // Add event listener for player 1 paddle movement
  canvas.addEventListener("mousemove", handleMouseMove);
  game.style.display = "none";

  // Add event listener for game start button
  const startButton = document.getElementById("start-button");
  startButton.addEventListener("click", function () {
    startGame(document.querySelector('input[name="difficulty"]:checked'));

    startButton.blur(); // Remove focus from button after clicking
  });

  // Set canvas dimensions and position paddles at center
  canvas.width = 800;
  canvas.height = 500;
  player1Y = (canvas.height - paddleHeight) / 2;
  player2Y = (canvas.height - paddleHeight) / 2;

  // Start game loop
  gameLoop();
}

// Start game initialization
init();
