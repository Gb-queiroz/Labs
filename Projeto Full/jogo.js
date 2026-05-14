const canvas = document.getElementById("jogoCanvas");
const ctx = canvas.getContext("2d");

let jogador, objeto, pontuação, CorraParaNaoSerPego;
let carImages = {};
let playerImage;


function Começar() {
    jogador = {
        x: 180,
        y: 450,
        size: 20,
        speed: 35
    };

    objeto = [];
    pontuação = 0;
    CorraParaNaoSerPego = true;

    spawnobjeto();

    update();
}


function spawnobjeto() {
    setInterval(() => {
        if (CorraParaNaoSerPego) {
            objeto.push({
                x: Math.random() > 0.5 ? 0 : canvas.width,
                y: Math.random() * 400,
                width: 40,
                height: 25,
                speed: 4 + Math.random() * 6,
                direction: Math.random() > 0.5 ? 1 : -1
            });
        }
    }, 450);
}

document.addEventListener("keydown", (e) => {
    if (!CorraParaNaoSerPego) return;

    if (e.key === "ArrowUp") jogador.y -= 20;
    if (e.key === "ArrowDown") jogador.y += 20;
    if (e.key === "ArrowLeft") jogador.x -= 20;
    if (e.key === "ArrowRight") jogador.x += 20;
});

function update() {
    if (!CorraParaNaoSerPego) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lime";
    ctx.fillRect(jogador.x, jogador.y, jogador.size, jogador.size);

    ctx.fillStyle = "red";
    objeto.forEach((car, index) => {
        car.x += car.speed * car.direction;
        ctx.fillRect(car.x, car.y, car.width, car.height);

        if (
            jogador.x < car.x + car.width &&
            jogador.x + jogador.size > car.x &&
            jogador.y < car.y + car.height &&
            jogador.y + jogador.size > car.y
        ) {
            gameOver();
        }
    });

    pontuação = Math.max(pontuação, 500 - jogador.y);
    document.getElementById("pontuação").innerText = pontuação;

    requestAnimationFrame(update);
}

function gameOver() {
    CorraParaNaoSerPego = false;
    alert("Você perdeu, sua Pontuação foi: " + pontuação);
}