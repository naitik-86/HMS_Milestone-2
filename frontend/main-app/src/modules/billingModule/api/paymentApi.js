
import API from "../../../shared/api/axios";

export const createSubscriptionPayment = async (payload) => {
    try {
        const { data } = await API.post(
            "/subscription/create-subscription",
            payload
        );

        return data;
    } catch (error) {
        throw error;
    }
};


export const getSubscriptionDetails = async (clinicId) => {
    const response = await API.get(`/subscription/${clinicId}`);
    return response.data.data;
}

