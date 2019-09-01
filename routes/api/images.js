const express = require("express");
const router = express.Router();
const conn = require("../../config/db");
const multer = require("multer");
const upload = multer({ dest: "images/" });
const fs = require("fs");
const GetImage = require("../../Utils/GetImage");
const auth = require("../../middleware/auth");

router.post("/", auth, upload.single("picuser"), async (req, res) => {
  try {
    const img = fs.readFileSync(req.file.path);
    const encode_image = img.toString("base64");

    if (!fs.existsSync("./images")) {
      fs.mkdirSync("./images");
    }

    // convert photo from base64 and save it
    const base64Image = encode_image.split(";base64,").pop();

    const ext = GetImage(req.file.mimetype);

    const filename = "images/" + Date.now() + "-" + req.user.id + ext;
    await fs.writeFile(filename, base64Image, { encoding: "base64" }, err => {
      if (err) res.json({ msg: "Your photo is invalid" });
      else {
        conn.query("INSERT INTO images SET path = ?, user_id = ?", [
          filename,
          req.user.id
        ]);

        // Remove file after save
        fs.unlinkSync(req.file.path);
      }
    });

    res.json({ msg: "Your picture is uploaded" });
  } catch (err) {
    console.error(err.message);
    res.send("Server error");
  }
});

router.post(
  "/profilpic",
  auth,
  upload.single("profilpic"),
  async (req, res) => {
    try {
      const img = fs.readFileSync(req.file.path);
      const encode_image = img.toString("base64");

      if (!fs.existsSync("./images")) {
        fs.mkdirSync("./images");
      }

      // convert photo from base64 and save it
      const base64Image = encode_image.split(";base64,").pop();

      const ext = GetImage(req.file.mimetype);

      const filename = "images/" + Date.now() + "-" + req.user.id + ext;
      await fs.writeFile(filename, base64Image, { encoding: "base64" }, err => {
        if (err) res.json({ msg: "Your photo is invalid" });
        else {
          conn.query(
            "INSERT INTO images SET path = ?, user_id = ?, isprofile = ?",
            [filename, req.user.id, "1"]
          );

          // Remove file after save
          fs.unlinkSync(req.file.path);
        }
      });

      res.json({ msg: "Your picture is uploaded" });
    } catch (err) {
      console.error(err.message);
      res.send("Server error");
    }
  }
);

router.delete("/profilpic", (req, res) => {
  res.send("Delete");
});

router.delete("/", (req, res) => {
  res.send("Delete");
});

router.post("/delete", auth, (req, res) => {
  try {
    const { imgid } = req.body;

    conn.query("DELETE FROM images WHERE path = ?", [imgid]);

    fs.unlinkSync(imgid);

    res.json({ msg: "Your picture is deleted" });
  } catch (err) {
    console.error(err.message);
    res.send("Server error");
  }
});

router.post("/setprofilpic", auth, (req, res) => {
  try {
    const { oldimgid, newimgid } = req.body;

    conn.query("UPDATE images SET isProfile = ? WHERE path = ? ", [
      "0",
      oldimgid
    ]);

    conn.query("UPDATE images SET isProfile = ? WHERE path = ?", [
      "1",
      newimgid
    ]);

    res.json({ msg: "Your profile picture updated" });
  } catch (err) {
    console.error(err.message);
    res.send("Server error");
  }
});

module.exports = router;
