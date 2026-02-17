require('dotenv').config();
const { transporter } = require('./emailConfig');

const mail = {
  send: async ({ to, subject, html, text }) => {
    return transporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to,
      subject,
      html,
      text,
    });
  },
};

const config = {
  port: process.env.PORT,
  node: process.env.NODE_ENV,
  saltRound: process.env.ENCRYPTION_ROUND,
  invitepw: process.env.INVITE_PW,
  gallerypw: process.env.GALLERY_PW,
  session: process.env.SESSION_KEY,
  url: {
    api: process.env.API_URL,
    frontend: process.env.FRONTEND_URL,
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    passwd: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    connectLimit: process.env.DB_CONNECTIONLIMIT,
    queueLimit: process.env.DB_QUEUELIMIT,
  },
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    refresh: process.env.JWT_REFRESH_SECRET_KEY,
    expiration: {
      short: '2h',
      long: '30d',
    },
  },
  userInviteExpiresDays: process.env.INVITE_EXPIRES_DAYS,
  tokenExpiresHours: process.env.TOKEN_EXPIRES_HOURS,
};

module.exports = {...config, mail};
