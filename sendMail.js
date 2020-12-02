const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  server: 'qq',
  port: 465 // SMPT 端口
  secureConnection: true,
  auth: {
    user: '943160935@qq.com',
    pass: '', // SMPT 授权码

  }
})
const sendMail = (message) => {
  const mailOptions = {
    from: `'某人的邮箱' <94316095@qq.com>`,
    to: '943160935@qq.com',
    subject: 'test cicd',
    html: 'message'
  }
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('sendMail err -->', err)
      return 
    }
    console.log('success info', info)
  })
}

module.exports = sendMail;
