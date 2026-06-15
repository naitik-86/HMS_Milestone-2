const { DASHBOARD, ROLE_IDS } = require('../config/roleDashboards');

// Centralized dashboard redirect.
// Backend returns an API response (no 302). Frontend decides navigation.
exports.getDashboardRedirect = async (req, res) => {
  const authUser = req.user || {};

  // Unique id for the login id concept.
  // - For staff login via JWT: req.user.id is Mongo _id of User
  // - For super admin login via JWT: req.user.id is SuperAdmin _id
  const loginId = authUser.id || null;

  // Backend roles currently used in JWT: SUPER_ADMIN, CLINIC_ADMIN, DOCTOR, PARA_MEDICAL, RECEPTIONIST
  // Your requested UI roles map as follows:
  // - PARA_MEDICAL => PRE_CONSULTATION (default)
  // - PARA_MEDICAL => LAB_TECHNICIAN when client passes ?as=lab-technician
  let normalizedRoleKey = null;

  if (authUser.role === 'SUPER_ADMIN') normalizedRoleKey = 'SUPER_ADMIN';
  else if (authUser.role === 'CLINIC_ADMIN') normalizedRoleKey = 'CLINIC_ADMIN';
  else if (authUser.role === 'RECEPTIONIST') normalizedRoleKey = 'RECEPTIONIST';
  else if (authUser.role === 'DOCTOR') normalizedRoleKey = 'DOCTOR';
  else if (authUser.role === 'PARA_MEDICAL') {
    const as = (req.query?.as || '').toLowerCase();
    if (as.includes('lab')) normalizedRoleKey = 'LAB_TECHNICIAN';
    else normalizedRoleKey = 'PRE_CONSULTATION';
  }

  if (!normalizedRoleKey) {
    return res.status(403).json({
      success: false,
      message: 'Role not supported for dashboard',
      role: authUser.role
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

