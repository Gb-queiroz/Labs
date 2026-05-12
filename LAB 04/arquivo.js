function verificarNumero() {

    let numeroUsuario = document.getElementById("numero").value;

    let numeroAleatorio = Math.floor(Math.random() * 10);

    let resultado = document.getElementById("resultado");

    

    if (numeroUsuario === numeroAleatorio) {

        resultado.innerHTML = "Parabéns! Você acertou! Número: " + numeroAleatorio;

    } else if (numeroUsuario > numeroAleatorio) {

        resultado.innerHTML = "Errou! Seu número é MAIOR que o gerado.";

        document.getElementById("resultado").style.setProperty("background-color", "red");

    } else {

        resultado.innerHTML = "Errou! Seu número é MENOR que o gerado.";

        document.getElementById("resultado").style.setProperty("background-color", "red");

    }

}