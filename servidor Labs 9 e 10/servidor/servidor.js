require("colors");

var http = require("http");
var express = require("express");
var bodyParser = require("body-parser")
var mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;
const uri = 'mongodb+srv://gb_queirozs:QRteG1ggaf0TTY0H@cluster0.ccxn7zr.mongodb.net/?appName=Cluster0';
const client = new MongoClient(uri, { useNewUrlParser: true });

var app = express();
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.set('views', './views');

var server = http.createServer(app);
server.listen(80);

console.log("Servidor rodando ...".rainbow);

////////////////////////////////////////////// 
// CONEXÃO COM BANCO DE DADOS
////////////////////////////////////////////// 

var dbo = client.db("exemplo_bd");
var usuarios = dbo.collection("usuarios");
var posts = dbo.collection("posts");
var carros = dbo.collection("carros");

////////////////////////////////////////////// 
// ROTAS PRINCIPAIS
////////////////////////////////////////////// 

app.get('/', function (requisicao, resposta) {
  resposta.redirect('projetos.html');
})

app.get('/blog', function (requisicao, resposta) {
  posts.find({}).toArray(function (err, items) {
    if (err) {
      resposta.render('blog.ejs', { posts: [] });
    } else {
      resposta.render('blog.ejs', { posts: items });
    }
  });
})

app.get('/contato', function (requisicao, resposta) {
  resposta.render('contato.html');
})

////////////////////////////////////////////// 
// PROJETO 1: BLOG
////////////////////////////////////////////// 

app.post("/cadastrar_post", function (req, resp) {
  var data = {
    titulo: req.body.titulo,
    resumo: req.body.resumo,
    conteudo: req.body.conteudo,
    data_criacao: new Date()
  };

  posts.insertOne(data, function (err) {
    if (err) {
      resp.render('resposta_post', { resposta: "Erro ao cadastrar post!" })
    } else {
      resp.render('resposta_post', { resposta: "Post cadastrado com sucesso!" })
    };
  });
});

////////////////////////////////////////////// 
// PROJETO 2: GERÊNCIA DE USUÁRIOS
////////////////////////////////////////////// 

app.post("/cadastrar_usuario", function (req, resp) {
  var data = { db_nome: req.body.nome, db_login: req.body.login, db_senha: req.body.senha };

  usuarios.insertOne(data, function (err) {
    if (err) {
      resp.render('resposta_usuario', { resposta: "Erro ao cadastrar usuário!" })
    } else {
      resp.render('resposta_usuario', { resposta: "Usuário cadastrado com sucesso!" })
    };
  });
});

app.post("/logar_usuario", function (req, resp) {
  var data = { db_login: req.body.login, db_senha: req.body.senha };

  usuarios.find(data).toArray(function (err, items) {
    if (items.length == 0) {
      resp.render('resposta_usuario', { resposta: "Usuário/senha não encontrado!" })
    } else if (err) {
      resp.render('resposta_usuario', { resposta: "Erro ao logar usuário!" })
    } else {
      resp.render('resposta_usuario', { resposta: "Usuário logado com sucesso!" })
    };
  });
});

////////////////////////////////////////////// 
// PROJETO 2: GERÊNCIA DE CARROS
////////////////////////////////////////////// 

app.get("/carros", function (req, resp) {
  carros.find({}).toArray(function (err, items) {
    if (err) {
      resp.render('listagem_carros.ejs', { carros: [] });
    } else {
      resp.render('listagem_carros.ejs', { carros: items });
    }
  });
});

app.post("/cadastrar_carro", function (req, resp) {
  var data = {
    marca: req.body.marca,
    modelo: req.body.modelo,
    ano: req.body.ano,
    qtde_disponivel: parseInt(req.body.qtde_disponivel)
  };

  carros.insertOne(data, function (err) {
    if (err) {
      resp.render('resposta_carro', { resposta: "Erro ao cadastrar carro!" })
    } else {
      resp.render('resposta_carro', { resposta: "Carro cadastrado com sucesso!" })
    };
  });
});

app.post("/atualizar_carro", function (req, resp) {
  var mongodb_id = new mongodb.ObjectId(req.body.id);
  var data = { _id: mongodb_id };
  var newData = {
    $set: {
      marca: req.body.marca,
      modelo: req.body.modelo,
      ano: req.body.ano,
      qtde_disponivel: parseInt(req.body.qtde_disponivel)
    }
  };

  carros.updateOne(data, newData, function (err, result) {
    if (result.modifiedCount == 0) {
      resp.render('resposta_carro', { resposta: "Carro não encontrado!" })
    } else if (err) {
      resp.render('resposta_carro', { resposta: "Erro ao atualizar carro!" })
    } else {
      resp.render('resposta_carro', { resposta: "Carro atualizado com sucesso!" })
    };
  });
});

app.post("/remover_carro", function (req, resp) {
  var mongodb_id = new mongodb.ObjectId(req.body.id);
  var data = { _id: mongodb_id };

  carros.deleteOne(data, function (err, result) {
    if (result.deletedCount == 0) {
      resp.render('resposta_carro', { resposta: "Carro não encontrado!" })
    } else if (err) {
      resp.render('resposta_carro', { resposta: "Erro ao remover carro!" })
    } else {
      resp.render('resposta_carro', { resposta: "Carro removido com sucesso!" })
    };
  });
});

app.post("/vender_carro", function (req, resp) {
  var mongodb_id = new mongodb.ObjectId(req.body.id);
  var data = { _id: mongodb_id };

  carros.findOne(data, function (err, carro) {
    if (err || !carro) {
      resp.render('resposta_carro', { resposta: "Carro não encontrado!" })
    } else if (carro.qtde_disponivel <= 0) {
      resp.render('resposta_carro', { resposta: "Carro esgotado!" })
    } else {
      var newData = { $set: { qtde_disponivel: carro.qtde_disponivel - 1 } };
      carros.updateOne(data, newData, function (err, result) {
        if (err) {
          resp.render('resposta_carro', { resposta: "Erro ao vender carro!" })
        } else {
          resp.render('resposta_carro', { resposta: "Venda realizada com sucesso!" })
        };
      });
    }
  });
});

app.get("/gerencia_carros", function (req, resp) {
  carros.find({}).toArray(function (err, items) {
    if (err) {
      resp.render('gerencia_carros.ejs', { carros: [] });
    } else {
      resp.render('gerencia_carros.ejs', { carros: items });
    }
  });
});
