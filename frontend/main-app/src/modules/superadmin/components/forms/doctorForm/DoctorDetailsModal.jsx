const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const valueOrDash = (value) => {
    if (Array.isArray(value)) {
        return value.length ? value.join(", ") : "-";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (value === undefined || value === null || String(value).trim() === "") {
        return "-";
    }

    return value;
};

const Section = ({ title, children }) => (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {title}
        </h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {children}
        </div>
    </section>
);

const Field = ({ label, value, wide = false }) => (
    <div className={wide ? "sm:col-span-2" : ""}>
        <p className="text-xs uppercase tracking-wide text-slate-500">
            {label}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-800 break-words">
            {valueOrDash(value)}
        </p>
    </div>
);

export default function DoctorDetailsModal({ doctor, onClose, onEdit, onDelete }) {
    if (!doctor) return null;

    const bankDetails = doctor.bankDetails || {};
    const qualifications = Array.isArray(doctor.qualifications) ? doctor.qualifications : [];
    const degreeCertificates = Array.isArray(doctor.degreeCertificates) ? doctor.degreeCertificates : [];
    const profilePhotoName = typeof doctor.profilePhoto === "string" ? doctor.profilePhoto : doctor.profilePhoto?.name || "-";
    const govtIdDocumentName = typeof doctor.govtIdDocument === "string" ? doctor.govtIdDocument : doctor.govtIdDocument?.name || "-";
    const registrationCertificateName = typeof doctor.registrationCertificate === "string" ? doctor.registrationCertificate : doctor.registrationCertificate?.name || "-";

    return (
        <div className="fixed inset-0 z-[60] bg-black/50 px-4 py-6 sm:px-6 sm:py-10 flex items-center justify-center">
            <div className="w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">
                            Veterinarian Profile
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-slate-900">
                            {doctor.fullName || doctor.name || "Unnamed Veterinarian"}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {doctor.displayId || doctor.id}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                        aria-label="Close veterinarian details"
                    >
                        X
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                    <div className="grid gap-4">
                        <Section title="Overview">
                            <Field label="Status" value={doctor.status} />
                            <Field label="Mobile" value={doctor.mobile} />
                            <Field label="Email" value={doctor.email} />
                            <Field label="Practice" value={doctor.practiceType || doctor.practice} />
                            <Field label="Experience" value={doctor.experience} />
                        </Section>

                        <Section title="Personal Information">
                            <Field label="Gender" value={doctor.gender} />
                            <Field label="Date of Birth" value={formatDate(doctor.dob || doctor.dateOfBirth)} />
                            <Field label="Languages" value={doctor.languages} wide />
                            <Field label="Address" value={doctor.address} wide />
                            <Field label="City" value={doctor.city} />
                            <Field label="State" value={doctor.state} />
                            <Field label="PIN Code" value={doctor.pincode} />
                            <Field label="Profile Photo" value={profilePhotoName} wide />
                        </Section>

                        <Section title="Government ID">
                            <Field label="ID Type" value={doctor.govtIdType} />
                            <Field label="ID Number" value={doctor.govtIdNumber} />
                            <Field label="Document" value={govtIdDocumentName} wide />
                        </Section>

                        <Section title="Qualifications">
                            <Field label="Specializations" value={doctor.specializations} wide />
                            <Field label="Vet Council Number" value={doctor.vetCouncilRegistrationNumber} />
                            <Field label="State Council" value={doctor.stateVetCouncil} />
                            <Field label="Validity" value={formatDate(doctor.certificateValidityDate || doctor.certificateValidityRaw)} />
                            <Field label="Renewable" value={doctor.isRenewable} />
                            <Field label="Registration Certificate" value={registrationCertificateName} wide />
                            <Field label="Degree Certificates" value={degreeCertificates} wide />
                            <Field label="Qualifications" value={qualifications.map((qualification) => `${qualification.degree} - ${qualification.institution} (${qualification.year})`)} wide />
                        </Section>

                        <Section title="Practice">
                            <Field label="Practice Type" value={doctor.practiceType} />
                            <Field label="Consultation Fee" value={doctor.consultationFee ? `Rs. ${doctor.consultationFee}` : ""} />
                            <Field label="Emergency Available" value={doctor.emergencyAvailable} />
                            <Field label="Service Areas" value={doctor.serviceAreas || doctor.serviceAreasText} wide />
                            <Field label="GST / PAN" value={doctor.gstPan} />
                        </Section>

                        <Section title="Banking">
                            <Field label="Account Holder" value={bankDetails.accountName || doctor.accountName} />
                            <Field label="Account Number" value={bankDetails.accountNumber || doctor.accountNumber} />
                            <Field label="IFSC" value={bankDetails.ifsc || doctor.ifsc} />
                            <Field label="Bank Name" value={bankDetails.bankName || doctor.bankName} />
                            <Field label="Branch" value={bankDetails.branch || doctor.branch} />
                            <Field label="Plan" value={doctor.plan} />
                        </Section>
                    </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
                    {onDelete && (
                        <button
                            type="button"
                            onClick={() => onDelete(doctor)}
                            className="w-full rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 sm:w-auto"
                        >
                            Delete
                        </button>
                    )}

                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(doctor)}
                            className="w-full rounded-xl border border-orange-200 bg-orange-50 px-5 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 sm:w-auto"
                        >
                            Edit
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
