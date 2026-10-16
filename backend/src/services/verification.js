
const crypto = require('crypto');

function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

function hashVerificationToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function getVerificationExpiry() {
  return new Date(Date.now() + 30 * 60 * 1000);
}

module.exports = {
  generateVerificationToken,
  hashVerificationToken,
  getVerificationExpiry,
};
