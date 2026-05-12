const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

function desenhar_quadrado(ctx, x, y, largura, altura, cor) {
    ctx.fillStyle = cor;
    ctx.fillRect(x, y, largura, altura);
}

function desenhar_linha(ctx, x1, y1, x2, y2, cor, espessura) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = cor;
    ctx.lineWidth = espessura;
    ctx.stroke();
}

function desenhar_arco(ctx, x, y, raio, anguloInicial, anguloFinal, cor, espessura) {
    ctx.beginPath();
    ctx.arc(x, y, raio, anguloInicial, anguloFinal);
    ctx.strokeStyle = cor;
    ctx.lineWidth = espessura;
    ctx.stroke();
}

function escrever(ctx, texto, x, y, tamanho, cor) {
    ctx.fillStyle = cor;
    ctx.font = tamanho + "px Arial";
    ctx.fillText(texto, x, y);
}

function desenhar_circulo(ctx, x, y, raio, cor) {
    ctx.beginPath();
    ctx.arc(x, y, raio, 0, Math.PI * 2);
    ctx.fillStyle = cor;
    ctx.fill();
}

const canvas1 = document.getElementById("canvas1");
const ctx1 = canvas1.getContext("2d");

desenhar_quadrado(ctx1, 0, 0, 300, 300, "#e9e9e9");

desenhar_quadrado(ctx1, 0, 0, 50, 50, "blue");
desenhar_quadrado(ctx1, 250, 0, 50, 50, "red");

desenhar_quadrado(ctx1, 0, 120, 30, 35, "#21dfe0");
desenhar_quadrado(ctx1, 270, 120, 30, 35, "#21dfe0");

desenhar_quadrado(ctx1, 110, 150, 40, 40, "red");

desenhar_quadrado(ctx1, 0, 270, 50, 30, "yellow");
desenhar_quadrado(ctx1, 0, 240, 30, 60, "yellow");

desenhar_quadrado(ctx1, 270, 240, 30, 60, "black");
desenhar_quadrado(ctx1, 240, 270, 60, 30, "black");

desenhar_linha(ctx1, 50, 50, 150, 150, "blue", 1);
desenhar_linha(ctx1, 250, 50, 150, 150, "red", 1);
desenhar_linha(ctx1, 150, 150, 150, 300, "black", 1);
desenhar_linha(ctx1, 0, 150, 300, 150, "black", 1);

desenhar_arco(ctx1, 150, 150, 55, Math.PI, 0, "green", 1);
desenhar_arco(ctx1, 150, 150, 80, Math.PI, 0, "green", 1);

desenhar_arco(ctx1, 150, 300, 80, Math.PI, 2 * Math.PI, "green", 1);

ctx1.beginPath();
ctx1.arc(150, 300, 40, Math.PI, 2 * Math.PI);
ctx1.fillStyle = "#21dfe0";
ctx1.fill();

desenhar_circulo(ctx1, 150, 115, 15, "#27d9ff");
desenhar_circulo(ctx1, 75, 220, 15, "yellow");
desenhar_circulo(ctx1, 225, 220, 15, "yellow");

ctx1.strokeStyle = "green";
ctx1.stroke();

escrever(ctx1, "Canvas", 110, 50, 18, "black");

const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");

desenhar_quadrado(ctx2, 0, 0, 300, 300, "#8be4c3");

desenhar_quadrado(ctx2, 0, 200, 300, 100, "#909090");

ctx2.beginPath();
ctx2.moveTo(0, 120);
ctx2.lineTo(0, 300);
ctx2.lineTo(150, 300);
ctx2.quadraticCurveTo(150, 250, 100, 250);
ctx2.lineTo(50, 250);
ctx2.lineTo(50, 200);
ctx2.lineTo(0, 200);
ctx2.fillStyle = "#4d84e6";
ctx2.fill();

desenhar_circulo(ctx2, 225, 70, 40, "yellow");

desenhar_quadrado(ctx2, 50, 170, 15, 40, "#8b4513");
desenhar_circulo(ctx2, 42, 160, 28, "green");

desenhar_quadrado(ctx2, 250, 210, 15, 50, "#8b4513");
desenhar_circulo(ctx2, 257, 190, 28, "green");

desenhar_quadrado(ctx2, 110, 135, 70, 65, "#9b4f19");

ctx2.beginPath();
ctx2.moveTo(105, 135);
ctx2.lineTo(145, 95);
ctx2.lineTo(185, 135);
ctx2.fillStyle = "#ff6f52";
ctx2.fill();

desenhar_quadrado(ctx2, 135, 155, 20, 45, "#70491f");

desenhar_quadrado(ctx2, 118, 155, 22, 32, "#5ec5ff");
desenhar_quadrado(ctx2, 158, 155, 22, 32, "#5ec5ff");