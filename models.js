const sqlite3 = require('sqlite3').verbose();

// Connexion à la base de données
let db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log('Base de données connectée.');
});

// Création de la table "hotels"
db.run(`CREATE TABLE IF NOT EXISTS hotels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL
)`);

// Modèle de données pour représenter un hôtel
class Hotel {
  constructor(name, category) {
    this.name = name;
    this.category = category;
  }

  // Enregistrer un nouvel hôtel dans la base de données
  save(callback) {
    db.run(
      `INSERT INTO hotels (name, category) VALUES (?, ?)`,
      [this.name, this.category],
      function (err) {
        if (err) {
          console.error(err.message);
          return callback(err);
        }
        console.log(`Hôtel ${this.name} ajouté avec l'ID ${this.lastID}`);
        callback(null, this.lastID);
      }
    );
  }

  // Rechercher tous les hôtels dans la base de données
  static findAll(callback) {
    db.all(`SELECT * FROM hotels`, [], function (err, rows) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      const hotels = rows.map((row) => new Hotel(row.name, row.category));
      callback(null, hotels);
    });
  }

  // Rechercher un hôtel par ID dans la base de données
  static findById(id, callback) {
    db.get(`SELECT * FROM hotels WHERE id = ?`, [id], function (err, row) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      if (!row) {
        return callback(new Error('Hôtel non trouvé'));
      }
      const hotel = new Hotel(row.name, row.category);
      callback(null, hotel);
    });
  }

  // Mettre à jour un hôtel dans la base de données
  static updateById(id, name, category, callback) {
    db.run(
      `UPDATE hotels SET name = ?, category = ? WHERE id = ?`,
      [name, category, id],
      function (err) {
        if (err) {
          console.error(err.message);
          return callback(err);
        }
        console.log(`Hôtel avec l'ID ${id} mis à jour.`);
        callback(null);
      }
    );
  }

  // Supprimer un hôtel de la base de données
  static deleteById(id, callback) {
    db.run(`DELETE FROM hotels WHERE id = ?`, [id], function (err) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      console.log(`Hôtel avec l'ID ${id} supprimé.`);
      callback(null);
    });
  }
}

module.exports = db;