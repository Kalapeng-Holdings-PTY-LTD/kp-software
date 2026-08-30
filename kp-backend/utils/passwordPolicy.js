const MIN_PASSWORD_LENGTH = 6
const PASSWORD_POLICY_DESCRIPTION =
  'Password must be at least 6 characters and include uppercase, lowercase, number, and special character.'

function validatePasswordStrength(password) {
  const errors = []

  if (typeof password !== 'string' || password.length === 0) {
    errors.push('password is required')
    return { valid: false, errors }
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`password must be at least ${MIN_PASSWORD_LENGTH} characters`)
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('password must include at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('password must include at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('password must include at least one number')
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('password must include at least one special character')
  }

  return { valid: errors.length === 0, errors }
}

module.exports = {
  MIN_PASSWORD_LENGTH,
  PASSWORD_POLICY_DESCRIPTION,
  validatePasswordStrength,
}
