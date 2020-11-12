const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "d51cde7656e36a",
    pass: "339bb4ab778ff9",
  },
});
