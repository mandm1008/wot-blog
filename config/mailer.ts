import nodeMailer, { SendMailOptions } from 'nodemailer'
import CryptoJS from 'crypto-js'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { server, EmailLayout } from './constants'

export interface EmailData {
  toUser: Models.User
  hash: CryptoJS.lib.CipherParams
}

const from = `WoT Team < ${process.env.MAIL_USERNAME} >`

async function sendMail(message: SendMailOptions) {
  const Email = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  } as SMTPTransport.Options)

  try {
    return await Email.sendMail(message)
  } catch (e) {
    return e
  }
}

export const sendConfirmationEmail = ({ toUser, hash }: EmailData) => {
  const message: SendMailOptions = {
    from,
    to: toUser.email,
    subject: 'WoT Blog - Activate Account',
    html: EmailLayout(`
    <h3 style="font-size: 24px; margin: 4px 0; color: #000;">Hello ${toUser.name},</h3>
    <p>Thank you for registering into our Application. Much Appreciated! Just one last step is laying ahead of you...</p>
    <p>To activate your account please follow this link: 
      <a
        target="_" href="${server}/activate/${encodeURIComponent(hash.toString())}"
        style="color: #1a0dab; opacity: 0.8; transition: opacity 0.2s ease; border-bottom: 2px dashed currentColor; text-decoration: none;"
      >
        Activate Account Link
      </a>
    </p>
      <p>Cheers,</p>
      <i style="color: #000; font-weight: 600;">WoT Blog Team</i>
      <p style="font-size: 12px; text-align: right; margin: 12px 0 0 0;">
        <b>Do not share this link with anyone!</b>
      </p>
      <p style="font-size: 12px; text-align: right; margin: 0;">For security reasons, the link will expire after 1 hour.</p>
    `)
  }

  return sendMail(message)
}

export const sendResetPasswordEmail = ({ toUser, hash }: EmailData) => {
  const message: SendMailOptions = {
    from,
    to: toUser.email,
    subject: 'WoT Blog - Reset Password',
    html: EmailLayout(`
    <h3 style="font-size: 24px; margin: 4px 0; color: #000;">Hello ${toUser.name},</h3>
    <p>To reset your password please follow this link: 
      <a
        target="_"
        href="${server}/reset-password/${encodeURIComponent(hash.toString())}"
        style="color: #1a0dab; opacity: 0.8; transition: opacity 0.2s ease; border-bottom: 2px dashed currentColor; text-decoration: none;"
      >
        Reset Password Link
      </a>
    </p>
    <p>Cheers,</p>
    <i style="color: #000; font-weight: 600;">WoT Blog Team</i>
    <p style="font-size: 12px; text-align: right; margin: 12px 0 0 0;">
      <b>Do not share this link with anyone!</b>
    </p>
    <p style="font-size: 12px; text-align: right; margin: 0;">For security reasons, the link will expire after 10 minutes.</p>
    `)
  }

  return sendMail(message)
}

export const sendNotificationEmail = ({
  subject,
  content,
  users = []
}: {
  subject: string
  content: string
  users: Models.User[]
}) => {
  const message: SendMailOptions = {
    from,
    to: users.join(', '),
    subject,
    html: EmailLayout(content)
  }

  return sendMail(message)
}
