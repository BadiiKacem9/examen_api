const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const db = require('./models');
const hotelSchema = require('./hotelSchema');
const hotelResolver = require('./hotelResolver');
const app = express();
const port = 4000;
// Utilisation de GraphQL pour gérer les requêtes
app.use('/graphql', graphqlHTTP({
  schema: hotelSchema,
  rootValue: hotelResolver,
  graphiql: true
}));
// Utilisation de body-parser pour analyser les demandes HTTP
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Implémentation de l'API REST
app.get('/hotels', (req, res) => {
  db.all(`SELECT * FROM hotels`, [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/hotel/:id', (req, res) => {
  db.get(`SELECT * FROM hotels WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json(row);
  });
});

app.post('/hotel', (req, res) => {
  const { name, category } = req.body;
  db.run(`INSERT INTO hotels (name, category) VALUES (?, ?)`, [name, category], (err) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ "message": "success" });
  });
});

app.put('/hotel/:id', (req, res) => {
  const { name, category } = req.body;
  db.run(`UPDATE hotels SET name = ?, category = ? WHERE id = ?`, [name, category, req.params.id], (err) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ "message": "success" });
  });
});

app.delete('/hotel/:id', (req, res) => {
  db.run(`DELETE FROM hotels WHERE id = ?`, [req.params.id], (err) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ "message": "success" });
  });
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}.`);
});