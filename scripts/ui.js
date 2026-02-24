//startscreen-glow
let glowTime = 0;

//start-button
let startButton = {
    x: canvas.width/2-100,
    y: canvas.height/2,
    width: 200,
    height: 60,
    hovered: false
};


//start-screen
function drawStartScreen() {

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const glow = 20 + Math.sin(glowTime * 3) * 10;

    ctx.save();

    ctx.fillStyle = "cyan";
    ctx.textAlign = "center";
    ctx.shadowColor = "cyan";
    ctx.shadowBlur = glow;
    ctx.font = "60px Orbitron, sans-serif";
    ctx.fillText("NEON SURVIVOR", canvas.width/2, canvas.height/2 - 60);

    ctx.restore();

    drawStartButton();
    drawInstructions();
}


//drawStartButton
function drawStartButton() {
    ctx.save();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "32px Orbitron";

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 15;

    ctx.shadowColor = "cyan";
    ctx.shadowBlur = startButton.hovered ? 35 : 15;

    ctx.fillStyle = "cyan";

    ctx.fillText("START", centerX, centerY);

    ctx.restore();
}

//instructions
function drawInstructions() {
    ctx.save();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "18px Orbitron sans serif";

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 60;

    ctx.shadowColor = "cyan";
    ctx.fillStyle = "cyan";

    ctx.fillText("Move: Mouse | Shoot: Click", centerX, centerY);

    ctx.restore();
}

//gameOver-screen
function drawGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "bold 48px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2);

    ctx.font = "24px Arial";
    ctx.fillText("Score: " + points, canvas.width/2 - 45, canvas.height/2 + 40);

    if(points > hiScore) hiScore = points;
    ctx.font = "20px Arial";
    ctx.fillText("Hi-Score: " + hiScore, canvas.width / 2 - 50, canvas.height / 2 + 70);

    ctx.font = "20px Arial";
    ctx.fillText("Click anywhere to restart", canvas.width / 2 - 105, canvas.height / 2 + 110);
}


//drawHealth
function drawHealth() {
    const barWidth = 200;
    const barHeight = 20;

    ctx.fillStyle = "red";
    ctx.fillRect(20, 50, barWidth, barHeight);

    ctx.fillStyle = "lime";
    ctx.fillRect(20, 50, barWidth * (player.health / 100), barHeight);

    ctx.strokeStyle = "white";
    ctx.strokeRect(20, 50, barWidth, barHeight);
}




//updateHealth
function updateHealth() {
    const healthBar = document.getElementById("healthBar");
    healthBar.style.width = player.health + "%";
}

//updateScore
function updateScore() {
    const scoreBoard = document.getElementById("scoreBoard");
    scoreBoard.textContent = "Score: " + points;
}