import sqlite3 from "sqlite3";
const db = new sqlite3.Database("./musiList.db");

export function getSongs(search = {}) {
  const filterFields = [];
  const filterValues = [];

  Object.keys(search).forEach((key) => {
    if (search[key]?.length) {
      filterFields.push(`${key} LIKE ?`);
      filterValues.push(`%${search[key]}%`);
    }
  });

  let query = "SELECT * FROM songs";

  if (filterFields?.length) {
    query += ` WHERE ${filterFields.join(" AND ")}`;
  }

  return new Promise((resolve, reject) => {
    const songs = [];
    db.each(
      query,
      filterValues,
      (err, row) => {
        if (err) reject(err);
        else {
          songs.push({
            id: row.id,
            title: row.title,
            artist: row.artist,
            genre: row.genre,
            reason: row.reason,
            date_created: row.date_created,
          });
        }
      },
      (err, n) => {
        if (err) {
          reject(err);
        } else {
          resolve(songs);
        }
      }
    );
  });
}

export function getSongById(id) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT id, title, artist, genre, reason FROM songs WHERE id = ${id}`,
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
}

export function addSong({ title, artist, genre, reason }) {
  const query = `INSERT INTO songs (title, artist, genre, reason) VALUES (?, ?, ?, ?)`;

  return new Promise((resolve, reject) => {
    db.run(query, [title, artist, genre, reason], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function updateSong(id, { title, artist, genre, reason }) {
  const query = `UPDATE songs SET title = ?, artist = ?, genre = ?, reason = ? WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.run(query, [title, artist, genre, reason, id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function patchSong(id, updates) {
  const fields = [];
  const values = [];

  Object.keys(updates).forEach((key) => {
    fields.push(`${key} = ?`);
    values.push(updates[key]);
  });

  const query = `UPDATE songs SET ${fields.join(", ")} WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.run(query, [...values, id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function deleteSongById(id) {
  const query = `DELETE FROM songs WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.run(query, [id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
