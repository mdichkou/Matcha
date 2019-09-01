const epxress = require("express");
const router = epxress.Router();
const conn = require("../../config/db");
const auth = require("../../middleware/auth");
const findUser = require("../../Utils/FindUser");

// @route   /api/match
// @desc    Let user Like
// @access  Private
router.post("/", auth, async (req, res) => {
  const { userid } = req.body;

  const user = await findUser.findUserbyId(req.user.id);
  const otherUser = await findUser.findUserbyId(userid);

  const check = await findUser.checkMatchUser(
    req.user.id,
    userid,
    userid,
    req.user.id
  );

  if (check.length) {
    const rowId = await findUser.checkUserIdRow(req.user.id, userid);

    if (!rowId.length && !check[0].isMatch) {
      await conn.query(
        "UPDATE `match` SET `isMatch` = ? WHERE (user1_id = ? AND user2_id = ?) OR (user2_id = ? AND user1_id = ?)",
        [1, req.user.id, userid, req.user.id, userid]
      );

      await conn.query(
        "INSERT INTO notifications SET user_id = ?, notification = ?",
        [userid, `It's a match with ${user[0].username}`]
      );

      await conn.query(
        "INSERT INTO notifications SET user_id = ?, notification = ?",
        [req.user.id, `It's a match with ${otherUser[0].username}`]
      );

      await conn.query(
        "INSERT INTO conversation SET user_one = ?, user_two = ?",
        [req.user.id, userid]
      );

      return res.json({
        msg: "It's match",
        msg2: `It's a match with ${otherUser[0].username}`
      });
    }
  } else {
    await conn.query("INSERT INTO `match` SET user1_id = ?, user2_id = ?", [
      req.user.id,
      userid
    ]);

    await conn.query(
      "INSERT INTO notifications SET user_id = ?, notification = ?",
      [userid, `${user[0].username} like you`]
    );

    return res.json({
      msg: "User liked ",
      msg2: `${user[0].username} like you`
    });
  }
});

// @route   /api/match/unlike
// @desc    Let user unlike
// @access  Private
router.post("/unlike", auth, async (req, res) => {
  const { userid } = req.body;

  const user = await findUser.findUserbyId(req.user.id);

  const check = await findUser.checkMatchUser(
    req.user.id,
    userid,
    userid,
    req.user.id
  );

  if (check[0].isMatch) {
    await conn.query(
      "DELETE FROM `match` WHERE ((user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)) AND isMatch = ?",
      [req.user.id, userid, userid, req.user.id, 1]
    );

    await conn.query(
      "INSERT INTO notifications SET user_id = ?, notification = ?",
      [userid, `${user[0].username} doesn't like you anymore !`]
    );

    await conn.query(
      "DELETE FROM conversation WHERE (user_one = ? AND user_two = ?) OR (user_one = ? AND user_two = ?)",
      [req.user.id, userid, userid, req.user.id]
    );
  } else {
    await conn.query(
      "DELETE FROM `match` WHERE ((user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)) AND isMatch = ?",
      [req.user.id, userid, userid, req.user.id, 0]
    );

    await conn.query(
      "INSERT INTO notifications SET user_id = ?, notification = ?",
      [userid, `${user[0].username} doesn't like you anymore !`]
    );
  }

  return res.json({
    msg: "User unliked successfuly !",
    msg2: `${user[0].username} doesn't like you anymore !`
  });
});

// @route   /api/match/block
// @desc    Let user block
// @access  Private
router.post("/block", auth, async (req, res) => {
  const { userid } = req.body;

  const row = await findUser.checkMatchUser(req.user.id, userid);

  if (row.length) {
    await conn.query(
      "UPDATE `match` SET isBlocked = ?, isMatch = ? WHERE ((user1_id = ? AND user2_id = ?) OR (user2_id = ? AND user1_id = ?))",
      [1, 0, req.user.id, userid, req.user.id, userid]
    );

    await conn.query(
      "DELETE FROM conversation WHERE (user_one = ? AND user_two = ?) OR (user_one = ? AND user_two = ?)",
      [req.user.id, userid, userid, req.user.id]
    );
  } else {
    await conn.query(
      "INSERT INTO `match` SET user1_id = ?, user2_id = ?, isMatch = ?, isBlocked = ?",
      [req.user.id, userid, 0, 1]
    );

    await conn.query(
      "DELETE FROM conversation WHERE (user_one = ? AND user_two = ?) OR (user_one = ? AND user_two = ?)",
      [req.user.id, userid, userid, req.user.id]
    );
  }

  return res.json({ msg: "User blocked !" });
});

module.exports = router;
