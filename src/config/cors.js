const cors = require('cors');

/**
 * Extract a normalized hostname from a URL-like or hostname-like value.
 */
function toHostname(value) {
  if (!value) return null;

  try {
    const normalizedValue = String(value).trim();
    const parsedUrl = normalizedValue.includes('://')
      ? new URL(normalizedValue)
      : new URL(`http://${normalizedValue}`);

    return parsedUrl.hostname.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Collect hostnames from configuration values (string, array, or nested object).
 */
function collectAllowedHostnames(urlConfig) {
  const hostnames = new Set();

  /**
   * Recursively walk supported config value types and collect hostname candidates.
   */
  function pushAny(value) {
    if (!value) return;

    // Step 1: Traverse arrays.
    if (Array.isArray(value)) {
      value.forEach(pushAny);
      return;
    }

    // Step 2: Traverse nested objects.
    if (typeof value === 'object') {
      Object.values(value).forEach(pushAny);
      return;
    }

    // Step 3: Treat scalar values as hostname candidates.
    const hostname = toHostname(value);
    if (hostname) hostnames.add(hostname);
  }

  // Include explicit frontend key first for backwards compatibility.
  pushAny(urlConfig?.frontend);

  // Include every string-like value found in config.url.
  pushAny(urlConfig);

  return [...hostnames];
}

/**
 * Check whether a hostname represents localhost development addresses.
 */
function isLocalhost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

/**
 * Convert a hostname into a simple apex domain using the last two labels.
 */
function toApexDomain(hostname) {
  const parts = hostname.split('.').filter(Boolean);
  if (parts.length <= 2) return hostname;
  return parts.slice(-2).join('.');
}

/**
 * Verify whether an origin hostname can be allowed by localhost or apex-domain subdomain matching.
 */
function isAllowedBySubdomainRule(originHostname, allowedHostnames) {
  if (!originHostname) return false;
  if (isLocalhost(originHostname)) return true;

  const originApexDomain = toApexDomain(originHostname);

  return allowedHostnames.some((allowedHostname) => {
    if (!allowedHostname) return false;

    const allowedApexDomain = toApexDomain(allowedHostname);
    return originApexDomain === allowedApexDomain;
  });
}

/**
 * Build CORS options with dynamic origin validation from URL config.
 */
function createCorsOptions(urlConfig) {
  const allowedHostnames = collectAllowedHostnames(urlConfig);

  return {
    credentials: true,
    origin: (origin, callback) => {
      // Step 1: Allow requests without an Origin header (server-to-server, health checks).
      if (!origin) return callback(null, true);

      // Step 2: Parse and normalize the request origin hostname.
      let hostname = null;
      try {
        hostname = new URL(origin).hostname.toLowerCase();
      } catch {
        return callback(new Error('Not allowed by CORS'));
      }

      // Step 3: Allow if hostname matches CORS policy, otherwise reject.
      if (isAllowedBySubdomainRule(hostname, allowedHostnames)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
  };
}

/**
 * Create reusable CORS middleware and preflight middleware for app registration.
 */
function createCorsMiddleware(urlConfig) {
  const options = createCorsOptions(urlConfig);

  return {
    corsMiddleware: cors(options),
    preflightMiddleware: cors(options),
  };
}

module.exports = {
  createCorsMiddleware,
  createCorsOptions,
};
