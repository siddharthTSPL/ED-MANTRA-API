const nodemailer = require("nodemailer");
const HOST =process.env.TRANSPORTER_HOST;
const PORT = process.env.TRANSPORTER_PORT;
const USER = process.env.TRANSPORTER_USER;
const PASS = process.env.TRANSTORTER_PASS;

const transporter = nodemailer.createTransport({
  host:HOST,
  port:PORT,
  auth: {
    user:USER,
    pass:PASS,
  },
});

module.exports = transporter;
