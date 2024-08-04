const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "loxigems@gmail.com",
    pass: "suis xltf etgc fode",
  },
});

module.exports = transporter;
