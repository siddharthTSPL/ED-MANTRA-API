const transporter = require("../connections/transpoter");
const HOST=process.env.TRANSPORTER_HOST

const sendEmail = async (data) => {

  const mailOptions = {
    from:"admin@mantraserp.com",
    to:data?.email,
    subject: data?.subject,
    html:data?.template,
  };

  const isSend = await transporter.sendMail(mailOptions);
  if (isSend?.accepted) {
    return true;
  } else {
    return false;
  }

};
module.exports = sendEmail;
