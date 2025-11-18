const { mail, url } = require('../config/config');

/**
* @param {string} toEmail
* @param {string} token
* @param {int} role_id
*/

exports.sendInvitationEmail = async (toEmail, token) => {
  const link = `${url.frontend}/register?token=${encodeURIComponent(token)}`;
  const subject = `You’ve Been Invited to Join Franchise Vortex`;
  const html = 
    `<p>You’ve been invited to join Franchise Vortex.</b></p>
    <p>To accept the invitation and set up your account, please click the button below:
    <p></p>
    <p><a href="${link}">${link}</a></p>
    <p></p>
    <p>If you were not expecting this invitation, you can safely ignore this email.</p>
    <p>Your account will not be activated unless you complete the registration process.</p>
    <p></p>
    <p>We look forward to having you on board.</p>
    <p></p>
    <p>Best regards,</p>
    <p>The Franchise Vortex Team</p>`;
  await mail.send({ to: toEmail, subject, html });
};

exports.sendWelcomeEmail = async (toEmail, first_name, last_name) => {
  const link = `${url.frontend}/login`;
  const subject = `Welcome to Franchise Vortex`;
  const html = `
    <p>Hello ${first_name} ${last_name},</p>
    <p>Welcome to Franchise Vortex! your account has been successfully created.</p>
    <p>You can now log in and start managing your brand and branches, access real-time inventory, and collaborate with your team seamlessly.</p>
    <p></p>
    <p><a href="${link}">Go to Login</a></p>
    <p></p>
    <p>If you need help getting started, our support team is always ready to assist you.</p>
    <p>Thank you for joining us, and welcome to the Franchise Vortex community!</p>
    <p></p>
    <p>Warm regards</p>
    <p>The Franchise Vortex Team</p>`;
  await mail.send({ to: toEmail, subject, html });
};

exports.sendForgotPasswordEmail = async (toEmail, token, first_name, last_name) => {
  const link = `${url.frontend}/changepassword?token=${encodeURIComponent(token)}`;
  const subject = `Reset Your Password`;
  const html = `
    <p>Hello ${first_name} ${last_name},</p>
    <p>We received a request to reset your password for your account on Franchise Vortex.</p>
    <p>If you made this request, please click the button below to set a new password.</p>
    <p />
    <p><a href="${link}">${link}</a></p>
    <p />
    <p>If you didn’t request a password reset, please ignore this email.</p>
    <p>Your password will remain unchanged.</p>
    <p />
    <p>Thank you,</p>
    <p>The Franchise Vortex Team</p>`;
  await mail.send({ to: toEmail, subject, html });
};

exports.sendPasswordChangedEmail = async (toEmail, first_name, last_name) => {
  const link = `${url.frontend}/login`;
  const subject = `Your Password Has Been Changed`;
  const html = `
    <p>Hello ${first_name} ${last_name},</p>
    <p>This is a confirmation that your password for Franchise Vortex has been successfully changed.</p>
    <p />
    <p><a href="${link}">Go to Login</a></p>
    <p />
    <p>If you did not make this change, please contact our support team immediately.</p>
    <p />
    <p>Thank you for keeping your account secure.</p>
    <p />
    <p>The Franchise Vortex Team</p>`;
  await mail.send({ to: toEmail, subject, html });
};