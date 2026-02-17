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
let bullets = [];
let shootCooldown = 0;
const shootDelay = 0.3;

canvas.addEventListener("click", (e) => {
    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);

    if(shootCooldown > 0) return;
    shootCooldown = shootDelay;
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

window.addEventListener("click", () => {
    if(gameOver) restartGame();
});

//score
let points = 0;

//Hi-Score
let hiScore = 0;

//damage
let shakeIntensity = 0;

//particles
let particles = [];

//gameOver
let gameOver = false;


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

        if(enemy.hitFlash > 0) ctx.fillStyle = "white";
        else ctx.fillStyle = "red";
        ctx.fill();
    });
}

function spawnEnemy() {
    const radius = 20;
    let x,y;
    const side = Math.floor(Math.random()*4);

    if(side == 0) {
        x = Math.random() * canvas.width;
        y = -radius;
    } else if (side == 1) {
        x = canvas.width + radius;
        y = Math.random() * canvas.height;
    } else if (side == 2) {
        x = Math.random() * canvas.width;
        y = canvas.height + radius;
    } else {
        x = -radius;
        y = Math.random() * canvas.height;
    }

    enemies.push({
        x: x,
        y: y,
        radius: radius,
        health: 2,
        speed: 100,
        hitFlash: 0
    });
}

setInterval(spawnEnemy, 2000);

//drawParticles
function drawParticles() {
    ctx.fillStyle = "orange";

    for (let p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

//spawnParticles
function spawnParticles(x, y) {
    for(var i = 0; i < 6; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 300,
            vy: (Math.random() - 0.5) * 300,
            life: 0.3
        });
    }
    
}


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
    if(shootCooldown > 0) {
        shootCooldown -= deltaTime;
    }

    //bullet-shot
    bullets.forEach(bullet => {
        bullet.x += bullet.vx * deltaTime;
        bullet.y += bullet.vy * deltaTime;
    });

    //cleanup
    bullets = bullets.filter(bullet => {
        return bullet.x > -50 && bullet.x < canvas.width + 50 && 
        bullet.y > -50 && bullet.y < canvas.height + 50;
    });
}

//updateEnemies
let difficulty = 1;

function updateEnemies(deltaTime) {
    difficulty += deltaTime * 0.025;

    enemies.forEach(enemy => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;

        const length = Math.sqrt(dx * dx + dy * dy);
        if (length === 0) return;

        const dirX = dx / length;
        const dirY = dy / length;

        enemy.x += dirX * enemy.speed * difficulty * deltaTime;
        enemy.y += dirY * enemy.speed * difficulty * deltaTime;

        if(enemy.hitFlash > 0) enemy.hitFlash -= deltaTime;
    });
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

//updateParticles
function updateParticles(deltaTime) {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx * deltaTime;
        p.y += p.vy * deltaTime;
        p.life -= deltaTime;
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}


//collisions
function handleCollision(){

    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (isColliding(bullet, enemy)) {
                bullets.splice(bIndex, 1);
                enemy.health--;
                enemy.hitFlash = 0.05;
                //enemy-death
                if(enemy.health <= 0){
                    enemies.splice(eIndex, 1);
                    points += 10;
                    updateScore();
                    spawnParticles(enemy.x, enemy.y);
                    
                }
            }
        });
    });
    //player-collision
    enemies.forEach((enemy, eIndex) => {
        if(isColliding(player, enemy)) {
            player.health -= 10;
            shakeIntensity = 10;
            updateHealth();
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
        gameOver = true;
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

//restart
function restartGame() {
    bullets.length = 0;
    enemies.length = 0;
    points = 0;
    player.health = 100;
    gameOver = false;
    lastTime = performance.now();
    shakeIntensity = 0;

    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    document.getElementById("scoreBoard").textContent = "Score: 0";
    document.getElementById("healthBar").style.width = "100%";
}

//gameplay-loop
let lastTime = 0;

function gameLoop(timestamp) {
    
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    if(!gameOver) {  
        update(deltaTime);
        ctx.save();
        damageShake();
        render();
        ctx.restore();
    } else drawGameOver();


    requestAnimationFrame(gameLoop);
}


requestAnimationFrame(gameLoop);
