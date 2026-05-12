const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
let usuarios, carros;

async function iniciar() {
  await client.connect();
  const dbo = client.db('carros_bd');
  usuarios = dbo.collection('usuarios');
  carros = dbo.collection('carros');
  console.log('Conectado ao MongoDB!');

  app.listen(80, () => {
    console.log('Servidor rodando na porta 80');
  });
}

// ROTAS GERAIS
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/projects.html');
});

app.get('/cadastro', (req, res) => {
  res.sendFile(__dirname + '/public/cadastro.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

// USUÁRIOS
app.post('/cadastrar_usuario', async (req, res) => {
  const novo = {
    nome: req.body.nome,
    login: req.body.login,
    senha: req.body.senha
  };
  await usuarios.insertOne(novo);
  res.render('resposta', { mensagem: 'Usuário cadastrado com sucesso!' });
});

app.post('/logar', async (req, res) => {
  const data = { login: req.body.login, senha: req.body.senha };
  const encontrados = await usuarios.find(data).toArray();
  if (encontrados.length === 0) {
    res.render('resposta', { mensagem: 'Usuário ou senha incorretos!' });
  } else {
    res.redirect('/gerenciar');
  }
});

// CARROS
app.get('/carros', async (req, res) => {
  const listaCarros = await carros.find().toArray();
  res.render('carros', { listaCarros });
});

app.get('/gerenciar', async (req, res) => {
  const listaCarros = await carros.find().toArray();
  res.render('gerenciar', { listaCarros });
});

// CREATE
app.post('/cadastrar_carro', async (req, res) => {
  const novo = {
    marca: req.body.marca,
    modelo: req.body.modelo,
    ano: req.body.ano,
    qtde_disponivel: parseInt(req.body.qtde_disponivel)
  };
  await carros.insertOne(novo);
  res.redirect('/gerenciar');
});

// DELETE
app.post('/remover_carro', async (req, res) => {
  await carros.deleteOne({ _id: new ObjectId(req.body.id) });
  res.redirect('/gerenciar');
});

// UPDATE
app.post('/atualizar_carro', async (req, res) => {
  await carros.updateOne(
    { _id: new ObjectId(req.body.id) },
    {
      $set: {
        marca: req.body.marca,
        modelo: req.body.modelo,
        ano: req.body.ano,
        qtde_disponivel: parseInt(req.body.qtde_disponivel)
      }
    }
  );
  res.redirect('/gerenciar');
});

// VENDER (decrementa quantidade)
app.post('/vender_carro', async (req, res) => {
  const carro = await carros.findOne({ _id: new ObjectId(req.body.id) });
  if (carro.qtde_disponivel > 0) {
    await carros.updateOne(
      { _id: new ObjectId(req.body.id) },
      { $inc: { qtde_disponivel: -1 } }
    );
  }
  res.redirect('/gerenciar');
});

iniciar();