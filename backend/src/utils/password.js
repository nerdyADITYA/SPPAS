const bcrypt = require('bcryptjs');

async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainPassword, salt);
}

async function comparePassword(plainPassword, hashedPasswordOrBlob) {
  if (!hashedPasswordOrBlob) return false;

  let hashStr = '';
  if (Buffer.isBuffer(hashedPasswordOrBlob)) {
    hashStr = hashedPasswordOrBlob.toString('utf8').trim();
  } else if (typeof hashedPasswordOrBlob === 'string') {
    hashStr = hashedPasswordOrBlob.trim();
  } else if (hashedPasswordOrBlob instanceof Uint8Array || Array.isArray(hashedPasswordOrBlob)) {
    hashStr = Buffer.from(hashedPasswordOrBlob).toString('utf8').trim();
  } else {
    hashStr = String(hashedPasswordOrBlob).trim();
  }

  // 1. Direct plain text match (e.g. "Admin@123")
  if (hashStr === plainPassword) return true;

  // 2. Bcrypt match
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashStr);
    if (isMatch) return true;
  } catch (error) {
    // Ignore invalid bcrypt format errors
  }

  return false;
}

module.exports = {
  hashPassword,
  comparePassword,
};
