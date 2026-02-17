const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = () => {
  /**
   * Generate access/refresh JWT tokens using the same algorithm and expiration policy as the existing auth login.
   */
  const generateTokens = (payload, autoLogin = false) => {
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: autoLogin ? config.jwt.expiration.long : config.jwt.expiration.short,
      algorithm: 'HS256',
    });

    const refreshToken = jwt.sign(payload, config.jwt.refresh, {
      expiresIn: config.jwt.expiration.long,
      algorithm: 'HS256',
    });

    return { accessToken, refreshToken };
  };

  /**
   * Authenticate gallery access with a single shared password from environment variables.
   */
  const login = async ({ password, autoLogin }) => {
    // Step 1: Ensure the gallery password is configured in environment settings.
    if (!config.gallerypw) {
      throw new Error('GALLERY_PW is not configured');
    }

    // Step 2: Compare request password with configured password.
    if (password !== config.gallerypw) {
      throw new Error('Invalid gallery password');
    }

    // Step 3: Build a dedicated JWT payload so this flow stays separate from user login.
    const payload = {
      scope: 'gallery',
      authenticated: true,
      autoLogin: Boolean(autoLogin),
    };

    // Step 4: Issue access + refresh tokens with the same signing policy as base auth.
    const token = generateTokens(payload, Boolean(autoLogin));

    return { payload, token };
  };

  /**
   * Validate gallery token context and optionally rotate tokens for periodic status checks.
   */
  const status = async (payload = {}) => {
    // Step 1: Guard against malformed tokens.
    if (payload.scope !== 'gallery') {
      throw new Error('Invalid token scope');
    }

    // Step 2: Re-issue tokens so clients can keep periodic status checks authenticated.
    const token = generateTokens(payload, Boolean(payload.autoLogin));

    return {
      authenticated: true,
      payload,
      token,
    };
  };

  return { login, status };
};
