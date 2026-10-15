require("dotenv").config();
const nodemailer = require("nodemailer");

const hosts = ["smtp.zoho.com", "smtp.zoho.in", "smtp.zoho.eu", "smtppro.zoho.com", "smtppro.zoho.in"];

(async () => {
  for (const host of hosts) {
    const t = nodemailer.createTransport({
      host, port: 465, secure: true,
      auth: { user: process.env.SUPPORT_EMAIL, pass: process.env.SUPPORT_EMAIL_PASSWORD },
    });
    try {
      await t.verify();
      console.log("WORKS:", host);
    } catch (e) {
      console.log("FAIL :", host, "-", e.message);
    }
  }
})();