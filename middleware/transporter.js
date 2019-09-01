const nodemailer = require("nodemailer");
const config = require("config");
const smtp = config.get("smtp");

const transporter = nodemailer.createTransport(smtp);

module.exports = transporter;
