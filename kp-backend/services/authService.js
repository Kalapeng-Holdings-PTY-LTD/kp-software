const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getStore } = require('../store')
const {
  validatePasswordStrength,
  PASSWORD_POLICY_DESCRIPTION,
} = require('../utils/passwordPolicy')

const DEFAULT_DEV_JWT_SECRET = 'kp-dev-secret-change-in-production'

function getJwtSecret() {
  return process.env.JWT_SECRET || DEFAULT_DEV_JWT_SECRET
}

function validateAuthConfig() {
  const env = process.env.NODE_ENV || 'development'
  const secret = process.env.JWT_SECRET

  if (env !== 'production') return

  if (!secret || secret.trim().length < 32 || secret === DEFAULT_DEV_JWT_SECRET) {
    throw new Error(
      'Invalid JWT_SECRET for production. Set a strong secret with at least 32 characters.'
    )
  }
}

function sanitizeUser(user) {
  const { passwordHash, ...safe } = user
  return safe
}

async function hashPassword(password) {
  const validation = validatePasswordStrength(password)
  if (!validation.valid) {
    return {
      error: `Invalid password. ${validation.errors.join('; ')}. ${PASSWORD_POLICY_DESCRIPTION}`,
      status: 400,
    }
  }

  const passwordHash = await bcrypt.hash(password, 10)
  return { passwordHash }
}

async function login(email, password) {
  const store = await getStore()
  const user = await store.findOne('users', {
    email: email.toLowerCase().trim(),
  })

  if (!user) {
    return { error: 'Invalid email or password', status: 401 }
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return { error: 'Invalid email or password', status: 401 }
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    getJwtSecret(),
    { expiresIn: '24h' }
  )

  return { token, user: sanitizeUser(user) }
}

function verifyToken(token) {
  try {
    return jwt.verify(token, getJwtSecret())
  } catch {
    return null
  }
}

module.exports = {
  login,
  verifyToken,
  sanitizeUser,
  getJwtSecret,
  validateAuthConfig,
  hashPassword,
}
