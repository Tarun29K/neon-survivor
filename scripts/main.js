
//gameState
let gameState = "start";

//score
let points = 0;

//Hi-Score
let hiScore = 0;

//damage
let shakeIntensity = 0;


//sounds
const bgm = new Audio("./sounds/arcade-music-loop.wav");
const shoot = new Audio("./sounds/peow-gun-shot.wav");
const hit = new Audio("./sounds/retro-hurt.mp3");
const explosion = new Audio("./sounds/synth-impact.wav");



//render-assets
function render(){
    drawPlayer();
    drawBullets();
    drawEnemies();
    drawParticles();
}

//game-update
function update(deltaTime) {
    if(player.health <= 0) {
        gameState = "gameOver";
        bgm.pause();
    }
    if(player.health >= 60) shakeIntensity *= 0.3;
    else if(player.health <= 30) shakeIntensity *= 0.9;
    else shakeIntensity *= 0.6;
    if (shakeIntensity < 0.1) shakeIntensity = 0;

    updatePlayer(deltaTime);
    updateBullets(deltaTime);
    updateEnemies(deltaTime);
    updateParticles(deltaTime);

    handleCollision();
}

function damageShake() {
    const shakeX = (Math.random() - 0.5) * shakeIntensity;
    const shakeY = (Math.random() - 0.5) * shakeIntensity;
    ctx.translate(shakeX, shakeY);
}  



//restart
function restartGame() {
    bullets.length = 0;
    enemies.length = 0;
    points = 0;
    player.health = 100;
    gameState = "start";
    lastTime = performance.now();
    shakeIntensity = 0;
    bgm.currentTime = 0;
    playBGM();

    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    document.getElementById("scoreBoard").textContent = "Score: 0";
    document.getElementById("healthBar").style.width = "100%";
}

//play-bgm
function playBGM() {
    bgm.loop = true;
    bgm.volume = 0.20;
    bgm.play();
}

//gameplay-loop
let lastTime = 0;

function gameLoop(timestamp) {

    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    if(gameState === "start") {
        glowTime += deltaTime;
        drawStartScreen();
    } else if (gameState === "playing") {
        playBGM();
        update(deltaTime);
        ctx.save();
        damageShake();
        render();
        ctx.restore();
     } else if(gameState === "gameOver") drawGameOver();


    requestAnimationFrame(gameLoop);
}


requestAnimationFrame(gameLoop);
