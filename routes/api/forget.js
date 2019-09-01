const express = require("express");
const router = express.Router();
const findUser = require("../../Utils/FindUser");
const conn = require("../../config/db");
const bcrypt = require("bcrypt");
const transporter = require("../../middleware/transporter");
const genToken = require("../../Utils/GenToken");
const Validator = require("../../Validator/validator");

// @route   Post api/forget
// @desc    Forget password
// @access  Public
router.post("/", async (req, res) => {
  const { username } = req.body;

  const token = genToken(60);

  try {
    const user = await findUser.findUserbyUsername(username);

    if (!user.length) {
      return res.json({ errors: [{ msg: "No account found !" }] });
    }

    if (!user[0].isVerified) {
      return res.json({
        errors: [{ msg: "Please validate your account before" }]
      });
    }

    conn.query("UPDATE users SET reset_token = ?, reset_at = ? WHERE id = ?", [
      token,
      new Date(),
      user[0].id
    ]);

    const mailOptions = {
      from: "matcha@matcha.com",
      to: user[0].email,
      subject: "Reset password for you account",
      html: `Click on this link to reset your password http://localhost:3000/reset?token=${token}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err.message);
        res.send("Server Error");
      }
    });

    res.json({
      msg: `Check your email for instruction to reset your password`
    });
  } catch (err) {
    console.error(err.message);
    res.send("Server error");
  }
});

// @route   Post api/forget/reset
// @desc    Forget Password
// @access  Public
router.post("/reset", async (req, res) => {
  const { token, password, password2 } = req.body;

  try {
    const user = await findUser.findUserForget(token);

    if (user.length === 0)
      return res.json({ errors: [{ msg: "Token expired" }] });

    if (!Validator.validatePassword(password))
      return res.json({
        errors: [{ msg: "Your password is incorrect" }]
      });

    if (password != password2)
      return res.json({
        errors: [{ msg: "The two passwords are not identical" }]
      });

    let userpwd = {
      password
    };

    const salt = await bcrypt.genSalt(10);

    userpwd.password = await bcrypt.hash(password, salt);

    conn.query(
      "UPDATE users SET password = ?, reset_token = ? WHERE reset_token = ?",
      [userpwd.password, undefined, user[0].reset_token]
    );

    const mailOptions = {
      from: "matcha@matcha.com",
      to: user[0].email,
      subject: "Reset password",
      html:
        "Your password has ben reseted, click on this link to login http://localhost:3000/login"
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err.message);
        res.send("Server Error");
      }
    });

    res.json({ msg: `Your Password has been reseted` });
  } catch (err) {
    console.error(err.message);
    res.send("Server Error");
  }
});

module.exports = router;
