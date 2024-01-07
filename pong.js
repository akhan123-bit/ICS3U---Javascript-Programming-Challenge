//Ayaan Khan
//December 21, 2023
//This game is pong, a "tennis like" game that features two paddles and a ball, and the goal is to gain the most amount of points by having the ball cross the other player's boundary

//Board
let board;
let boardWidth = 750; //Width of board will be 750 pixels
let boardHeight = 725; //Height of board will also be 725 pixels
let context; 

//Players
let playerWidth = 10; //Width of paddle will be 10 pixels
let playerHeight = 65; //Height of paddle will be 65 pixels
let playerVelocityY = 0; //Makes it so that the paddles are not moving at the start of the game until user input is recieved

let player1 = { //player1 is paddle on the left
    x: 10, //Initial x-coordinate of the player's paddle
    y: boardHeight/2, //Initial y-coordinate of the player's paddle (set to the middle of the board)
    width: playerWidth, //Width of the player's paddle (taken from the previously defined playerWidth variable)
    height: playerHeight, //Height of the player's paddle (taken from the previously defined playerHeight variable)
    velocityY: playerVelocityY //Initial velocity along the Y-axis is set to 0 so that the paddle is initially stationary (taken from the previously defined playerVelocityY variable)
}

let player2 = { //player2 is paddle on the right
    x: boardWidth - playerWidth - 10, //Initial x-coordinate of the player's paddle (set to the whatever the boardwith is - 10 (this makes the canvas more adaptive))
    y: boardHeight/2, //Initial y-coordinate of the player's paddle (set to the middle of the board)
    width: playerWidth, //Width of the player's paddle (taken from the previously defined playerWidth variable)
    height: playerHeight, //Height of the player's paddle (taken from the previously defined playerHeight variable)
    velocityY: playerVelocityY //Initial velocity along the Y-axis is set to 0 so that the paddle is initially stationary (taken from the previously defined playerVelocityY variable)
}

//Ball
let ballWidth = 10; //Width of ball is 10 pixels
let ballHeight = 10; //Height of ball is 10 pixels
let ball = {
    x: boardWidth/2, //Initial X-coordinate of the ball, set to the middle of the board
    y: boardHeight/2, //Initial Y-coordinate of the ball, set to the middle of the board
    width: ballWidth, //Width of the ball, taken from the previously defined ballWidth variable
    height: ballHeight, // Height of the ball, taken from the previously defined ballHeight variable
    velocityX: 2, //Initial velocity along the X-axis                                                                  
    velocityY: 3 //Initial velocity along the Y-axis
}

let player1Score = 0; //Intial score of player1 is 0
let player2Score = 0; //Initial score of player2 is 0

window.onload = function() {
    board = document.getElementById("board"); //Get the HTML canvas element with the id "board"
    board.height = boardHeight; //Set the height of the canvas to the specified boardHeight
    board.width = boardWidth; // Set the width of the canvas to the specified boardWidth
    context = board.getContext("2d"); //Used for drawing on the board

    //Drawing player1's paddle
    context.fillStyle="white"; //Make the paddle white
    context.fillRect(player1.x, player1.y, playerWidth, playerHeight); //Draw a filled rectangle representing Player 1's paddle at the specified position (player1.x, player1.y) with the specified dimensions (playerWidth, playerHeight)

    requestAnimationFrame(update); //Request the next animation frame to continuously update the game
    document.addEventListener("keyup", movePlayer); //Used to respond to player input from keyboard
}

function update() {
    requestAnimationFrame(update); //Request the next animation frame to continue the game loop
    context.clearRect(0, 0, board.width, board.height); //Clear the entire canvas to prepare for the next frame


    //player1
    context.fillStyle = "white"; //Make the paddle white
    let nextPlayer1Y = player1.y + player1.velocityY; //Calculate the next y-coordinate of player1's paddle by adding the current y-coordinate of the paddle to its vertical velocity
    if (!outOfBounds(nextPlayer1Y)) {
        player1.y = nextPlayer1Y; //As long as player1 is within the bounds of the canvas, continue moving the paddle
    }
    
    context.fillRect(player1.x, player1.y, playerWidth, playerHeight); //Draw player1's paddle on the canvas


    //player2
    let nextPlayer2Y = player2.y + player2.velocityY; //Calculate the next y-coordinate of player2's paddle by adding the current y-coordinate of the paddle to its vertical velocity
    if (!outOfBounds(nextPlayer2Y)) {
        player2.y = nextPlayer2Y; //As long as player2 is within the bounds of the canvas, continue moving the paddle
    }
    
    context.fillRect(player2.x, player2.y, playerWidth, playerHeight); //Draw player2's paddle on the canvas


    //Ball
    context.fillStyle = "white"; //Make the ball white
    ball.x += ball.velocityX; //Update the X-coordinate of the ball based on its horizontal velocity
    ball.y += ball.velocityY; //Update the Y-coordinate of the ball based on its vertical velocity
    context.fillRect(ball.x, ball.y, ballWidth, ballHeight); //Draw a filled rectangle representing the ball at its updated position

    if (ball.y <= 0 || (ball.y + ballHeight >= boardHeight)) { 
        ball.velocityY *= -1; //If the ball hits the top or bottom of the canvas, then reverse the direction of the ball vertically
    }

    

    //Bounce ball back from paddles
    if (detectCollision(ball, player1)) {
        if (ball.x <= player1.x + player1.width) { //left side of ball touches right side of player 1 (left paddle)
            ball.velocityX *= -1;   //If left side of ball touches right side of player1, then reverse the direction of the ball horizontally
        }
    }
    else if (detectCollision(ball, player2)) {
        if (ball.x + ballWidth >= player2.x) { 
            ball.velocityX *= -1;   //If right side of ball touches left side of player2 (right paddle), then reverse the direction of the ball horizontally
        }
    }


    //See who is the winner
    if (ball.x < 0) {
        player2Score++; //If the ball crosses the left boundary, it means that player2 has scored a point, so player2Score is incremented
        resetGame(2); //If player2 scores, then set the initial direction of the ball to player2 in the next round
    }
    else if (ball.x + ballWidth > boardWidth) {
        player1Score++; //If the right side of the ball crosses the right boundary, it means that player1 has scored a point, so player1Score is incremetned
        resetGame(-2); //If player1 scores, then set the initial direction of the ball to player1 in the next round
    }


    //Score
    context.font = "45px sans-serif"; //Sets the font style for the score text
    context.fillText(player1Score, boardWidth/5, 45); //Display player1's score on the left side of the canvas
    context.fillText(player2Score, boardWidth*4/5 - 45, 45); //Display player2's score on the right side of the canvas


    //Draw dotted line down the middle of the canvas
    for (let i = 10; i < board.height; i += 25) { //i = starting y Position, draw a square every 25 pixels down
        context.fillRect(board.width / 2 - 10, i, 5, 5); //x position = half of boardWidth (middle) - 10), i = y position, width = 5, height = 5
    }
}

function outOfBounds(yPosition) {
    return (yPosition < 0 || yPosition + playerHeight > boardHeight); //Check if the paddle's vertical position (yPosition) is out of bounds. Returns true if above the top of the canvas or below the bottom of the canvas. Returns false if within the valid vertical bounds of the game canvas
}


// Handle player movement based on keyboard input
function movePlayer(e) {
    //player1
    if (e.code == "KeyW") {
        player1.velocityY = -4; //If the 'W' key is pressed, then the paddle moves upwards
    }
    else if (e.code == "KeyS") {
        player1.velocityY = 4; //If the 'S' key is pressed, then the paddle moves downwards
    }

    //player2
    if (e.code == "ArrowUp") {
        player2.velocityY = -4; //If the up arrowkey key is pressed, then the paddle moves upwards
    }
    else if (e.code == "ArrowDown") { //If the down arrowkey key pressed, then the paddle moves downwards
        player2.velocityY = 4;
    }
}



function playMusic() {
    let backgroundMusic = document.getElementById("backgroundMusic");
    backgroundMusic.play();
}
document.addEventListener("keyup", function(e) {
    movePlayer(e); //Call the existing movePlayer function

    //Check if any of the specified keys are pressed
    if (e.code == "KeyW" || e.code == "KeyS" || e.code == "ArrowUp" || e.code == "ArrowDown") {
        playMusic(); //If any of the keys that are used to control either player is pressed, then start playing the music
    }
});


function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
} //Returns true if the rectangles overlap in both the horizontal and vertical dimensions, indicating a collision


//Reset the game if a point is scored
function resetGame(direction) { //Direction depends on whether player1 or player2 scores
    ball = {
        x: boardWidth/2, //Set the x-coordinate of the ball to the centre of the canvas (horizontally)
        y: boardHeight/2, //Set the y-coordinate of the ball to the center of the canvas (vertically)
        width: ballWidth, //Use the predefined ballWidth for the width of the ball
        height: ballHeight, //Use the predefined ballHeight for the height of the ball
        velocityX: direction, //Set the initial velocity along the X-axis based on the provided direction
        velocityY: 3 //Sets the velocity of the ball along the y-axis
    }
}