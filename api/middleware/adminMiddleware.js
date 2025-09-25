// /api/middleware/adminMiddleware.js
function adminMiddleware(req, res, next) {
  // This middleware should run AFTER authMiddleware,
  // so we will have access to req.user.
  if (req.user && req.user.role === 'ADMIN') {
    next(); // User is an admin, so we continue to the actual endpoint
  } else {
    // If user is not an admin, block them with a Forbidden error
    res.status(403).json({ message: 'Forbidden: This action requires admin privileges.' });
  }
}

module.exports = adminMiddleware;