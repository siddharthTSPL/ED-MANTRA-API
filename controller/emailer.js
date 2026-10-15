const transporter = require("../connections/transpoter");

const sendEmail = async (data) => {
  const mailOptions = {
    from: process.env.SUPPORT_EMAIL,
    to: data?.email,
    subject: data?.subject,
    html: data?.template,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    return Array.isArray(info.accepted) && info.accepted.length > 0;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
};

module.exports = sendEmail;