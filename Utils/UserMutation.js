const bcrypt = require("bcrypt");
const conn = require("../config/db");
const Validator = require("../Validator/validator");
const { findUser } = require("./FindUser");

async function CreateUser(data) {
  const {
    username,
    email,
    password,
    passwordConfirmation,
    lastname,
    firstname,
  } = data;

  const errors = [];

  try {
    if (!Validator.validateEmail(email))
      errors.push(new Error('Your email is invalid'));

    if (!Validator.validateName(firstname))
      errors.push(new Error('Your firstname is invalid'));

    if (!Validator.validateName(lastname))
      errors.push(new Error('Your lastname is invalid'));

    if (!Validator.validateUsername(username))
      errors.push(new Error('Your username is invalid'));

    if (!Validator.validatePassword(password))
      errors.push(new Error('Your password is incorrect'));

    if (password != passwordConfirmation)
      errors.push(new Error('The two passwords are not identical'));

    if (errors.length) throw errors;

    const doesUserExists = await findUser(email, username);
    if (doesUserExists.length) throw new Error('User Already exists');

    const salt = await bcrypt.genSalt(10);

    let CryptedPassword = await bcrypt.hash(password, salt);

    await conn.query(
      'INSERT INTO users SET username = ?, email = ?, password = ?, lastname = ?, firstname = ?',
      [username, email, CryptedPassword, lastname, firstname]
    );

    const user = await findUser(email, username);

    console.log('User::', user)
    return user;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function deleteUser() {

}

async function firstVisitUpdate(data) {
  const { id, age, bdate, phone, gender, sexualpref, bio, tags } = data;

  const errors = [];

  try {
    if (!Validator.validateAge(age))
      errors.push(new Error("Your age is invalid" ));

    if (!Validator.validatePhone(phone))
      errors.push(new Error("Your phone is invalid" ));

    if (!Validator.validateBio(bio))
      errors.push(new Error("Your biography must be between 20 and 250 characters"));

    if (!Validator.validateGender(gender))
      errors.push(new Error("Select a valid gender " ));

    if (!Validator.validateSexualpref(sexualpref))
      errors.push(new Error("Select a valid sexual preference " ));

    if (!Validator.validateTags(tags))
      errors.push(new Error("Select at least one tag" ));

    if (errors.length) throw errors;

    const user = await conn.query(
      "UPDATE users SET age = ?, bdate = ?, phone = ?, gender = ?, sexualpref = ?, bio= ?, isFirstvisit = ? WHERE id = ?",
      [age, bdate, phone, gender, sexualpref, bio, "0", id]
    );

    await conn.query("INSERT INTO tags SET tags = ?, user_id = ?", [
      JSON.stringify(tags),
      id
    ]);

    return user;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function editUser() {

}

module.exports = { CreateUser, deleteUser, firstVisitUpdate, editUser };
