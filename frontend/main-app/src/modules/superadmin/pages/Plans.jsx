import { PlanModal, ActivePlans } from "../components";
import { useState } from "react";

function Plans() {
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <div className="p-4 sm:p-6 space-y-6">

            <PlanModal onCreated={() => setRefreshKey((key) => key + 1)} />

            <ActivePlans refreshKey={refreshKey} />

        </div>
    );
}

export default Plans;
