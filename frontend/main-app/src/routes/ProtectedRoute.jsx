import { Navigate, useLocation } from "react-router-dom";
import API from "../shared/api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { normalizeRole } from "../shared/utils/roleRedirects";
import TrialPaymentModal from "../modules/billingModule/components/TrialPaymentModal";
import { getSubscriptionStatus } from "../modules/clinicadmin/api/subscriptionApi"


const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    const token = localStorage.getItem("token");
    const rawRole = localStorage.getItem("role");
    const navigate = useNavigate();
    const normalizedRole = normalizeRole(rawRole) || null;
    const [loading, setLoading] = useState(true);
    const [subscriptionData, setSubscriptionData] = useState(null);
    const [remainingTrialDays, setRemainingTrialDays] = useState(0);
    const [showTrialPopup, setShowTrialPopup] = useState(false);

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

                console.log("STATUS API");
                console.log(data);


                setSubscriptionData(data);
                setRemainingTrialDays(data.remainingTrialDays);

                const shouldShowPopup =
                    location.state?.forceTrialPopup ||
                    !sessionStorage.getItem("trial-popup");

                if (
                    data.subscription.status === "TRIAL" &&
                    shouldShowPopup
                ) {
                    setShowTrialPopup(true);

                    sessionStorage.setItem("trial-popup", "true");
                }

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


    if (normalizedRole === "CLINIC_ADMIN" && subscriptionData) {

        const clinic = subscriptionData.data;
        const subscription = subscriptionData.subscription;

        // Allow access during trial or active subscription
        if (
            subscription.status === "TRIAL" ||
            subscription.status === "ACTIVE"
        ) {
            if (showTrialPopup) {
                return (
                    <TrialPaymentModal
                        open={true}
                        onClose={() => setShowTrialPopup(false)}
                        remainingTrialDays={remainingTrialDays}
                        clinicId={clinic._id}
                        email={clinic.contactEmail}
                    />
                );
            }

            return children;
        }

        // Redirect when payment is required or subscription expired
        if (
            subscription.status === "PAYMENT_REQUIRED" ||
            subscription.status === "EXPIRED"
        ) {
            return (
                <Navigate
                    to="/payment"
                    replace
                    state={{
                        clinicId: clinic._id,
                        email: clinic.contactEmail,
                    }}
                />
            );
        }
    }

    return children;
};

export default ProtectedRoute;
