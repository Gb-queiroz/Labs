const express = require('express');
const path = require('path');
const app = express();

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Simulação de banco de dados (dados em memória)
let usuarios = [];

// Rota padrão - Página de Projetos (Home)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Projetos</title>
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            <div class="container">
                <h1>Bem-vindo</h1>
                <p>Escolha uma opção:</p>
                <ul style="list-style: none; margin-top: 30px;">
                    <li style="margin-bottom: 10px;"><a href="/cadastra">Cadastrar</a></li>
                    <li><a href="/login">Login</a></li>
                </ul>
            </div>
        </body>
        </html>
    `);
});

// Rota para exibir página de cadastro
app.get('/cadastra', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Cadastro.html'));
});

// Rota para processar cadastro
app.post('/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;

    // Verifica se o email já existe
    const usuarioExistente = usuarios.find(u => u.email === email);

    if (usuarioExistente) {
        res.render('resposta', {
            status: 'Erro no Cadastro',
            mensagem: 'Este email já está cadastrado!'
        });
    } else {
        // Adiciona o novo usuário
        usuarios.push({ nome, email, senha });
        res.render('resposta', {
            status: 'Cadastro Realizado',
            mensagem: `Bem-vindo, ${nome}! Seu cadastro foi realizado com sucesso.`
        });
    }
});

// Rota para exibir página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Login.html'));
});

// Rota para processar login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    // Procura o usuário
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (usuario) {
        res.render('resposta', {
            status: 'Login Bem-sucedido',
            mensagem: `Bem-vindo, ${usuario.nome}!`
        });
    } else {
        res.render('resposta', {
            status: 'Erro no Login',
            mensagem: 'Email ou senha incorretos!'
        });
    }
});

// Inicia o servidor na porta 80
const PORT = 80;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
