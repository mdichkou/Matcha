const express = require("express");
const router = express.Router();
const conn = require("../../config/db");
const auth = require("../../middleware/auth");
const FindNotifications = require("../../Utils/FindNotifications");

// @route   Get api/notification
// @desc
// @access  Private
router.get("/", auth, async (req, res) => {
  const id = req.user.id;

  try {
    await conn.query(
      "SELECT * FROM notifications WHERE user_id=? AND seen=0 ORDER BY created_at DESC",
      [id],
      (err, rows, fields) => {
        if (!err) res.send(rows);
      }
    );
  } catch (err) {
    console.error(err.message);
    res.send("Server Error");
  }
});

// @route   Post api/notification
// @desc
// @access  Private
router.post("/", auth, async (req, res) => {
  const id = req.user.id;

  try {
    await conn.query("UPDATE notifications N SET N.seen=1 WHERE N.user_id=? ", [
      id
    ]);
  } catch (err) {
    console.error(err.message);
    res.send("Server Error");
  }
});

// @route   Get api/notification/allnotifications
// @desc
// @access  Private
router.get("/allnotifications", auth, async (req, res) => {
  const id = req.user.id;

  const notifs = await FindNotifications.findAllNotifications(id);

  res.json(notifs);
});

module.exports = router;
