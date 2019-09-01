const express = require("express");
const router = express.Router();
const conn = require("../../config/db");
const FindConversations = require("../../Utils/FindConversation");
const FindMembers = require("../../Utils/FindMembers");
const auth = require("../../middleware/auth");

router.get("/", auth, async (req, res) => {
  const id = req.user.id;

  try {
    const query1 = await FindConversations.findIdConversationUser(id);

    const promises = query1.map(async user => {
      const query2 = await FindConversations.findConversation(user.c_id, id);

      if (typeof query2[0] !== "undefined") {
        var convobj = {
          username: user.username,
          lastreply: query2[0].reply,
          time: query2[0].time
        };
        return convobj;
      }
    });

    const results = await Promise.all(promises);

    res.send(results);
  } catch (err) {
    console.error(err.message);
    res.send("Server Error");
  }
});

router.post("/", auth, async (req, res) => {
  const id = req.user.id;

  try {
    const query1 = await FindConversations.findIdConversationUser(id);

    query1.map(async user => {
      await conn.query(
        "UPDATE conversation_reply C SET C.read=1 WHERE C.c_id_fk =? AND C.user_id_fk !=?",
        [user.c_id, id]
      );
    });
  } catch (err) {
    console.error(err.message);
    res.send("Server Error");
  }
});

router.get("/members", auth, async (req, res) => {
  const id = req.user.id;

  const member = await FindMembers.findAllMembers(id);

  res.json(member);
});

module.exports = router;
