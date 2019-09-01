const request = require("request");

const getLocationFromIp = () => {
  const url = "https://ipinfo.io?token=yourtoken";

  return new Promise((resolve, reject) => {
    request.get(url, { json: true }, (err, res, body) => {
      if (err) reject(err);
      else resolve(body);
    });
  });
};

module.exports = getLocationFromIp;
