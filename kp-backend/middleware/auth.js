const { verifyToken, sanitizeUser } = require('../services/authService')
const { getStore } = require('../store')

const AUTH_HEADER_PREFIX = 'Bearer '
const AUTH_REQUIRED_ERROR = 'Authentication required'
const INVALID_TOKEN_ERROR = 'Invalid or expired token'
const INSUFFICIENT_PERMISSIONS_ERROR = 'Insufficient permissions'

function extractBearerToken(header) {
  if (!header?.startsWith(AUTH_HEADER_PREFIX)) {
    return null
  }

  return header.slice(AUTH_HEADER_PREFIX.length)
}

async function loadAuthenticatedUser(token) {
  const payload = verifyToken(token)
  if (!payload) {
    return null
  }

  const store = await getStore()
  const user = await store.findById('users', payload.userId)
  if (!user) {
    return null
  }

  return sanitizeUser(user)
}

async function authenticate(req, res, next) {
  const token = extractBearerToken(req.headers.authorization)
  if (!token) {
    return res.status(401).json({ error: AUTH_REQUIRED_ERROR })
  }

  const user = await loadAuthenticatedUser(token)
  if (!user) {
    return res.status(401).json({ error: INVALID_TOKEN_ERROR })
  }

  req.user = user
  next()
}

function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: AUTH_REQUIRED_ERROR })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: INSUFFICIENT_PERMISSIONS_ERROR })
    }
    next()
  }
}

async function optionalAuth(req, res, next) {
  const token = extractBearerToken(req.headers.authorization)
  if (!token) {
    return next()
  }

  try {
    const user = await loadAuthenticatedUser(token)
    if (user) {
      req.user = user
    }
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = { authenticate, requireRoles, optionalAuth }
