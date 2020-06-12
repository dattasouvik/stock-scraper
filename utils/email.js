const nodemailer = require('nodemailer');

const sendEmail = async options => {

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: 'Souvik Datta <admin@gmail.com>',
    to: options.email,
    subject: options.subject,
    html: options.message
    // html:
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;