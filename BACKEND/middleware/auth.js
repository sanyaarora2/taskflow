const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  try {

    // Extract token from Authorization header
    // Format:
    // Bearer eyhjsgdvhj...
    const token = req.headers.authorization?.split(' ')[1]

    // Check whether token exists
    if (!token) {
      return res.status(401).json({ message: 'No token, access denied' })
    }

    /*
      jwt.verify():
      1. Checks whether token is valid
      2. Decodes token data
      3. Returns payload stored during jwt.sign()
    */
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach decoded user data to request object
    // So next route/controller can access req.user
    req.user = decoded

    // Move request to next middleware/controller
    next()

  } catch (err) {

    // Invalid or expired token
    res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = authMiddleware

/*
Middleware Flow:

Frontend Request
        ↓
Auth Middleware
        ↓
1. Check token exists?
        ↓
2. Verify token using JWT_SECRET
        ↓
3. Extract user data from token
        ↓
4. Attach data to req.user
        ↓
5. next() → move to route handler
        ↓
Route Handler Executes
        ↓
Response Sent Back
*/

/*
Middleware acts like a security layer
between request and route handler.

Without valid token:
→ User cannot access protected routes

With valid token:
→ Request moves forward
*/