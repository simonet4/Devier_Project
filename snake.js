// game space parameters
const cellSize = 60
const boxHeight = 9
const boxWidth = 9
var velocity = 1
const canvaHeight = boxHeight*cellSize
const canvaWidth = boxWidth*cellSize
var refreshRate = 200
const snakePadding = 2
var mySnakeHead

// food stuff
var foodAmount = 3
var foodArray = []
const foodPadding = 5
const foodWidth = cellSize-foodPadding*2

// tail bits stuff
var tailLength = 0
var tailPieces = []
const tailWidth = cellSize-snakePadding*2

function startGame() {
    foodAmount = 3
    foodArray = []
    tailLength = 0
    tailPieces = []
    mySnakeArea.reset();
    mySnakeHead = new snakeHead("red", 0, 4);
    spawnFood();
    mySnakeArea.key = "ArrowRight"
    mySnakeArea.start();
}

var mySnakeArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = canvaWidth;
        this.canvas.height = canvaHeight;
        this.context = this.canvas.getContext("2d");
        this.context.fillStyle = 'red';
        this.context.strokeStyle = 'black';
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateSnakeArea, refreshRate);
        window.addEventListener('keydown', function (e) {
            if (e.code.startsWith("Arrow")) {
                e.preventDefault();
            }
            mySnakeArea.key = e.code;
        });
        ctx = mySnakeArea.context;
        let background = document.createElement("img");
        background.src = "background.png";
        ctx.drawImage(background, 0, 0, canvaWidth, canvaHeight);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    reset : function(){
        this.interval = 0;
    }
}

function snakeHead(color, x, y) {
    this.width = cellSize-snakePadding*2;
    this.height = cellSize-snakePadding*2;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    let snakeImg = document.createElement("img");
    snakeImg.src = "snake_head.png";
    ctx = mySnakeArea.context;
    this.update = function(){
        //ctx.fillStyle = color;
        //ctx.fillRect(this.x*cellSize+snakePadding, this.y*cellSize+snakePadding, this.width, this.height);
        let background = document.createElement("img");
        background.src = "background.png";
        ctx.drawImage(background, 0, 0, canvaWidth, canvaHeight);
        let snakeImg = document.createElement("img");
        snakeImg.src = "snake_head.png";
        let xImg = this.x*cellSize+snakePadding;
        let yImg = this.y*cellSize+snakePadding;
        ctx.drawImage(snakeImg, xImg, yImg, this.width, this.height);
    };
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x >= boxWidth) { // too far right
            this.x = 0
        } else if (this.x < 0) { // too far left
            this.x = boxWidth
        } else if (this.y >= boxHeight) { // too far down
            this.y = 0
        } else if (this.y < 0) { // too far up
            this.y = boxHeight
        }
    }
}

function updateSnakeArea() {
    mySnakeArea.clear();
    if (mySnakeArea.key == "KeyD" || mySnakeArea.key == "ArrowRight") {
        faceRight();
    } else if (mySnakeArea.key == "KeyA" || mySnakeArea.key == "ArrowLeft") {
        faceLeft();
    } else if (mySnakeArea.key == "KeyW" || mySnakeArea.key == "ArrowUp") {
        faceUp();
    } else if (mySnakeArea.key == "KeyS" || mySnakeArea.key == "ArrowDown") {
        faceDown();
    }

    addTailPiece(mySnakeHead.x, mySnakeHead.y);
    mySnakeHead.newPos()
    checkCollision()
    checkFood()
    mySnakeHead.update()
    spawnFood()
    drawFood()
    drawGrid()
    drawTail()
}

function faceRight() {
    if (mySnakeHead.speedX == 0) {
        mySnakeHead.speedX = velocity;
        mySnakeHead.speedY = 0;
    }
}

function faceLeft() {
    if (mySnakeHead.speedX == 0) {
        mySnakeHead.speedX = -velocity;
        mySnakeHead.speedY = 0;
    }
}

function faceUp() {
    if (mySnakeHead.speedY == 0) {
        mySnakeHead.speedX = 0;
        mySnakeHead.speedY = -velocity;
    }
}

function faceDown() {
    if (mySnakeHead.speedY == 0) {
        mySnakeHead.speedX = 0;
        mySnakeHead.speedY = velocity;
    }
}

function drawGrid() {
    let color = "white";
    let lineWidth = 2;
    // Set line properties
    mySnakeArea.context.strokeStyle = color;
    mySnakeArea.context.lineWidth = lineWidth;

    // Get size
    let width = canvaWidth;
    let height = canvaHeight;

    // Draw vertical lines
    for (let x = 0; x <= canvaWidth; x += cellSize) {
        mySnakeArea.context.beginPath();
        mySnakeArea.context.moveTo(x, 0);
        mySnakeArea.context.lineTo(x, height);
        mySnakeArea.context.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= canvaHeight; y += cellSize) {
        mySnakeArea.context.beginPath();
        mySnakeArea.context.moveTo(0, y);
        mySnakeArea.context.lineTo(width, y);
        mySnakeArea.context.stroke();
    }
}

function addTailPiece(x, y) {
    if (tailPieces.length == tailLength && tailLength > 0) {
        tailPieces.shift()
        tailPieces.push([x, y])
    } else if (tailPieces.length < tailLength) {
        tailPieces.push([x, y])
    } else {
        tailPieces.shift()
    }
}

function drawTail() {
    let xTail
    let yTail
    ctx = mySnakeArea.context;
    for (let i = 0; i < tailPieces.length; i++) {
        e = tailPieces[i];
        let tailImg = document.createElement("img");
        tailImg.src = "snake_body.png";
        ctx.drawImage(tailImg, e[0]*cellSize+snakePadding, e[1]*cellSize+snakePadding, tailWidth, tailWidth);
    }
}

function drawFood() {
    let xFruit
    let yFruit
    ctx = mySnakeArea.context;
    for (let i = 0; i < foodAmount; i++) {
        e = foodArray[i];
        let foodImg = document.createElement("img");
        foodImg.src = "food.png";
        ctx.drawImage(foodImg, e[0]*cellSize+foodPadding, e[1]*cellSize+foodPadding, foodWidth, foodWidth);
    }
}

function spawnFood() {
    var x
    var y
    while (foodArray.length != foodAmount) {
        if (foodArray.length < foodAmount) {
            x = Math.floor(Math.random() * boxWidth);
            y = Math.floor(Math.random() * boxHeight);
            foodArray.push([x, y]);
            for (let i = 0; i < tailPieces.length; i++) {
                if (tailPieces[i][0] == x && tailPieces[i][1] == y) {
                    foodArray.pop();
                }
            }
            if (mySnakeHead.x == x && mySnakeHead.y == y) {
                foodArray.pop();
            }
        } else if (foodArray.length > foodAmount) {
            foodArray.shift()
        }
    }
}

function checkFood() {
    for (let i = 0; i < foodArray.length; i++) {
        f = foodArray[i]
        if (mySnakeHead.x == f[0] && mySnakeHead.y == f[1]) {
            tailLength ++
            refreshRate -= 2
            foodArray.splice(i, 1)
            spawnFood()
        } 
    }   
}

function checkCollision() {
    for (let i = 0; i < tailPieces.length; i++) {
        e = tailPieces[i]
        if (mySnakeHead.x == e[0] && mySnakeHead.y == e[1]) {
            tailLength = 0
            tailPieces = []
            refreshRate = 200
        }
    }
}