const conn = require("../config/db");

function countVisit(id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT COUNT(*) as countVisit FROM visits WHERE userid_visited = ?",
      [id],
      (err, countVisit) => {
        if (err) reject(err);
        else resolve(countVisit);
      }
    );
  });
}

function countLike(id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT COUNT(*) as countLike FROM `match` WHERE user2_id = ?",
      [id],
      (err, countVisit) => {
        if (err) reject(err);
        else resolve(countVisit);
      }
    );
  });
}

function countMatch(id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT COUNT(*) as countMatch FROM `match` WHERE (user1_id = ? OR user2_id = ?) AND isMatch = ?",
      [id, id, 1],
      (err, countVisit) => {
        if (err) reject(err);
        else resolve(countVisit);
      }
    );
  });
}

function countBlock(id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT COUNT(*) as countBlock FROM `match` WHERE (user1_id = ? OR user2_id = ?) AND isBlocked = ?",
      [id, id, 1],
      (err, countVisit) => {
        if (err) reject(err);
        else resolve(countVisit);
      }
    );
  });
}

module.exports = {
  countVisit: countVisit,
  countLike: countLike,
  countMatch: countMatch,
  countBlock: countBlock
};
