const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const config = require('../config/config');
const { randomToken } = require('../utils/cryptoUtil');
const { sendForgotPasswordEmail, sendPasswordChangedEmail } = require('../utils/emailUtil');

module.exports = ({ models, sequelize }) => {
  const { User, PasswordResetTokens } = models;

  /*=============================================
  ||=============== Basic Auth ================||
  =============================================*/
  const generateTokens = (payload, autoLogin = false) => {
    const accessToken = jwt.sign(payload, config.jwt.secret, { expiresIn: autoLogin ? config.jwt.expiration.long : config.jwt.expiration.short, algorithm: 'HS256' });
    const refreshToken = jwt.sign(payload, config.jwt.refresh, { expiresIn: config.jwt.expiration.long, algorithm: 'HS256' });

    return { accessToken, refreshToken };
  };

  //login
  const login = async ({ email, password, autoLogin }) => {
    //find user
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('User not exist');

    //password not match
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new Error('password not match');

    const payload = { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, status: user.status, autoLogin }
    const token = generateTokens(payload, autoLogin)

    return { payload, token };
  };

  //log out
  const logoutPayload = () => ({ message: 'Logged out' }); // stateless JWT; client should delete cookie/local token

  //check current user status
  const me = async (userId, autoLogin) => {
    const user = await User.findByPk(userId, { attributes: ['id', 'email', 'first_name', 'last_name', 'status'], });
    if (!user) return null;

    const payload = { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, status: user.status, autoLogin }
    const { accessToken, refreshToken } = generateTokens(payload, autoLogin);

    return { user: user, accessToken, refreshToken };
  };

  /*=============================================
  ||================ Password =================||
  =============================================*/
  const forgotPassword = async (email) => {
    //find user
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('User not exist');

    // generate token with expiration date
    const token = randomToken(24);
    const expiresAt = new Date();
    const additionalDays = config.tokenExpiresHours || 2;  //expires in 2 hours
    expiresAt.setTime(expiresAt.getTime() + (additionalDays * 60 * 60 * 1000));

    // token creation
    const row = await PasswordResetTokens.create({
      email,
      token,
      expires_at: expiresAt,
      status: 'pending',
    });

    // password reset email transaction
    await sendForgotPasswordEmail(email, token, user.first_name, user.last_name);
    return row;
  };


  // check master brand-owner invitation
  const checkResetPasswordToken = async (token) => {
    // find valid invitation - token exist, expiration, not used
    const now = new Date();
    const reset = await PasswordResetTokens.findOne({ where: { token, status: 'pending', expires_at: { [Op.gt]: now } } });

    // error - token not exist, invalid token
    if (!reset) throw new Error('Invalid or expired token');

    return reset;
  };


  const changePassword = async ({ token, password }) => {
    // check invatiion validation
    const now = new Date();
    const reset = await PasswordResetTokens.findOne({ where: { token, status: 'pending', expires_at: { [Op.gt]: now } } });

    // error - expired or invalid token
    if (!reset) throw new Error('Invalid or expired token');

    // user create transation begin
    return await sequelize.transaction(async (t) => {
      // Check for an existing user with the same email.
      const user = await User.findOne({ where: { email: reset.email }, transaction: t });

      //user not exist
      if (!user) throw new Error('User not exist');


      // if user exist, no need to create user
      const passwordHash = await bcrypt.hash(password, Number(config.saltRound));

      // user password update.
      await user.update({ password_hash: passwordHash }, { transaction: t });

      // token update to used.
      await reset.update({ status: 'used', used_at: new Date() }, { transaction: t });

      await sendPasswordChangedEmail(user.email, user.first_name, user.last_name);

      return { user };
    });
  };

  return { login, logoutPayload, me, forgotPassword, checkResetPasswordToken, changePassword };
};