import { useState } from "react";

import { ClinicModal, ClinicHeader } from "../../index"

export default function AddClinicModal() {
    const [open, setOpen] = useState(false);

    return (
        <div className="p-0 py-8 space-y-6">

            {/* HEADER */}
            <ClinicHeader onAdd={() => setOpen(true)} />

            {/* MODAL */}
            {open && <ClinicModal onClose={() => setOpen(false)} />}

        </div>
    );
}