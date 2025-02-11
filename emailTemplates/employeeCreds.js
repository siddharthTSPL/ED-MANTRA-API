const employeeCreds = (data) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your login Credentials</title>
      <style>
body, html {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
}

/* Container */
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  color: #333;
  font-size: 24px;
}

/* OTP Section */
.otp-section {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.otp-section p {
  margin: 0;
  font-size: 18px;
}

.otp {
  font-size: 24px;
  color: #007bff;
  margin-top: 10px;
}

/* Footer */
.footer {
  text-align: center;
  margin-top: 20px;
}

.footer p {
  font-size: 14px;
  color: #666;
}
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>User Credentials</h1>
          </div>
          <div class="otp-section">
              <p>Hi, ${data?.fname} </p>
              <p>User Id : ${data?.empId}</p>
              <p>Password : ${data?.password}</p>
          </div>
          <div class="footer">
              <p>Please do not share this Credentials with anyone. Thank you!</p>
          </div>
      </div>
  </body>
  </html>`;
};

module.exports = employeeCreds;
