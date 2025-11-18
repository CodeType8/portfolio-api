const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { randomToken } = require('../utils/cryptoUtil');
const { sendInvitationEmail, sendWelcomeEmail } = require('../utils/emailUtil');
const { userInviteExpiresDays, saltRound } = require('../config/config');

module.exports = ({ models, sequelize }) => {
  const { InvitationToken, User } = models;

  // check master brand-owner invitation
  const checkInvitation = async (token) => {
    // find valid invitation - token exist, expiration, not used
    const now = new Date();
    const inv = await InvitationToken.findOne({ where: { token, status: 'pending', expires_at: { [Op.gt]: now } } });

    // error - token not exist, invalid token
    if (!inv) throw new Error('Invalid or expired token');

    //if exist user will also return user info
    const existingUser = await User.findOne({ where: { email: inv.email }, attributes: { exclude: ['password_hash'] } });

    return { inv, existingUser };
  };

  // Invite brand_admin or branch_manager by an authenticated brand_owner/admin
  const inviteMember = async ({ email }, inviterUserId) => {
    // Check user Role already exist
    const existUserWithRole = await User.findOne({ where: { email }, attributes: ['id'] });
    if (existUserWithRole) throw new Error('User already exist');

    // check invitation already exist, then destory
    await InvitationToken.destroy({ where: { email, status: 'pending' } });

    // generate token with expiration date
    const token = randomToken(24);
    const expiresAt = new Date();
    const additionalDays = userInviteExpiresDays || 2;
    expiresAt.setTime(expiresAt.getTime() + (additionalDays * 24 * 60 * 60 * 1000));

    // create invitation token
    const row = await InvitationToken.create({
      email,
      token,
      expires_at: expiresAt,
      created_by: inviterUserId,
      status: 'pending',
      meta: { type: 'member_invite', inviterUserId }
    });

    // invitation email transaction
    await sendInvitationEmail(email, token);
    return row;
  };

  // Accept member invite: creates user and links role to existing brand/branch
  const acceptMemberInvite = async ({ token, userPayload }) => {
    // check invatiion validation
    const now = new Date();
    const inv = await InvitationToken.findOne({ where: { token, status: 'pending', expires_at: { [Op.gt]: now } } });

    // error - expired or invalid token
    if (!inv) throw new Error('Invalid or expired token');

    // user create transation begin
    return await sequelize.transaction(async (t) => {

      let user;

      // Check for an existing user with the same email.
      const existingUser = await User.findOne({ where: { email: inv.email }, attributes: { exclude: ['password_hash'] }, transaction: t });

      // if user exist, no need to create user
      if (existingUser) {
        user = existingUser
      }
      // user creation
      else {
        const passwordHash = await bcrypt.hash(userPayload.password, Number(saltRound));
        user = await User.create({
          email: inv.email,
          first_name: userPayload.first_name || null,
          last_name: userPayload.last_name || null,
          phone_number: userPayload.phone_number || null,
          password_hash: passwordHash,
          status: 'verified'
        }, { transaction: t });
      }

      // token update to used.
      await inv.update({ status: 'used', used_at: new Date() }, { transaction: t });
      // Welcome email
      await sendWelcomeEmail(inv.email, userPayload.first_name, userPayload.last_name);

      return { user };
    });
  };

  return { checkInvitation, inviteMember, acceptMemberInvite };
}