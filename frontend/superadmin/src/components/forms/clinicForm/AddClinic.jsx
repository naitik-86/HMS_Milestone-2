import { useState } from "react";


import { ClinicModal, ClinicHeader } from "../../index"

export default function ClinicPage() {
    const [open, setOpen] = useState(false);

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            {/* <ClinicHeader onAdd={() => setOpen(true)} /> */}
            <ClinicHeader onAdd={() => {
                console.log("CLICK WORKING");
                setOpen(true);
            }} />

            {/* MODAL */}
            {open && <ClinicModal onClose={() => setOpen(false)} />}

        </div>
    );
}