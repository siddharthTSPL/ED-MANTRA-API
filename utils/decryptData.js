const crypto = require("crypto");

const staticKey = process.env.PASSKEY;
const keyBuffer = Buffer.alloc(32, staticKey, "utf-8");

const decryptData = (encryptedData) => {
  encryptedData = JSON.parse(encryptedData);

  const decipher = crypto.createDecipheriv(
    process.env.PASSALGO,
    keyBuffer,
    Buffer.from(encryptedData.iv, "hex")
  );
  let decrypted = decipher.update(encryptedData.encryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};

module.exports = decryptData;
