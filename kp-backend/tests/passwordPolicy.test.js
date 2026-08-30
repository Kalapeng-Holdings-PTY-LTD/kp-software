const {
  validatePasswordStrength,
  PASSWORD_POLICY_DESCRIPTION,
} = require('../utils/passwordPolicy')
const { hashPassword } = require('../services/authService')

describe('password policy', () => {
  it('accepts a strong password', () => {
    const result = validatePasswordStrength('VeryStrong!123')
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejects short passwords', () => {
    const result = validatePasswordStrength('S!1ab')
    expect(result.valid).toBe(false)
    expect(result.errors.join('; ')).toMatch(/at least/i)
  })

  it('rejects passwords without uppercase letters', () => {
    const result = validatePasswordStrength('lowercase!123')
    expect(result.valid).toBe(false)
    expect(result.errors.join('; ')).toMatch(/uppercase/i)
  })

  it('rejects passwords without numbers', () => {
    const result = validatePasswordStrength('NoNumbers!Here')
    expect(result.valid).toBe(false)
    expect(result.errors.join('; ')).toMatch(/number/i)
  })

  it('hashPassword returns a validation error for weak passwords', async () => {
    const result = await hashPassword('weakpass')
    expect(result.error).toMatch(/invalid password/i)
    expect(result.error).toContain(PASSWORD_POLICY_DESCRIPTION)
  })

  it('hashPassword returns password hash for strong passwords', async () => {
    const result = await hashPassword('VeryStrong!123')
    expect(result.passwordHash).toBeDefined()
  })
})
