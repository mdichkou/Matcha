function validateEmail(email) {
  const reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return reg.test(email);
}

function validateName(name) {
  const reg = /^[a-zA-Z '-]+$/;
  return reg.test(name);
}

function validateUsername(username) {
  const reg = /^[a-zA-Z0-9-_]{4,12}$/;

  return reg.test(username);
}

function validatePassword(password) {
  const reg = /^(?=.*[!@#$%^&*-])(?=.*[0-9])(?=.*[A-Z]).{6,12}$/;

  return reg.test(password);
}

function validateBdate(bdate) {
  const reg = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;

  return reg.test(bdate);
}

function validateAge(age) {
  const reg = /^([1-9][0-9]?){0,1}$/;

  return reg.test(age);
}

function validatePhone(phone) {
  const reg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

  return reg.test(phone);
}

function validateBio(bio) {
  if (bio.length > 250 || bio.length < 20) return false;
  return true;
}

function validateTags(tag) {
  var count = Object.keys(tag).length;

  if (count >= 1) return true;
  return false;
}

function validatePhoto(photo) {
  const matches = photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

  if (matches.length !== 3) return false;
  return true;
}

function validateGender(gender) {
  if (gender !== "male" && gender !== "female" && gender !== "other")
    return false;
  return true;
}

function validateSexualpref(sexualpref) {
  if (sexualpref !== "men" && sexualpref !== "women" && sexualpref !== "both")
    return false;
  return true;
}

function validatePosition(position) {
  const reg = /^(\-?\d+(\.\d+)?)$/;

  return reg.test(position);
}

module.exports = {
  validateEmail: validateEmail,
  validateName: validateName,
  validateUsername: validateUsername,
  validatePassword: validatePassword,
  validatePhone: validatePhone,
  validatePhoto: validatePhoto,
  validateBio: validateBio,
  validateTags: validateTags,
  validateAge: validateAge,
  validateBdate: validateBdate,
  validateGender: validateGender,
  validateSexualpref: validateSexualpref,
  validatePosition: validatePosition
};
