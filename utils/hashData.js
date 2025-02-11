const crypto = require("crypto");

const algorithm = process.env.PASSALGO;
const staticKey = process.env.PASSKEY;
const keyBuffer = Buffer.alloc(32, staticKey, "utf-8");
const iv = crypto.randomBytes(parseInt(process.env.ROUNDS));

const hash = (text) => {
  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  const encriptedData = JSON.stringify({
    iv: iv.toString("hex"),
    encryptedText: encrypted,
  });
  return encriptedData;
};

module.exports = hash;
