const conn = require("../config/db");

function findIdConversationUser(id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT C.c_id , U.`username` FROM conversation C , users U WHERE (C.user_one = ? AND  U.`id` = C.user_two) OR (C.user_two = ? AND U.`id`= C.user_one)",
      [id, id],
      (err, userid) => {
        if (err) reject(err);
        else resolve(userid);
      }
    );
  });
}

function findConversation(cid, uid) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT * FROM conversation_reply C WHERE C.c_id_fk =? AND C.user_id_fk != ? AND C.read = 0 ORDER BY C.time DESC LIMIT 1",
      [cid, uid],
      (err, conversation) => {
        if (err) reject(err);
        else resolve(conversation);
      }
    );
  });
}

module.exports = {
  findIdConversationUser: findIdConversationUser,
  findConversation: findConversation
};
