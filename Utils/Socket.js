const conn = require("../config/db");
const datetime = require("node-datetime");
const FindUser = require("./FindUser");
const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = function(io) {
  const sql =
    "SELECT C.c_id, U.`username`, I.`path` FROM conversation C, users U , images I WHERE (C.user_one = ? AND  U.`id` = C.user_two AND I.`user_id` = U.`id` AND I.`isProfile` = 1) OR (C.user_two = ? AND U.`id`= C.user_one AND I.`user_id` = U.`id` AND I.`isProfile` = 1)";

  const sql2 =
    "SELECT * FROM conversation_reply WHERE c_id_fk=? ORDER BY cr_id DESC";

  const sql3 =
    "SELECT U.username , U.id , I.path FROM conversation C , users U , images I WHERE C.c_id = ? AND (U.`id` = C.user_one OR U.`id` = C.user_two) AND I.`user_id` = U.`id` AND I.`isProfile` = 1";

  var users = {};

  io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token)
      jwt.verify(
        socket.handshake.query.token,
        config.get("jwtSecret"),
        (err, decoded) => {
          if (!err) socket.decoded = decoded.user.id;
          next();
        }
      );
  }).on("connection", socket => {
    socket.on("login", data => {
      users[data.username] = socket.id;
      socket.pseudo = data.username;
      socket.user_id = data.id;
      conn.query("UPDATE users SET users.isOnline = 1 WHERE users.id = ?", [
        data.id
      ]);
    });

    socket.on("members", data => {
      conn.query(sql, [data.id, data.id], (err, rows) =>
        socket.emit("userlist", rows)
      );
    });

    socket.on("read", read => {
      conn.query(
        "UPDATE conversation_reply SET conversation_reply.read=? WHERE conversation_reply.cr_id=?",
        [read.read, read.id]
      );
    });

    socket.on("Updatenot", id => {});

    socket.on("conversation", data => {
      var to = users[data.to];
      conn.query(sql2, [data.cr_id], (err, rows, fields) => {
        socket.to(to).emit("message", rows);
      });
    });

    socket.on("checkonline", user => {
      var to = users[user];
      var online;
      if (typeof to !== "undefined") online = "online";
      else online = "offline";
      socket.emit("online", online);
    });

    socket.on("conv_id", id => {
      conn.query(sql3, [id], (err, rows, fields) => {
        socket.emit("username", rows);
      });
    });

    socket.on("typing", data => {
      var to = users[data.to];
      socket.to(to).emit("updateTyping", data.typing);
    });

    socket.on("send_not", async data => {
      const user = await FindUser.findUserbyId(data.id);
      const pseudo = await FindUser.findUserbyId(socket.decoded);
      var to = users[user[0].username];
      if (typeof to !== "undefined") {
        socket.to(to).emit("notification", data.msg);
      }
    });

    socket.on("privmessage", async data => {
      var to = users[data.to];
      const pseudo = await FindUser.findUserbyId(socket.decoded);
      var sender = users[pseudo[0].username];
      var dt = datetime.create();
      var formatted = dt.format("Y-m-d H:M:S");

      conn.query("INSERT INTO conversation_reply SET ?", {
        reply: data.msg,
        user_id_fk: data.user_id,
        username: data.pseudo,
        c_id_fk: data.cr_id,
        time: formatted
      });

      var rows = {
        lastreply: data.msg,
        username: data.pseudo,
        time: formatted
      };

      var rows2 = {
        msg: data.msg,
        pseudo: data.pseudo,
        time: formatted
      };

      if (typeof to !== "undefined") {
        socket.to(to).emit("message", rows2);
        socket.to(to).emit("not_message", rows);
      }
    });

    socket.on("disconnect", () => {
      delete users[socket.pseudo];
    });
  });
};
