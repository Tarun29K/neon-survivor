//particles
let particles = [];

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
