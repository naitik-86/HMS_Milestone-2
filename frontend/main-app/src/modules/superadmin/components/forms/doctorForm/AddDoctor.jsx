import { useState } from "react";

import { VeterinarianHeader, DoctorModal } from "../../index"

export default function AddDoctorModal() {
    const [open, setOpen] = useState(false);

    return (
        <div className="p-0 py-8 space-y-6">

            {/* HEADER */}
            <VeterinarianHeader onAdd={() => setOpen(true)} />

            {/* MODAL */}
            {open && <DoctorModal onClose={() => setOpen(false)} />}

        </div>
    );
}