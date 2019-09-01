const conn = require("../config/db");

function findAllMembers(id) {
  const sql =
    "SELECT C.c_id, U.`username`, I.`path` FROM conversation C, users U , images I WHERE (C.user_one = ? AND  U.`id` = C.user_two AND I.`user_id` = U.`id` AND I.`isProfile` = 1) OR (C.user_two = ? AND U.`id`= C.user_one AND I.`user_id` = U.`id` AND I.`isProfile` = 1)";
  return new Promise((resolve, reject) => {
    conn.query(sql, [id, id], (err, members) => {
      if (err) reject(err);
      else resolve(members);
    });
  });
}

module.exports = { findAllMembers: findAllMembers };
