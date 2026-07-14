import { Navigate, useLocation } from "react-router-dom";
import API from "../shared/api/axios";
import { useEffect, useState } from "react";
import { normalizeRole } from "../shared/utils/roleRedirects";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    const token = localStorage.getItem("token");
    const rawRole = localStorage.getItem("role");

    const normalizedRole = normalizeRole(rawRole) || null;
    const [loading, setLoading] = useState(true);
    const [subscriptionData, setSubscriptionData] = useState(null);

    useEffect(() => {
        const checkSubscription = async () => {

            if (!token) {
                setLoading(false);
                return;
            }

            if (normalizedRole !== "CLINIC_ADMIN") {
                setLoading(false);
                return;
            }

            try {
                const { data } = await API.get("/clinic/subscription/status");

                console.log(data);


                setSubscriptionData(data.data);

            } catch (err) {
                console.error(err);

                localStorage.clear();
                sessionStorage.clear();

                return <Navigate to="/login" replace />;
            } finally {
                setLoading(false);
            }
        };

        checkSubscription();
    }, [token, normalizedRole]);

    if (loading) {
        return <div>Loading...</div>;
    }
    if (!token) {
        // location state bhej kar history ko strongly replace kar rahe hain
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(normalizedRole)) {
        return <Navigate to="/unauthorized" replace />;
    }


    if (
        normalizedRole === "CLINIC_ADMIN" &&
        subscriptionData &&
        subscriptionData.subscriptionStatus !== "ACTIVE"
    ) {
        return (
            <Navigate
                to="/payment"
                replace
                state={{
                    clinicId: subscriptionData._id,
                    email: subscriptionData.contactEmail,
                }}
            />
        );
    }

    return children;
};

export default ProtectedRoute;
