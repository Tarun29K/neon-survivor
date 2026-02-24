//bullets
let bullets = [];
let shootCooldown = 0;
const shootDelay = 0.3;

canvas.addEventListener("click", (e) => {
    if(gameState === "playing") {
        const angle = Math.atan2(mouseY - player.y, mouseX - player.x);

        if(shootCooldown > 0) return;
        shootCooldown = shootDelay;
        shoot.currentTime = 0;
        shoot.volume = 0.3;
        shoot.play();
        bullets.push({
            x: player.x,
            y: player.y,
            vx: Math.cos(angle) * 400,
            vy: Math.sin(angle) * 400,
            radius: 5
        });
    }
});


//bullets-spawn
function drawBullets() {
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    });
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