js
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
let posts;

async function iniciar() {
  await client.connect();
  const dbo = client.db('blog_bd');
  posts = dbo.collection('posts');
  console.log('Conectado ao MongoDB!');

  app.listen(80, () => {
    console.log('Servidor rodando na porta 80');
  });
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/projects.html');
});

app.get('/blog', async (req, res) => {
  const todosPosts = await posts.find().toArray();
  res.render('blog', { listaPosts: todosPosts });
});

app.get('/cadastrar_post', (req, res) => {
  res.sendFile(__dirname + '/public/cadastrar_post.html');
});

app.post('/cadastrar_post', async (req, res) => {
  const novoPost = {
    titulo: req.body.titulo,
    resumo: req.body.resumo,
    conteudo: req.body.conteudo
  };
  await posts.insertOne(novoPost);
  res.render('post_cadastrado');
});

iniciar();