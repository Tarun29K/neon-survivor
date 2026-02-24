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
