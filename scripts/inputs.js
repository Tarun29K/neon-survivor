//mouse-pos
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    startButton.hovered =
        mouseX >= startButton.x &&
        mouseX <= startButton.x + startButton.width &&
        mouseY >= startButton.y &&
        mouseY <= startButton.y + startButton.height;
});



//key-press
const keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});


window.addEventListener("click", () => {

    if (gameState === "start" && startButton.hovered) {
        restartGame();
        gameState = "playing";
    }
    else if (gameState === "gameOver") {
        restartGame();
        gameState = "playing";
    }
});

