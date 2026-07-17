import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { createPlan, updatePlan } from "../../../api/planApi";
import { showToast } from "../../../../../shared/components/toast";

const today = new Date().toISOString().slice(0, 10);

const PLAN_TYPE_CONFIG = {
    Clinic: {
        planNames: ["Basic", "Standard", "Professional", "Enterprise", "Custom"],
        defaults: {
            maxStaffAccounts: 5,
            maxDoctors: 2,
            maxPetRecords: 100,
            storageLimitGb: 5,
        },
        pricePresets: {
            Basic: { Monthly: 999, Quarterly: 2699, Annual: 9999 },
            Standard: { Monthly: 1999, Quarterly: 5399, Annual: 19999 },
            Professional: { Monthly: 3999, Quarterly: 10799, Annual: 39999 },
            Enterprise: { Monthly: 7999, Quarterly: 21599, Annual: 79999 },
            Custom: { Monthly: 0, Quarterly: 0, Annual: 0 },
        },
    },
    "Solo Doctor": {
        planNames: ["Solo Basic", "Solo Pro", "Custom"],
        defaults: {
            maxStaffAccounts: 0,
            maxDoctors: 1,
            maxPetRecords: 50,
            storageLimitGb: 2,
        },
        pricePresets: {
            "Solo Basic": { Monthly: 499, Quarterly: 1299, Annual: 4999 },
            "Solo Pro": { Monthly: 999, Quarterly: 2699, Annual: 9999 },
            Custom: { Monthly: 0, Quarterly: 0, Annual: 0 },
        },
    },
};

const BILLING_CYCLES = ["Monthly", "Quarterly", "Half-Yearly", "Annual"];
const STATUS_OPTIONS = ["Active", "Inactive", "Archived"];

const clampNonNegativeNumber = (value) => Math.max(Number(value || 0), 0);

const resolvePlanType = (plan) => {
    if (plan?.planType === "Solo Doctor") return "Solo Doctor";
    if (["Solo Basic", "Solo Pro"].includes(plan?.subscriptionPlan)) return "Solo Doctor";
    return "Clinic";
};

const formatDateForInput = (value) => {
    if (!value) return today;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return today;

    return date.toISOString().slice(0, 10);
};

const getPlanPrice = (planType, subscriptionPlan, billingCycle) =>
    PLAN_TYPE_CONFIG[planType]?.pricePresets?.[subscriptionPlan]?.[billingCycle] ?? 0;

const getPlanDefaults = (planType) => PLAN_TYPE_CONFIG[planType]?.defaults || PLAN_TYPE_CONFIG.Clinic.defaults;

const buildInitialForm = (plan) => {
    const planType = resolvePlanType(plan);
    const planConfig = PLAN_TYPE_CONFIG[planType];
    const subscriptionPlan = plan?.subscriptionPlan && planConfig.planNames.includes(plan.subscriptionPlan)
        ? plan.subscriptionPlan
        : planConfig.planNames[0];
    const billingCycle = BILLING_CYCLES.includes(plan?.billingCycle) ? plan.billingCycle : "Monthly";
    const defaults = getPlanDefaults(planType);

    return {
        planType,
        subscriptionPlan,
        billingCycle,
        price: Number(plan?.price ?? getPlanPrice(planType, subscriptionPlan, billingCycle)),
        planStartDate: formatDateForInput(plan?.planStartDate),
        trialPeriodDays: Number(plan?.trialPeriodDays ?? 0),
        discountPromoCode: plan?.discountPromoCode ?? "",
        customPlanNotes: plan?.customPlanNotes ?? "",
        maxStaffAccounts: Number(plan?.featureLimits?.maxStaffAccounts ?? defaults.maxStaffAccounts),
        maxDoctors: Number(plan?.featureLimits?.maxDoctors ?? defaults.maxDoctors),
        maxPetRecords: Number(plan?.featureLimits?.maxPetRecords ?? defaults.maxPetRecords),
        maxPetRecordsUnlimited: Boolean(plan?.featureLimits?.maxPetRecordsUnlimited),
        storageLimitGb: Number(plan?.featureLimits?.storageLimitGb ?? defaults.storageLimitGb),
        labModuleEnabled: Boolean(plan?.modules?.lab),
        groomingModuleEnabled: Boolean(plan?.modules?.grooming),
        kennelModuleEnabled: Boolean(plan?.modules?.kennel),
        onlinePharmacyModuleEnabled: Boolean(plan?.modules?.onlinePharmacy),
        apiAccessEnabled: Boolean(plan?.modules?.apiAccess),
        whiteLabelCustomBranding: Boolean(plan?.modules?.whiteLabelBranding),
        status: plan?.status ?? "Active",
    };
};

const getRenewalDate = (startDate, billingCycle) => {
    const date = new Date(startDate);
    if (Number.isNaN(date.getTime())) return "";

    const months = { Monthly: 1, Quarterly: 3, "Half-Yearly": 6, Annual: 12 }[billingCycle] || 1;
    date.setMonth(date.getMonth() + months);
    return date.toISOString().slice(0, 10);
};

export default function PlanForm({ plan, onClose, onSaved, onCreated }) {
    const isEditing = Boolean(plan?._id);
    const [form, setForm] = useState(() => buildInitialForm(plan));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setForm(buildInitialForm(plan));
        setError("");
    }, [plan]);

    const planEndRenewalDate = useMemo(
        () => getRenewalDate(form.planStartDate, form.billingCycle),
        [form.planStartDate, form.billingCycle]
    );

    const subscriptionPlanOptions = PLAN_TYPE_CONFIG[form.planType]?.planNames || PLAN_TYPE_CONFIG.Clinic.planNames;

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setForm((previous) => {
            if (name === "planType") {
                const nextPlanType = value in PLAN_TYPE_CONFIG ? value : "Clinic";
                const nextPlanOptions = PLAN_TYPE_CONFIG[nextPlanType].planNames;
                const nextSubscriptionPlan = nextPlanOptions.includes(previous.subscriptionPlan)
                    ? previous.subscriptionPlan
                    : nextPlanOptions[0];
                const nextBillingCycle = BILLING_CYCLES.includes(previous.billingCycle) ? previous.billingCycle : "Monthly";
                const nextDefaults = getPlanDefaults(nextPlanType);

                return {
                    ...previous,
                    planType: nextPlanType,
                    subscriptionPlan: nextSubscriptionPlan,
                    price: getPlanPrice(nextPlanType, nextSubscriptionPlan, nextBillingCycle),
                    maxStaffAccounts: nextDefaults.maxStaffAccounts,
                    maxDoctors: nextDefaults.maxDoctors,
                    maxPetRecords: nextDefaults.maxPetRecords,
                    maxPetRecordsUnlimited: false,
                    storageLimitGb: nextDefaults.storageLimitGb,
                };
            }

            const numericFields = new Set([
                "price",
                "trialPeriodDays",
                "maxStaffAccounts",
                "maxDoctors",
                "maxPetRecords",
                "storageLimitGb",
            ]);

            const nextValue = type === "checkbox"
                ? checked
                : numericFields.has(name)
                    ? clampNonNegativeNumber(value)
                    : value;

            const nextForm = {
                ...previous,
                [name]: nextValue,
            };

            if (name === "subscriptionPlan" || name === "billingCycle") {
                const nextSubscriptionPlan = name === "subscriptionPlan" ? value : nextForm.subscriptionPlan;
                const nextBillingCycle = name === "billingCycle" ? value : nextForm.billingCycle;
                nextForm.price = getPlanPrice(nextForm.planType, nextSubscriptionPlan, nextBillingCycle);
            }

            return nextForm;
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");

        const payload = {
            ...form,
            price: clampNonNegativeNumber(form.price),
            trialPeriodDays: clampNonNegativeNumber(form.trialPeriodDays),
            planEndRenewalDate,
        };

        try {
            const response = isEditing
                ? await updatePlan(plan._id, payload)
                : await createPlan(payload);

            showToast({
                type: "success",
                title: isEditing ? "Plan Updated" : "Plan Created",
                description: response?.message || `The ${form.planType.toLowerCase()} plan has been saved successfully.`,
            });

            onSaved?.(response?.data);
            onCreated?.(response?.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || (isEditing ? "Unable to update plan" : "Unable to create plan"));
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
                            {isEditing ? "Edit Subscription Plan" : "Create Subscription Plan"}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Configure clinic and solo doctor pricing, limits, modules and renewal details.
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
                            <SelectField label="Plan Type" name="planType" value={form.planType} onChange={handleChange} options={Object.keys(PLAN_TYPE_CONFIG)} required />
                            <SelectField label="Subscription Plan" name="subscriptionPlan" value={form.subscriptionPlan} onChange={handleChange} options={subscriptionPlanOptions} required />
                            <SelectField label="Billing Cycle" name="billingCycle" value={form.billingCycle} onChange={handleChange} options={BILLING_CYCLES} required />
                            <Field label="Price (INR)" name="price" type="number" min="0" value={form.price} onChange={handleChange} required />
                            <Field label="Plan Start Date" name="planStartDate" type="date" value={form.planStartDate} onChange={handleChange} required />
                            <Field label="Plan End / Renewal Date" name="planEndRenewalDate" type="date" value={planEndRenewalDate} readOnly />
                            <Field label="Trial Period (Days)" name="trialPeriodDays" type="number" min="0" value={form.trialPeriodDays} onChange={handleChange} />
                            <SelectField label="Status" name="status" value={form.status} onChange={handleChange} options={STATUS_OPTIONS} required />
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
                            {saving ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Plan" : "Create Plan")}
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
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}
