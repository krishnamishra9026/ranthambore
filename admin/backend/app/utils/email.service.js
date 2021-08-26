import nodemailer from 'nodemailer';

import utils from './index';
import systemEmails from '../models/systemEmails.model';

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: 'hbmean@gmail.com',
    pass: 'Hbme@n@2019',
  },
});

export default async function EmailService(to, mailCode, variables) {
  try {
    const template = await systemEmails.findOne({ code: mailCode });
    if (!template) {
      const err = new Error('Template not found.');
      err.status = 401;
      throw err;
    }
    //  get mail content

    let temp = utils.unescape(template.message);

    variables.forEach(async element => {
      const reg = new RegExp(`#${element.item}#`, 'g');
      temp = temp.replace(reg, element.value);
    });

    // setup email data with unicode symbols
    const mailOptions = {
      from: utils.unescape(template.fromName), // sender addres  s
      to, // list of receivers
      subject: utils.unescape(template.subject), // Subject line
      html: temp, // html body
    };
    return await transporter.sendMail(mailOptions);
  } catch (err) {
    err.status = 401;
    throw new Error(err);
  }
}

// const methods = {};

// function sendEmail(to, mailCode, variables) {
//   systemEmails.findOne({ code: mailCode }).then(template => {
//     if (!template) {
//       return '';
//     }
//     let temp = utils.unescape(template.template);
//     _.forEach(variables, element => {
//       const reg = new RegExp(`#${element.item}#`, 'g');
//       temp = temp.replace(reg, element.value);
//     });

//     // setup email data with unicode symbols
//     const mailOptions = {
//       from: utils.unescape(template.fromName), // sender addres  s
//       to, // list of receivers
//       subject: utils.unescape(template.subject), // Subject line
//       html: temp, // html body
//     };

//     // send mail with defined transport object
//     return transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log(error);
//         return '';
//       }
//       console.log('Message %s sent: %s', info.messageId, info.response);
//       return true;
//     });
//   });
// }

// methods.sendEmail = sendEmail;

// module.exports = methods;
