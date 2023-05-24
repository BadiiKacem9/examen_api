// hotelResolver.js
const db = require('./models');
// Implémentation des résolveurs GraphQL
const hotelResolver = {
  hotels: ({ id }) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM hotels WHERE id = ?`, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  hotels: () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM hotels`, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  addHotel: ({ name, category }) => {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO hotels (name, category) VALUES (?, ?)`,
        [name, category],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, name, category });
          }
        }
      );
    });
  },

  deleteHotel: ({ id }) => {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM hotels WHERE id = ?`, [id], function (err) {
        if (err) {
          reject(err);
        } else {
          if (this.changes === 0) {
            reject(new Error(`Hotel with id ${id} not found`));
          } else {
            resolve(`Hotel with id ${id} deleted successfully`);
          }
        }
      });
    });
  },
};

module.exports = hotelResolver;