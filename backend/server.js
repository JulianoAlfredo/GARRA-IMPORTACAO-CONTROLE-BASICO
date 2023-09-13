const express = require('express');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 8080;

// Middleware para analisar o corpo das solicitações
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// Configuração do banco de dados SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados SQLite:', err);
  } else {
    console.log('Conexão ao banco de dados SQLite estabelecida com sucesso');
  }
});

// Crie tabelas no banco de dados SQLite
// Crie tabelas no banco de dados SQLite
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, person_id INTEGER, name TEXT, value REAL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)');
});



// Definição das informações do Swagger
const swaggerDefinition = {
  info: {
    title: 'Gerenciamento de Pessoas e Produtos API',
    version: '1.0.0',
    description: 'API para gerenciar pessoas e seus produtos embalados',
  },
  basePath: '/',
};

const options = {
  swaggerDefinition,
  apis: ['server.js'], // Substitua pelo nome do seu arquivo principal ou use vários arquivos
};

const swaggerSpec = swaggerJSDoc(options);

// Rota para servir a documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/people:
 *   post:
 *     tags:
 *       - People
 *     description: Cria uma nova pessoa
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: Nome da pessoa
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Pessoa criada com sucesso
 *       400:
 *         description: Erro ao criar a pessoa
 */
app.post('/api/people', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send('Nome da pessoa é obrigatório');
  }

  const stmt = db.prepare('INSERT INTO people (name) VALUES (?)');
  stmt.run(name, (err) => {
    if (err) {
      console.error('Erro ao inserir pessoa no banco de dados:', err);
      return res.status(400).send('Erro ao criar a pessoa');
    }

    console.log('Pessoa criada com sucesso');
    res.status(200).send('Pessoa criada com sucesso');
  });

  stmt.finalize();
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags:
 *       - Products
 *     description: Adiciona um produto a uma pessoa
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: personId
 *         description: ID da pessoa à qual o produto será adicionado
 *         in: formData
 *         required: true
 *         type: integer
 *       - name: name
 *         description: Nome do produto
 *         in: formData
 *         required: true
 *         type: string
 *       - name: value
 *         description: Valor do produto
 *         in: formData
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: Produto adicionado com sucesso
 *       400:
 *         description: Erro ao adicionar o produto
 */
app.post('/api/products', (req, res) => {
  const { personId, name, value } = req.body;

  if (!personId || !name || !value) {
    return res.status(400).send('Parâmetros inválidos');
  }

  const stmt = db.prepare('INSERT INTO products (person_id, name, value) VALUES (?, ?, ?)');
  stmt.run(personId, name, value, (err) => {
    if (err) {
      console.error('Erro ao inserir produto no banco de dados:', err);
      return res.status(400).send('Erro ao adicionar o produto');
    }

    console.log('Produto adicionado com sucesso');
    res.status(200).send('Produto adicionado com sucesso');
  });

  stmt.finalize();
});

/**
 * @swagger
 * /api/reports:
 *   get:
 *     tags:
 *       - Reports
 *     description: Retorna um relatório do dia
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Relatório do dia retornado com sucesso
 *       400:
 *         description: Erro ao gerar o relatório
 */
/**
 * @swagger
 * /api/reports:
 *   get:
 *     tags:
 *       - Reports
 *     description: Retorna um relatório do dia com data e hora de criação dos produtos
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Relatório do dia com data e hora de criação dos produtos retornado com sucesso
 *       400:
 *         description: Erro ao gerar o relatório
 */
app.get('/api/reports', (req, res) => {
  const report = {
    people: [],
  };

  // Consulta as pessoas no banco de dados
  db.all('SELECT * FROM people', (err, people) => {
    if (err) {
      console.error('Erro ao buscar pessoas no banco de dados:', err);
      return res.status(400).send('Erro ao gerar o relatório');
    }

    // Para cada pessoa, busca seus produtos com data e hora de criação
    const promises = people.map((person) => {
      return new Promise((resolve, reject) => {
        db.all("SELECT id, name, value, datetime(created_at, 'localtime') AS created_at FROM products WHERE person_id = ?", [person.id], (err, products) => {
          if (err) {
            reject(err);
          } else {
            person.products = products;
            resolve(person);
          }
        });
      });
    });

    // Quando todas as consultas forem concluídas, monta o relatório
    Promise.all(promises)
      .then((peopleWithProducts) => {
        report.people = peopleWithProducts;
        res.status(200).json(report);
      })
      .catch((err) => {
        console.error('Erro ao buscar produtos no banco de dados:', err);
        res.status(400).send('Erro ao gerar o relatório');
      });
  });
});
/**
 * @swagger
 * /api/people/list:
 *   get:
 *     tags:
 *       - Reports
 *     description: Retorna um relatório do dia com data e hora de criação dos produtos
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Relatório do dia com data e hora de criação dos produtos retornado com sucesso
 *       400:
 *         description: Erro ao gerar o relatório
 */
app.get('/api/people/list', (req, res) => {
  // Consulte as pessoas no banco de dados e retorne a lista
  db.all('SELECT id, name FROM people', (err, people) => {
    if (err) {
      console.error('Erro ao buscar a lista de pessoas no banco de dados:', err);
      return res.status(400).json({ error: 'Erro ao buscar a lista de pessoas' });
    }

    res.status(200).json(people);
  });
});


// Resto do código...

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

