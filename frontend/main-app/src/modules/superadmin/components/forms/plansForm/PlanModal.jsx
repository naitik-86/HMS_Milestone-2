import PlanForm from "./PlanForm";
import PlansHeaderButton from "./PlansHeaderButton";

import { useState } from "react";

export default function PlanModal() {
    const [open, setOpen] = useState(false);

    return (
        <div className="p-0 py-8 space-y-6">
            <PlansHeaderButton onAdd={() => setOpen(true)} />

            {open && (
                <PlanForm onClose={() => setOpen(false)} />
            )}
        </div>
    );
}