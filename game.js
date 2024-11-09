let canvas;
let ctx;
let dino;
let obstacles = [];
let score = 0;
let gameOver = false;

function setup() {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resizeCanvas();
    dino = new Dino();
    requestAnimationFrame(gameLoop);
    window.addEventListener('resize', resizeCanvas);
    
    // Add this line
    canvas.addEventListener('click', function(event) {
        if (gameOver) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            // Check if click is within replay button
            if (x > canvas.width / 2 - 60 && x < canvas.width / 2 + 60 &&
                y > canvas.height / 2 + 40 && y < canvas.height / 2 + 80) {
                resetGame();
            }
        }
    });
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Adjust game elements based on new canvas size
    if (dino) {
        dino.y = canvas.height - 100;
    }
    for (let obstacle of obstacles) {
        obstacle.y = canvas.height - 100;
    }
}

function gameLoop() {
    if (!gameOver) {
        update();
        dino.update();
        draw();
        requestAnimationFrame(gameLoop);
    } else {
        drawGameOver();
    }
}

function update() {
    if (Math.random() < 0.02) {
        obstacles.push(new Obstacle());
    }
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].update();
        if (obstacles[i].x < 0) {
            obstacles.splice(i, 1);
            score++;
        }
        if (obstacles[i].collidesWith(dino)) {
            gameOver = true;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
    
    dino.draw();
    for (let obstacle of obstacles) {
        obstacle.draw();
    }
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2 - 30);
    ctx.fillText('Score: ' + score, canvas.width / 2 - 50, canvas.height / 2 + 10);
    
    // Draw replay button
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(canvas.width / 2 - 60, canvas.height / 2 + 40, 120, 40);
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText('Replay', canvas.width / 2 - 30, canvas.height / 2 + 65);
}

function resetGame() {
    obstacles = [];
    score = 0;
    gameOver = false;
    dino = new Dino();
    requestAnimationFrame(gameLoop);
}

class Dino {
    constructor() {
        this.x = 50;
        this.y = 300;
        this.width = 20;
        this.height = 20;
        this.gravity = 0.6;
        this.velocityY = 0;
        this.jumping = false;
    }

    jump() {
        if (!this.jumping) {
            this.velocityY = -10;
            this.jumping = true;
        }
    }

    update() {
        this.y += this.velocityY;
        this.velocityY += this.gravity;
        if (this.y >= 300) {
            this.y = 300;
            this.jumping = false;
        }
    }

    draw() {
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Obstacle {
    constructor() {
        this.x = canvas.width;
        this.y = 300;
        this.width = 20;
        this.height = 20;
    }

    update() {
        this.x -= 5;
    }

    draw() {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    collidesWith(dino) {
        return !(dino.x > this.x + this.width || 
                 dino.x + dino.width < this.x || 
                 dino.y > this.y + this.height || 
                 dino.y + dino.height < this.y);
    }
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' || event.key.toLowerCase() === 'w') {
        dino.jump();
    }
});

window.onload = setup;
