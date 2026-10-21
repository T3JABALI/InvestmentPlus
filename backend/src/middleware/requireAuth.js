
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authorization = req.headers.authorization || '';
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'Authentication required.',
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'investmentplus-api',
      audience: 'investmentplus-web',
    });

    if (!payload.sub || !['member', 'admin'].includes(payload.role)) {
      return res.status(401).json({
        error: 'Invalid authentication token.',
      });
    }

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch {
    return res.status(401).json({
      error: 'Invalid or expired authentication token.',
    });
  }
}

module.exports = { requireAuth };
