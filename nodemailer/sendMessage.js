//AT&T: number@mms.att.net
//Verizon: number@vzwpix.com
//T-Mobile: number@tmomail.net

require('dotenv').config();

module.exports = {
  sendMessage: function (nodemailer, xoauth2,imgURL) {
  let transporter = nodemailer.createTransport(
    {
      service: 'gmail',
      host: 'smtp.gmail.com',
      secure: 'true',
      port: '465',
      auth: {
        type: 'OAuth2',
        user: `${process.env.emailAdd}`,
        clientId: `${process.env.clientId}`,
        clientSecret: `${process.env.clientSecret}`,
        refreshToken: `${process.env.refreshToken}`
      }
    }
  );

  let mailOptions = {
    from: `${process.env.emailAdd}`,
    to: `${process.env.emailAdd},${process.env.phoneNum}`,
    subject: 'Facebell: You got a visitor!!',
    text: "Please check your email and replay in the text message if you approve the visitor",
    
    attachments: [{
      filename: 'visitor',
      path: `${imgURL}`
    }]
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    }
    transporter.close();
  });
 
  
}
}