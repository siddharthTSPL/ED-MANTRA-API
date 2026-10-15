const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.zoho.com", // use smtp.zoho.in if the Zoho account is in the India data center
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // SSL on 465
  auth: {
    user: process.env.SUPPORT_EMAIL,
    pass: process.env.SUPPORT_EMAIL_PASSWORD,
  },
});

module.exports = transporter;