// Central mapping for dashboard access.
// Frontend should call GET /api/v1/dashboard with JWT and then navigate using redirectUrl.

const DASHBOARD = {
  SUPER_ADMIN: '/super-admin/dashboard',
  CLINIC_ADMIN: '/clinic-admin/dashboard',
  RECEPTIONIST: '/receptionist/dashboard',
  PRE_CONSULTATION: '/pre-consultation/dashboard',
  DOCTOR: '/doctor/dashboard',
  LAB_TECHNICIAN: '/lab-technician/dashboard',
  OWNER: '/owner/dashboard'
};

// roleId mapping concept: each role gets a unique stable id.
// These IDs are returned as part of the API response for frontend usage/logging.
const ROLE_IDS = {
  SUPER_ADMIN: 'role_super_admin_001',
  CLINIC_ADMIN: 'role_clinic_admin_002',
  RECEPTIONIST: 'role_receptionist_003',
  OWNER: 'role_owner_004',
  DOCTOR: 'role_doctor_005',
  PRE_CONSULTATION: 'role_pre_consultation_006',
  LAB_TECHNICIAN: 'role_lab_technician_007'
};

// Requested UI roles -> backend JWT roles.
// Your backend currently uses: SUPER_ADMIN, CLINIC_ADMIN, DOCTOR, PARA_MEDICAL, RECEPTIONIST.
// We map:
// - PARA_MEDICAL -> PRE_CONSULTATION (as requested)
// - PARA_MEDICAL -> LAB_TECHNICIAN (as requested) via heuristics/override key (see controller)
//
// If you later introduce explicit JWT roles OWNER / PRE_CONSULTATION / LAB_TECHNICIAN, update this mapping.
const REQUESTED_ROLE_KEYS = {
  'super admin': 'SUPER_ADMIN',
  'clinic admin': 'CLINIC_ADMIN',
  receptionist: 'RECEPTIONIST',
  'pet owner': 'OWNER',
  doctor: 'DOCTOR',
  'pre-consultation': 'PRE_CONSULTATION',
  'pre consultation': 'PRE_CONSULTATION',
  'lab - technician': 'LAB_TECHNICIAN',
  'lab technician': 'LAB_TECHNICIAN'
};

module.exports = {
  DASHBOARD,
  ROLE_IDS,
  REQUESTED_ROLE_KEYS
};

