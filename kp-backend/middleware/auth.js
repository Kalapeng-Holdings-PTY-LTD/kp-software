 const { verifyToken, sanitizeUser } = require('../services/authService')
 const { getStore } = require('../store')
 
+const AUTH_HEADER_PREFIX = 'Bearer '
+const AUTH_REQUIRED_ERROR = 'Authentication required'
+const INVALID_TOKEN_ERROR = 'Invalid or expired token'
+const USER_NOT_FOUND_ERROR = 'User not found'
+const INSUFFICIENT_PERMISSIONS_ERROR = 'Insufficient permissions'
+
+function extractBearerToken(header) {
+  if (!header?.startsWith(AUTH_HEADER_PREFIX)) {
+    return null
+  }
+
+  return header.slice(AUTH_HEADER_PREFIX.length)
+}
+
+async function loadAuthenticatedUser(token) {
+  const payload = verifyToken(token)
+  if (!payload) {
+    return null
+  }
+
+  const store = await getStore()
+  const user = await store.findById('users', payload.userId)
+  if (!user) {
+    return null
+  }
+
+  return sanitizeUser(user)
+}
+
 async function authenticate(req, res, next) {
-  const header = req.headers.authorization
-  if (!header?.startsWith('Bearer ')) {
-    return res.status(401).json({ error: 'Authentication required' })
+  const token = extractBearerToken(req.headers.authorization)
+  if (!token) {
+    return res.status(401).json({ error: AUTH_REQUIRED_ERROR })
   }
 
-  const payload = verifyToken(header.slice(7))
-  if (!payload) {
-    return res.status(401).json({ error: 'Invalid or expired token' })
+  const user = await loadAuthenticatedUser(token)
+  if (!user) {
+    return res.status(401).json({ error: INVALID_TOKEN_ERROR })
   }
 
-  const store = await getStore()
-  const user = await store.findById('users', payload.userId)
-  if (!user) {
-    return res.status(401).json({ error: 'User not found' })
-  }
-
-  req.user = sanitizeUser(user)
+  req.user = user
   next()
 }
 
+/**
+ * Creates middleware that allows only users with one of the listed roles.
+ * This assumes authenticate() or optionalAuth() has already run.
+ */
 function requireRoles(...roles) {
   return (req, res, next) => {
     if (!req.user) {
-      return res.status(401).json({ error: 'Authentication required' })
+      return res.status(401).json({ error: AUTH_REQUIRED_ERROR })
     }
     if (!roles.includes(req.user.role)) {
-      return res.status(403).json({ error: 'Insufficient permissions' })
+      return res.status(403).json({ error: INSUFFICIENT_PERMISSIONS_ERROR })
     }
     next()
   }
 }
 
-function optionalAuth(req, res, next) {
-  const header = req.headers.authorization
-  if (!header?.startsWith('Bearer ')) {
+/**
+ * Tries to identify the current user if a valid Bearer token is present.
+ * If no token is provided or the token is invalid, the request continues.
+ */
+async function optionalAuth(req, res, next) {
+  const token = extractBearerToken(req.headers.authorization)
+  if (!token) {
     return next()
   }
 
-  const payload = verifyToken(header.slice(7))
-  if (!payload) return next()
-
-  getStore()
-    .then((store) => store.findById('users', payload.userId))
-    .then((user) => {
-      if (user) req.user = sanitizeUser(user)
-      next()
-    })
-    .catch(next)
+  try {
+    const user = await loadAuthenticatedUser(token)
+    if (user) {
+      req.user = user
+    }
+    next()
+  } catch (error) {
+    next(error)
+  }
 }
 
 module.exports = { authenticate, requireRoles, optionalAuth }function optionalAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return next()
  }

  const payload = verifyToken(header.slice(7))
  if (!payload) return next()

  getStore()
    .then((store) => store.findById('users', payload.userId))
    .then((user) => {
      if (user) req.user = sanitizeUser(user)
      next()
    })
    .catch(next)
}

module.exports = { authenticate, requireRoles, optionalAuth }
