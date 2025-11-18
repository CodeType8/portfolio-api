function invite_user(email, url, token) {
  let link = url + '/register?token=' + token;
  let email_body =
    `<div class="container" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h1 style="font-size: 24px; color: #36a3b7;">Welcome, ${email}!</h1>
      
      <p style="font-size: 16px; color: #555; line-height: 1.6;">
          We're thrilled to invite you to join!<br>
          To get started, please verify your email address by clicking the button below and setting up your account.
      </p>

      <a href="${link}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #36a3b7; text-decoration: none; border-radius: 5px; margin: 20px 0; text-align: center;" target="_blank">
          Verify Email
      </a>

      <div class="footer" style="margin-top: 20px; font-size: 14px; color: #999; text-align: center;">
          <p>If you did not make this request, please ensure your email credentials are secure.</p>
      </div>
    </div>`;

  return email_body;
}

function welcome(first_name, last_name, url) {
  let link = url + '/dashboard';
  let email_body =
    `<div class="container" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h1 style="font-size: 24px; color: #36a3b7;">Welcome to on board, ${first_name} ${last_name}!</h1>
      
      <p style="font-size: 16px; color: #555; line-height: 1.6;">
          We're excited to have you join our community!<br>
          Your journey with us starts here. Explore your dashboard to discover all the tools and resources we've prepared for you.
      </p>

      <a href="${link}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #36a3b7; text-decoration: none; border-radius: 5px; margin: 20px 0; text-align: center;" target="_blank">
          Go to Dashboard
      </a>

      <div class="footer" style="margin-top: 20px; font-size: 14px; color: #999; text-align: center;">
          <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:it@codetypeweb.com" style="color: #36a3b7; text-decoration: none;">it@codetypeweb.com</a>.</p>
      </div>
    </div>`;

  return email_body;
}


function reset_password(first_name, last_name, url, token) {
  let link = url + '/changepassword?' + 'token=' + token;
  let email_body =
    `<div class="container" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px">
      <h1 style="font-size: 24px; color: #36a3b7">Hi ${first_name} ${last_name}!</h1>

      <p style="font-size: 16px; color: #555; line-height: 1.6">
        We have received a request to <strong>reset your password</strong> for your account. To reset your password, click on the button below.
      </p>

      <a href="${link}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #36a3b7; text-decoration: none; border-radius: 5px; margin: 20px 0; text-align: center" target="_blank"> Reset Password </a>

      <div class="footer" style="margin-top: 20px; font-size: 14px; color: #999; text-align: center">
        <p>If you did not make this request, please ensure your account credentials are secure.</p>
      </div>
    </div>`

  return email_body;
}

function update_password(first_name, last_name) {
  let email_body =
    `<div class="container" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px">
      <h1 style="font-size: 24px; color: #36a3b7">Hi ${first_name} ${last_name}!</h1>
      <h2 style="color: #36a3b7">Your Password Has Been Successfully Updated</h2>

      <p>We wanted to let you know that your password has been successfully updated.</p>
      <p>If you made this change, you can disregard this email. However, if you did not request a password change, please take immediate action to secure your account:</p>
      <li>Change your password as soon as possible.</li>
      <li>Update the password for the email account associated with this account.</li>
      <p>To keep your account secure, please remember:</p>

      <li>Never share your password with anyone.</li>
      <li>Use a strong, unique password for your account.</li>

      <div class="footer" style="margin-top: 20px; font-size: 14px; color: #999; text-align: center">
        <p>If you did not make this request, please ensure your account credentials are secure.</p>
      </div>
    </div>`

  return email_body;
}

module.exports = {
  invite_user,
  welcome,
  reset_password,
  update_password
};
