const nodemailer = require('nodemailer');
require('dotenv').config(); 


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',      
  port: 587,                    
  secure: false,                
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS   
  },
  debug: true,
});
const sendEmail = (from, to, subject, text) => {
  const mailOptions = {
    from: from,                  
    to: to,                      
    subject: subject,            
    text: text                   
  };

  return transporter.sendMail(mailOptions)
    .then(info => console.log('Email sent:', info.response))
    .catch(error => console.error('Error sending email:', error));
};

module.exports = { sendEmail };
