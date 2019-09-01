const express = require("express");
const router = express.Router();
const conn = require("../../config/db");
const auth = require("../../middleware/auth");

router.get("/:cr_id", auth, async (req, res) => {
  const cr_id = req.params.cr_id;

  try {
    await conn.query(
      "SELECT * FROM conversation_reply WHERE c_id_fk=? ORDER BY time ASC",
      [cr_id],
      (err, rows, fields) => {
        if (!err) res.send(JSON.stringify(rows));
      }
    );
  } catch (err) {
    console.error(err.message);
    res.send("Server Error");
  }
});

module.exports = router;
