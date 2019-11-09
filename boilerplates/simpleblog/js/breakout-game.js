/*
 * tutorial: https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/
 * */

var gameCanvas = document.getElementById("gameOnCanvas");
var gameCtx = gameCanvas.getContext("2d");

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

function gameInit() {
  canvasWidth = 640;
  gameCanvas.style.width = canvasWidth + "px";
  gameCanvas.style.height = "320px";

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);

  brickWidth = getBrickWidth();

  bricksInit();
}

function gameEnd(msg) {
  statusMsg = msg;
  brickWidth = getBrickWidth();
  bricksInit();
  x = gameCanvas.width/2;
  y = gameCanvas.height-30;
  paddleX = (gameCanvas.width - paddleWidth)/2;
  score = 0;
  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function getBrickWidth() {
  return (canvasWidth - (brickColumnCount * brickPadding) - brickOffsetLeft) / brickColumnCount;
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
  if((x + dx) > (gameCanvas.width - ballRadius) || ((x + dx) < ballRadius)){
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
  gameCtx.fillText("Score: "+score, 12, 20);
}

function draw() {
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
