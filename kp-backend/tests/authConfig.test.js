const { validateAuthConfig } = require('../services/authService')

describe('auth config validation', () => {
  const originalNodeEnv = process.env.NODE_ENV
  const originalJwtSecret = process.env.JWT_SECRET

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv
    process.env.JWT_SECRET = originalJwtSecret
  })

  it('throws in production when JWT_SECRET is missing', () => {
    process.env.NODE_ENV = 'production'
    delete process.env.JWT_SECRET
    expect(() => validateAuthConfig()).toThrow(/JWT_SECRET/i)
  })

  it('throws in production when JWT_SECRET is too short', () => {
    process.env.NODE_ENV = 'production'
    process.env.JWT_SECRET = 'short-secret'
    expect(() => validateAuthConfig()).toThrow(/JWT_SECRET/i)
  })

  it('does not throw in production with a strong JWT secret', () => {
    process.env.NODE_ENV = 'production'
    process.env.JWT_SECRET = 'this-is-a-long-production-secret-value-123'
    expect(() => validateAuthConfig()).not.toThrow()
  })
})
