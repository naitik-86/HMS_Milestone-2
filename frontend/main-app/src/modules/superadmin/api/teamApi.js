import API from "../../../shared/api/axios";

export const getSuperAdminTeam = async () => {
    const res = await API.get("/super-admin/team");
    return res.data;
};

export const createSuperAdminTeamMember = async (payload) => {
    const res = await API.post("/super-admin/team", payload);
    return res.data;
};

export const deleteSuperAdminTeamMember = async (id) => {
    const res = await API.delete(`/super-admin/team/${id}`);
    return res.data;
};
