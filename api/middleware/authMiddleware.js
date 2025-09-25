const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // 1. Get the token from the request header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format is "Bearer TOKEN"

  // 2. If no token is provided, block the request
  if (token == null) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // 3. Verify the token is valid
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token is not valid' });
    }

    // 4. If token is valid, attach the user payload to the request and continue
    req.user = user; // This attaches { userId, tenantId, role } to the request
    next(); // This calls the next function (our actual API endpoint)
  });
}

module.exports = authMiddleware;