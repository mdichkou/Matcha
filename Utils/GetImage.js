module.exports = function base64MimeType(type) {
  var result = null;

  if (type === "image/jpeg") result = ".jpg";
  else if (type === "image/png") result = ".png";

  return result;
};
