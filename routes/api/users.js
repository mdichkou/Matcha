const express = require("express");
const router = express.Router();
const conn = require("../../config/db");
const bcrypt = require("bcrypt");
const findUser = require("../../Utils/FindUser");
const Validator = require("../../Validator/validator");
const transporter = require("../../middleware/transporter");
const genToken = require("../../Utils/GenToken");

// @route   Post api/users
// @desc    Register user
// @access  Public
router.post("/", async (req, res) => {
  const {
    username,
    email,
    password,
    password2,
    lastname,
    firstname
  } = req.body;

  const token = genToken(60);
  const errors = [];

  try {
    if (!Validator.validateEmail(email))
      errors.push({ msg: "Your email is invalid" });

    if (!Validator.validateName(firstname))
      errors.push({ msg: "Your firstname is invalid" });

    if (!Validator.validateName(lastname))
      errors.push({ msg: "Your lastname is invalid" });

    if (!Validator.validateUsername(username))
      errors.push({ msg: "Your username is invalid" });

    if (!Validator.validatePassword(password))
      errors.push({ msg: "Your password is incorrect" });

    if (password != password2)
      errors.push({ msg: "The two passwords are not identical" });

    if (errors.length) return res.json({ errors });

    const doesUserExists = await findUser.findUser(email, username);
    if (doesUserExists.length)
      return res.json({ errors: [{ msg: "User Already exists" }] });

    let user = {
      username,
      email,
      password,
      lastname,
      firstname,
      token
    };

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await conn.query(
      "INSERT INTO users SET username = ?, email = ?, password = ?, lastname = ?, firstname = ?, confirmation_token = ?",
      [
        user.username,
        user.email,
        user.password,
        user.lastname,
        user.firstname,
        user.token
      ]
    );

    const mailOptions = {
      from: "matcha@matcha.com",
      to: email,
      subject: "Account confirmation",
      html: `Click on this link to verify your email http://localhost:5000/verify?token=${
        user.token
      }`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err.message);
        res.send("Server Error");
      }
      res.json({ msg: "Check your email for validate your account" });
    });
  } catch (err) {
    console.error(err.message);
    res.send("Server Error");
  }
});

// @route   Post api/users/verification
// @desc    verification user
// @access  Public
router.post("/verification", async (req, res) => {
  const { token } = req.body;

  try {
    const user = await findUser.findUserbyToken(token);

    if (user.length === 0) {
      return res.json({ errors: [{ msg: "Token expired" }] });
    }

    conn.query(
      "UPDATE users SET confirmation_token = ?, isVerified = ?, confirmed_at = ? WHERE confirmation_token = ?",
      [undefined, "1", new Date(), user[0].confirmation_token]
    );

    const mailOptions = {
      from: "matcha@matcha.com",
      to: user[0].email,
      subject: "Validation account",
      html:
        "Your account has ben validated, click on this link to login http://localhost:5000/login"
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err.message);
        res.send("Server Error");
      }

      res.json({ msg: `User with ${user[0].email} has been verified` });
    });
  } catch (err) {
    console.error(err.message);
    res.send("Server Error");
  }
});

module.exports = router;
