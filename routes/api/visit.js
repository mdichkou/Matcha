const epxress = require("express");
const router = epxress.Router();
const auth = require("../../middleware/auth");
const conn = require("../../config/db");
const findUser = require("../../Utils/FindUser");

// @route   /api/visit
// @desc    Add visite
// @access  Private
router.post("/", auth, async (req, res) => {
  const { userid } = req.body;

  const user = await findUser.findUserbyId(req.user.id);

  await conn.query(
    "INSERT INTO notifications SET user_id = ?, notification = ?",
    [userid, `${user[0].username} visited your profile`]
  );

  await conn.query("INSERT INTO visits SET user_id = ?, userid_visited = ?", [
    req.user.id,
    userid
  ]);

  return res.json({
    msg: `${user[0].username} visited your profile`
  });
});

module.exports = router;
