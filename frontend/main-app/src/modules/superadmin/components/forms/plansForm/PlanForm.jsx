import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { createPlan } from "../../../api/planApi";

const today = new Date().toISOString().slice(0, 10);

const PLAN_PRICES = {
    Basic: { Monthly: 999, Quarterly: 2699, Annual: 9999 },
    Standard: { Monthly: 1999, Quarterly: 5399, Annual: 19999 },
    Professional: { Monthly: 3999, Quarterly: 10799, Annual: 39999 },
    Enterprise: { Monthly: 7999, Quarterly: 21599, Annual: 79999 },
    Custom: { Monthly: 0, Quarterly: 0, Annual: 0 },
};

const getPlanPrice = (subscriptionPlan, billingCycle) =>
    PLAN_PRICES[subscriptionPlan]?.[billingCycle] ?? 0;

const initialForm = {
    subscriptionPlan: "Basic",
    billingCycle: "Monthly",
    price: getPlanPrice("Basic", "Monthly"),
    planStartDate: today,
    trialPeriodDays: 0,
    discountPromoCode: "",
    customPlanNotes: "",
    maxStaffAccounts: 5,
    maxDoctors: 2,
    maxPetRecords: 100,
    maxPetRecordsUnlimited: false,
    storageLimitGb: 5,
    labModuleEnabled: false,
    groomingModuleEnabled: false,
    kennelModuleEnabled: false,
    onlinePharmacyModuleEnabled: false,
    apiAccessEnabled: false,
    whiteLabelCustomBranding: false,
};

const getRenewalDate = (startDate, billingCycle) => {
    const date = new Date(startDate);
    if (Number.isNaN(date.getTime())) return "";

    const months = { Monthly: 1, Quarterly: 3, Annual: 12 }[billingCycle] || 1;
    date.setMonth(date.getMonth() + months);
    return date.toISOString().slice(0, 10);
};

export default function PlanForm({ onClose, onCreated }) {
    const [form, setForm] = useState(initialForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const planEndRenewalDate = useMemo(
        () => getRenewalDate(form.planStartDate, form.billingCycle),
        [form.planStartDate, form.billingCycle]
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => {
            const updated = {
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            };

            if (name === "subscriptionPlan" || name === "billingCycle") {
                updated.price = getPlanPrice(
                    name === "subscriptionPlan" ? value : updated.subscriptionPlan,
                    name === "billingCycle" ? value : updated.billingCycle
                );
            }

            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            await createPlan({ ...form, planEndRenewalDate });
            onCreated?.();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to create plan");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-start justify-between gap-4 px-6 py-5 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Subscription Plan Assignment
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Configure plan selection, limits, modules and invoice generation.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-orange-50 flex items-center justify-center"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 max-h-[75vh] overflow-y-auto space-y-8">
                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <Section title="Plan Selection" />
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            <SelectField label="Subscription Plan" name="subscriptionPlan" value={form.subscriptionPlan} onChange={handleChange} options={["Basic", "Standard", "Professional", "Enterprise", "Custom"]} required />
                            <SelectField label="Billing Cycle" name="billingCycle" value={form.billingCycle} onChange={handleChange} options={["Monthly", "Quarterly", "Annual"]} required />
                            <Field label="Price (INR)" name="price" type="number" min="0" value={form.price} onChange={handleChange} required />
                            <Field label="Plan Start Date" name="planStartDate" type="date" value={form.planStartDate} onChange={handleChange} required />
                            <Field label="Plan End / Renewal Date" name="planEndRenewalDate" type="date" value={planEndRenewalDate} readOnly />
                            <Field label="Trial Period (Days)" name="trialPeriodDays" type="number" min="0" value={form.trialPeriodDays} onChange={handleChange} />
                            <Field label="Discount / Promo Code" name="discountPromoCode" value={form.discountPromoCode} onChange={handleChange} />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700">Custom Plan Notes</label>
                            <textarea
                                name="customPlanNotes"
                                value={form.customPlanNotes}
                                onChange={handleChange}
                                rows={3}
                                className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <Section title="Feature Limits Per Plan" />
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                            <Field label="Max Staff Accounts" name="maxStaffAccounts" type="number" min="0" value={form.maxStaffAccounts} onChange={handleChange} required />
                            <Field label="Max Doctors" name="maxDoctors" type="number" min="0" value={form.maxDoctors} onChange={handleChange} required />
                            <Field label="Max Pet Records" name="maxPetRecords" type="number" min="0" value={form.maxPetRecords} onChange={handleChange} disabled={form.maxPetRecordsUnlimited} />
                            <Field label="Storage Limit (GB)" name="storageLimitGb" type="number" min="0" value={form.storageLimitGb} onChange={handleChange} required />
                        </div>

                        <Section title="Module Access" />
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {[
                                ["labModuleEnabled", "Lab module enabled"],
                                ["groomingModuleEnabled", "Grooming module enabled"],
                                ["kennelModuleEnabled", "Kennel module enabled"],
                                ["onlinePharmacyModuleEnabled", "Online pharmacy module enabled"],
                                ["apiAccessEnabled", "API access enabled"],
                                ["whiteLabelCustomBranding", "White-label / custom branding"],
                            ].map(([name, label]) => (
                                <label key={name} className="flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-sm font-medium text-slate-700">
                                    <span>{label}</span>
                                    <input
                                        type="checkbox"
                                        name={name}
                                        checked={form[name]}
                                        onChange={handleChange}
                                        className="h-5 w-5 accent-orange-500"
                                    />
                                </label>
                            ))}
                        </div>

                        <div className="rounded-xl border bg-slate-50 px-4 py-3">
                            <div className="text-sm font-medium text-slate-700">Subscription Invoice</div>
                            <div className="mt-1 text-sm text-slate-500">Auto-generated PDF</div>
                        </div>
                    </div>

                    <div className="border-t px-6 py-5 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 border rounded-xl">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-6 py-2.5 rounded-xl font-medium">
                            {saving ? "Creating..." : "Create Plan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Section({ title }) {
    return <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800">{title}</h3>;
}

function Field({ label, name, value, onChange, type = "text", readOnly = false, disabled = false, required = false, min }) {
    return (
        <div>
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                disabled={disabled}
                required={required}
                min={min}
                className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-slate-100 read-only:bg-slate-100"
            />
        </div>
    );
}

function SelectField({ label, name, value, onChange, options, required = false }) {
    return (
        <div>
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <select name={name} value={value} onChange={onChange} required={required} className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500">
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
}
