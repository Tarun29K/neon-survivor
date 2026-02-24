

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
                    explosion.currentTime = 0;
                    explosion.volume = 0.5;
                    explosion.play();
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
            hit.currentTime = 0;
            hit.play();
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
