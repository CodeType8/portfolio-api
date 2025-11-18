// simple RBAC check helper
module.exports = function requireRole(allowed) {
  return (req, res, next) => {
    const roles = req.user?.roles || [];
    const ok = roles.some(r => allowed.includes(r));
    if (!ok) return res.status(403).json({ success: false, message: 'Forbidden' });
    next();
  };
};