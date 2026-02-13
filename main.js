const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

//player
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    speed: 300,
    vx: 0,
    vy: 0,
    health: 100
};

//mouse-pos
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});


//bullets
const bullets = [];
canvas.addEventListener("click", (e) => {
    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);

    bullets.push({
        x: player.x,
        y: player.y,
        vx: Math.cos(angle) * 400,
        vy: Math.sin(angle) * 400,
        radius: 5
    });
});

//enemies
const enemies = [];


//key-press
const keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

//score
let points = 0;

//gameOver
let gameOver = false;


//player-spawn
function drawPlayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.shadowBlur = 20;
    ctx.shadowColor = "cyan";

    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = "cyan";
    ctx.fill();

    ctx.shadowBlur = 0;
}

//bullets-spawn
function drawBullets() {
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    });
}

//enemy-spawn
function drawEnemies(){
    enemies.forEach(enemy => {
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI*2);
        ctx.fillStyle = "red";
        ctx.fill();
    });
}

function spawnEnemy() {
    const radius = 20;

    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    enemies.push({
        x: x,
        y: y,
        radius: radius,
        speed: 100
    });
}

setInterval(spawnEnemy, 2000);


//updatePlayer
function updatePlayer(deltaTime){
    player.vx = 0;
    player.vy = 0;

    if (keys["w"]) player.vy = -1;
    if (keys["s"]) player.vy = 1;
    if (keys["a"]) player.vx = -1;
    if (keys["d"]) player.vx = 1;

    //diagonal
    const length = Math.hypot(player.vx, player.vy);
    if (length > 0) {
        player.vx /= length;
        player.vy /= length;
    }

    //player movement
    player.x += player.vx * player.speed * deltaTime;
    player.y += player.vy * player.speed * deltaTime;
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

}

//updateBullets
function updateBullets(deltaTime){
    //bullet-shot
        bullets.forEach(bullet => {
            bullet.x += bullet.vx * deltaTime;
            bullet.y += bullet.vy * deltaTime;
        });
}

//updateEnemies
function updateEnemies(deltaTime) {
    enemies.forEach(enemy => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;

        const length = Math.sqrt(dx * dx + dy * dy);
        if (length === 0) return;

        const dirX = dx / length;
        const dirY = dy / length;

        enemy.x += dirX * enemy.speed * deltaTime;
        enemy.y += dirY * enemy.speed * deltaTime;
    });
}


//collisions
function handleCollision(){

    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (isColliding(bullet, enemy)) {
                enemies.splice(eIndex, 1);
                bullets.splice(bIndex, 1);
                points += 10;
            }
        });
    });

    enemies.forEach((enemy, eIndex) => {
        if(isColliding(player, enemy)) {
            player.health -= 10;
            enemies.splice(eIndex, 1);
        }
    });
    
}

//collision-check
function isColliding(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < a.radius + b.radius;
}

//score-board
function drawScoreBoard(points) {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + points, 20, 30);

}


//render-assets
function render(){
    drawPlayer();
    drawScoreBoard(points);
    drawBullets();
    drawEnemies();
}

//game-update
function update(deltaTime) {
    if(player.health <= 0) {
        gameOver = true;
    }

    updatePlayer(deltaTime);
    updateBullets(deltaTime);
    updateEnemies(deltaTime);

    handleCollision();
}

//gameOVer-screen
function drawGameOver() {
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2);
}


//gameplay-loop
let lastTime = 0;

function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    if(gameOver) {
        drawGameOver();
        return;
    }

    update(deltaTime);
    render();

    requestAnimationFrame(gameLoop);
}


requestAnimationFrame(gameLoop);
