import PlanForm from "./PlanForm";

export default function PlanModal({ open, plan, onClose, onSaved, onCreated }) {
    if (!open) return null;

    return (
        <PlanForm
            plan={plan}
            onClose={onClose}
            onSaved={onSaved}
            onCreated={onCreated}
        />
    );
}
