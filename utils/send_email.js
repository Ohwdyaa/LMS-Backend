const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,  
  },
}); 
async function sendResetPasswordEmail(email, token) {
  try {
    const mailOptions = {
      to: email,
      subject: "Reset your password",
      html: `Click on the link to reset your password: http://localhost:3000/reset/${token}`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
}
module.exports = { sendResetPasswordEmail };
