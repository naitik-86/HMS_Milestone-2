import API from "../../../shared/api/axios";

export async function fetchSuperAdminBasicReports() {
  const res = await API.get("/super-admin-reports/basic");
  // Backend returns: { success: true, data: { totalClinics, totalPaymentCollected } }
  return res?.data?.data || res?.data || {};
}

