import { PlanModal, ActivePlans } from "../components";

function Plans() {
    return (
        <div className="p-4 sm:p-6 space-y-6">

            <PlanModal />

            <ActivePlans />

        </div>
    );
}

export default Plans;