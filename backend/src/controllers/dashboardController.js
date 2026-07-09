const { DASHBOARD, ROLE_IDS } = require('../config/roleDashboards');

// Centralized dashboard redirect.
// Backend returns an API response (no 302). Frontend decides navigation.
exports.getDashboardRedirect = async (req, res) => {
  const authUser = req.user || {};

  // Unique id for the login id concept.
  // - For staff login via JWT: req.user.id is Mongo _id of User
  // - For super admin login via JWT: req.user.id is SuperAdmin _id
  const loginId = authUser.id || null;

  // 🔹 FIX: Normalize the role string from the JWT to match our constants
  // Converts "Clinic Admin" to "CLINIC_ADMIN", "super admin" to "SUPER_ADMIN", etc.
  const rawRole = authUser.role ? authUser.role.toUpperCase().replace(/\s+/g, '_') : '';

  let normalizedRoleKey = null;

  if (rawRole === 'SUPER_ADMIN') normalizedRoleKey = 'SUPER_ADMIN';
  else if (rawRole === 'CLINIC_ADMIN') normalizedRoleKey = 'CLINIC_ADMIN';
  else if (rawRole === 'RECEPTIONIST') normalizedRoleKey = 'RECEPTIONIST';
  else if (rawRole === 'DOCTOR') normalizedRoleKey = 'DOCTOR';
  else if (rawRole === 'PARA_MEDICAL') {
    const as = (req.query?.as || '').toLowerCase();
    if (as.includes('lab')) normalizedRoleKey = 'LAB_TECHNICIAN';
    else normalizedRoleKey = 'PRE_CONSULTATION';
  }
  
  if (!normalizedRoleKey) {
    return res.status(403).json({
      success: false,
      message: 'Role not supported for dashboard',
      role: authUser.role // Keeping the original string here helps with debugging if something fails
    });
  }

  const redirectUrl = DASHBOARD[normalizedRoleKey];
  const roleId = ROLE_IDS[normalizedRoleKey];

  return res.status(200).json({
    success: true,
    data: {
      loginId,
      roleKey: normalizedRoleKey,
      roleId,
      redirectUrl
    }
  });
};