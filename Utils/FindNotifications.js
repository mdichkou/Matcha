const conn = require("../config/db");

function findAllNotifications(id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
      [id],
      (err, notifications) => {
        if (err) reject(err);
        else resolve(notifications);
      }
    );
  });
}

module.exports = { findAllNotifications: findAllNotifications };
