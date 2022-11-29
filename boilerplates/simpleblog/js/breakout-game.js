/*
 * tutorial: https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/
 * */

var gameCanvas = document.getElementById("gameOnCanvas");
var gameCtx = gameCanvas.getContext("2d");

var canvasWidth = document.getElementById("gameOnCanvasParent").clientWidth;
gameCanvas.style.width = canvasWidth + "px";
gameCanvas.style.height = "320px";

var x = gameCanvas.width/2;
var y = gameCanvas.height-30;
var dx = 2;
var dy = -2;

var ballRadius = 10;
var ballColor = "#BB7755";

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (gameCanvas.width - paddleWidth)/2;
var paddleColor = "#0095DD";

var brickRowCount = 3;
var brickColumnCount = 7;
var brickWidth = -1;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
var brickColor = "#7733CC";

var score = 0;
var scoreColor = "#0095DD";

var statusMsg = "press left/right arrow keys"
var statusMsgColor = "#0095DD";

var rightPressed = false;
var leftPressed = false;
var pauseTheWorld = false;

function gameInit() {
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);

  gameCanvas.addEventListener('click', () => {
   pauseTheWorld = !pauseTheWorld;
   console.log("game is " + (pauseTheWorld ? "paused" : "running"));
  });

  brickWidth = getBrickWidth();

  bricksInit();
}

function gameEnd(msg) {
  clearInterval(interval);
  sleep(1000).then(() => {gameReset(msg)});
}

function gameReset(msg) {
  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  drawBanner("new game starts in 3 seconds..")

  sleep(1000).then(() => {gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height)});
  drawBanner("new game starts in 2 seconds..")

  sleep(1000).then(() => {gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height)});
  drawBanner("new game starts in 1 seconds..")

  sleep(1000).then(() => {gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height)});
  statusMsg = msg;

  canvasWidth = document.getElementById("gameOnCanvasParent").clientWidth;
  gameCanvas.style.width = canvasWidth + "px";
  brickWidth = getBrickWidth();
  bricksInit();
  x = gameCanvas.width/2;
  y = gameCanvas.height-30;
  paddleX = (gameCanvas.width - paddleWidth)/2;
  score = 0;
  interval = setInterval(draw, 10);
}

function drawBanner(msg) {
  var text = gameCtx.measureText(msg);
  gameCtx.strokeStyle = statusMsgColor;
  gameCtx.strokeText(msg, ((gameCanvas.width/2)-(text.width/2)), (gameCanvas.height/2));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getBrickWidth() {
  let brickPaddingWidth = brickColumnCount * brickPadding;
  let nonBrickWidth = brickPaddingWidth + (2 * brickOffsetLeft);
  return parseInt((canvasWidth - nonBrickWidth) / brickColumnCount);
}

function bricksInit() {
  for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

function drawStatus() {
  gameCtx.font = '12px  verdana, sans-serif';
  var text = gameCtx.measureText(statusMsg);
  gameCtx.fillStyle = statusMsgColor;
  gameCtx.fillText(statusMsg, gameCanvas.width - text.width - 12, 20);
}

function keyDownHandler(e) {
  if(e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if(e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
  else if(e.key == " ") {
    pauseTheWorld = !pauseTheWorld;
  }
}

function keyHandler() {
  if(rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > gameCanvas.width){
      paddleX = gameCanvas.width - paddleWidth;
    }
  }
  else if(leftPressed) {
    paddleX -= 7;
    if (paddleX < 0){
      paddleX = 0;
    }
  }
}

function mouseMoveHandler(e) {
  var gameArea = gameCanvas.getBoundingClientRect();
  if(e.clientY < gameArea.top || e.clientY > gameArea.bottom) {
    return;
  } else if(e.clientX < gameArea.left || e.clientX > gameArea.right) {
    return;
  }
  var relativeX = e.clientX - gameCanvas.offsetLeft;
  if(relativeX > 0 && relativeX < gameCanvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}

function drawBall() {
  gameCtx.beginPath();
  gameCtx.arc(x, y, 10, 0, Math.PI*2);
  gameCtx.fillStyle = ballColor;
  gameCtx.fill();
  gameCtx.closePath();
}

function bounceTheBall() {
  if((x + dx + 2) > (gameCanvas.width - ballRadius) || ((x + dx + 2) < ballRadius)){
    dx = -dx;
  }
  if((y + dy) > (gameCanvas.height - ballRadius)) {
    if(x > paddleX && x < paddleX + paddleWidth) {
      if(rightPressed) { // to make paddle direction push/pull the ball
        x++;
      } else if(leftPressed) {
        x--;
      }
      dy = -dy;
    }
    else {
      _msg = "Game Over, Try Again! breakout";
      if(brickColumnCount > 3) {
        brickColumnCount--;
      } else {
        _msg = "This is the easiest level. Press Right or Left arrow keys. Try something."
      }
      gameEnd(_msg);
    }
  } else if ((y + dy) < ballRadius){
    dy = -dy
  }
}

function drawPaddle() {
  gameCtx.fillStyle = paddleColor;
  gameCtx.strokeStyle = paddleColor;
  roundRect(gameCtx, paddleX, gameCanvas.height-paddleHeight, paddleWidth, paddleHeight, 10);
}

function drawBricks() {
  for(var c=0; c<brickColumnCount; c++) {
    var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;

    for(var r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status != 1) {
        continue;
      }
      var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;

      bricks[c][r].x = brickX;
      bricks[c][r].y = brickY;
      gameCtx.strokeStyle = brickColor;
      gameCtx.fillStyle = brickColor;
      roundRect(gameCtx, brickX, brickY, brickWidth, brickHeight, 15);
    }
  }
}

function roundRect(_ctx, x, y, width, height, radius) {
  // Set faux rounded corners
  _ctx.lineJoin = "round";
  _ctx.lineWidth = radius;

  // Change origin and dimensions to match true size (a stroke makes the shape a bit larger)
  _ctx.strokeRect(x+(radius/2), y+(radius/2), width-radius, height-radius);
  _ctx.fillRect(x+(radius/2), y+(radius/2), width-radius, height-radius);
}

function collisionDetection() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status != 1) {
        continue;
      }
      if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
        dy = -dy;
        b.status = 0;
        score++;
        if(score == brickRowCount*brickColumnCount) {
          brickColumnCount++;
          gameEnd("You Win, Congratulations!");
        }
      }
    }
  }
}

function drawScore() {
  gameCtx.font = "12px Arial";
  gameCtx.fillStyle = scoreColor;
  gameCtx.fillText("Score: "+score+" | Click to Play/Pause", 12, 20);
}

function draw() {
  if (pauseTheWorld == true) {
    return;
  }
  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  drawScore();
  drawStatus();
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  bounceTheBall();

  keyHandler();

  x += dx;
  y += dy;
}

gameInit();
var interval = setInterval(draw, 10);
