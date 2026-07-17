

import { useEffect, useState } from "react";
import {
    getCurrentSubscription,
    getAllPlans,
} from "../../api/subscriptionApi";

import CurrentSubscriptionCard from "./CurrentSubscriptionCard";
import SubscriptionStats from "./SubscriptionStats";
import PlanCarousel from "./PlanCarousel";

function PrePaidSubscription() {
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [subscriptionRes, plansRes] = await Promise.all([
                getCurrentSubscription(),
                getAllPlans(),
            ]);

            console.log(subscriptionRes);
            console.log(plansRes);

            setCurrentSubscription(subscriptionRes.data);
            setPlans(plansRes.data);




        } catch (error) {
            console.error(error);
        }
    };

    if (!currentSubscription) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-8 p-6">

            <h1 className="text-3xl font-bold">
                Subscription & Billing
            </h1>
            {currentSubscription.status !== "TRIAL" && (

                <CurrentSubscriptionCard
                    subscription={currentSubscription}
                />


            )}


            <PlanCarousel
                status={currentSubscription?.status}
                plans={plans}
                currentPlanId={currentSubscription.plan._id}
            />

        </div>
    );
}


export default PrePaidSubscription