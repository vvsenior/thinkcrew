import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'

import logger from './logger.js'

type Props = {
  to: string;
  subject: string;
  template: string;
  context: {[x: string]: string};
}

const transport = {
  host: process.env.EMAIL_HOST,
  port: process.env.NODE_ENV === 'production' ? 465 : 2525, // mailtrap.io use 2525
  secure: process.env.NODE_ENV === 'production' ? true : false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
}
const transporter = nodemailer.createTransport(transport)
transporter.use('compile', hbs({ viewEngine: { extname: '.hbs', defaultLayout: false  }, viewPath: './src/email', extName: '.hbs' }))

export function sendMail({ to, subject, template, context }: Props) {
  const mail = { 
    from: '"Think Crew" info@thinkcrew.com', 
    to, 
    subject, 
    template: `${template}.html`,
    text_template: `${template}.text`,
    context
  }
  transporter.sendMail(mail, (err, info) => {
    if(err) logger.error(`Email to ${to} failed to send. Subject: ${subject}, Error: ${err}`)
  })
}