/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, CheckCircle2, Building2, MapPin, UserCog, Wallet, Check, ArrowLeft, ArrowRight } from "lucide-react";
import {
    getPublicPlans,
    sendAdminOtp,
    verifyAdminOtp,
    registerClinic,
} from "../api/clinicRegistrationApi";
import { showToast } from "../../../shared/components/toast";

const emptyForm = {
    clinicName: "",
    facilityType: "",
    year: "",
    email: "",
    phone: "",
    addressLine1: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    password: "",
    confirmPassword: "",
    plan: "",
    billingCycle: "",
};

const steps = [
    { id: 1, title: "Details", shortTitle: "Clinic Details", icon: Building2 },
    { id: 2, title: "Address", shortTitle: "Address", icon: MapPin },
    { id: 3, title: "Admin Account", shortTitle: "Admin Account", icon: UserCog },
    { id: 4, title: "Plan & Payment", shortTitle: "Choose Plan", icon: Wallet },
];

const inputCls = "w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-[#F7931E] focus:ring-2 focus:ring-[#F7931E]/20";
const labelCls = "block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-500";
const errCls = "mt-1 text-xs font-medium text-red-500";

export default function RegisterClinic() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [accountType, setAccountType] = useState("Clinic");
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [plans, setPlans] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpBusy, setOtpBusy] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        getPublicPlans(accountType)
            .then((res) => setPlans(res.data || []))
            .catch(() => setPlans([]));
        setForm((prev) => ({ ...prev, plan: "", billingCycle: "" }));
    }, [accountType]);

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = window.setInterval(() => setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
        return () => window.clearInterval(timer);
    }, [resendCooldown]);

    const update = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
    };

    const isValidPhone = (value) => /^[6-9]\d{9}$/.test(value);
    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const handleSendOtp = async () => {
        if (!isValidPhone(form.adminPhone)) {
            setErrors((prev) => ({ ...prev, adminPhone: "Enter a valid 10 digit mobile number." }));
            return;
        }
        setOtpBusy(true);
        setOtpError("");
        try {
            await sendAdminOtp(form.adminPhone);
            setOtpSent(true);
            setResendCooldown(30);
        } catch (error) {
            setOtpError(error.response?.data?.message || "Could not send OTP.");
        } finally {
            setOtpBusy(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!/^\d{6}$/.test(otp)) {
            setOtpError("Enter the 6 digit OTP.");
            return;
        }
        setOtpBusy(true);
        setOtpError("");
        try {
            await verifyAdminOtp(form.adminPhone, otp);
            setOtpVerified(true);
        } catch (error) {
            setOtpError(error.response?.data?.message || "Invalid or expired OTP.");
        } finally {
            setOtpBusy(false);
        }
    };

    // Per-step validation - mirrors the "grey out Next until valid" pattern
    // used in Reception's New Registration wizard, rather than only
    // surfacing errors after an ineffective click.
    const getStepErrors = (targetStep) => {
        const next = {};
        if (targetStep === 1) {
            if (!form.clinicName.trim() || form.clinicName.trim().length < 3) next.clinicName = "Must be at least 3 characters.";
            if (!isValidEmail(form.email.trim())) next.email = "Enter a valid email.";
            if (!isValidPhone(form.phone)) next.phone = "Enter a valid 10 digit phone number.";
        }
        if (targetStep === 2) {
            if (!form.addressLine1.trim()) next.addressLine1 = "Address is required.";
            if (!form.city.trim()) next.city = "City is required.";
            if (!form.state.trim()) next.state = "State is required.";
            if (!/^\d{6}$/.test(form.pincode.trim())) next.pincode = "Enter a valid 6 digit PIN code.";
        }
        if (targetStep === 3) {
            if (!form.adminName.trim() || form.adminName.trim().length < 3) next.adminName = "Must be at least 3 characters.";
            if (!isValidEmail(form.adminEmail.trim())) next.adminEmail = "Enter a valid email.";
            if (!isValidPhone(form.adminPhone)) next.adminPhone = "Enter a valid 10 digit mobile number.";
            if (!otpVerified) next.adminPhone = next.adminPhone || "Verify the admin mobile OTP before continuing.";
            if (form.password.length < 8) next.password = "Must be at least 8 characters.";
            if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match.";
        }
        if (targetStep === 4) {
            if (!form.plan || !form.billingCycle) next.plan = "Select a plan to continue.";
        }
        return next;
    };

    const isStepIncomplete = (targetStep) => Object.keys(getStepErrors(targetStep)).length > 0;

    const handleNext = () => {
        const stepErrors = getStepErrors(step);
        if (Object.keys(stepErrors).length) {
            setErrors((prev) => ({ ...prev, ...stepErrors }));
            showToast({ type: "error", title: "Missing details", description: "Please complete this step before continuing." });
            return;
        }
        setStep((prev) => Math.min(prev + 1, steps.length));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const allErrors = { ...getStepErrors(1), ...getStepErrors(2), ...getStepErrors(3), ...getStepErrors(4) };
        if (Object.keys(allErrors).length) {
            setErrors(allErrors);
            showToast({ type: "error", title: "Missing details", description: "Please fill in all required fields correctly." });
            return;
        }

        setSubmitting(true);
        try {
            const res = await registerClinic({
                clinicName: form.clinicName.trim(),
                facilityType: form.facilityType.trim(),
                year: form.year.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                addressDetails: {
                    addressLine1: form.addressLine1.trim(),
                    city: form.city.trim(),
                    district: form.district.trim(),
                    state: form.state.trim(),
                    pincode: form.pincode.trim(),
                },
                adminName: form.adminName.trim(),
                adminEmail: form.adminEmail.trim(),
                adminPhone: form.adminPhone.trim(),
                password: form.password,
                plan: form.plan,
                billingCycle: form.billingCycle,
                accountType,
            });

            showToast({ type: "success", title: "Registered", description: "Complete payment to continue - a super admin will review and approve your account before dashboard access." });
            // PaymentPage.jsx reads clinicId/email from this exact state
            // shape - same page Super-Admin-created clinics already use to
            // pay via PayU. On success it lands back at /clinic, but access
            // there stays gated until Super Admin approves the registration
            // in Verification Center (Clinic.verificationStatus defaults to
            // SUBMITTED and payment success never changes it).
            navigate("/payment", {
                state: { clinicId: res.data.clinicId, email: res.data.email },
                replace: true,
            });
        } catch (error) {
            const field = error.response?.data?.field;
            const message = error.response?.data?.message || "Registration failed. Please try again.";
            if (field) setErrors((prev) => ({ ...prev, [field]: message }));
            showToast({ type: "error", title: "Registration failed", description: message });
        } finally {
            setSubmitting(false);
        }
    };

    const progressPercentage = Math.round(((step - 1) / (steps.length - 1)) * 100);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-200/70 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-4 sm:px-6 py-3 border-b border-[#D9ECE7] bg-[#EAF4F2]">
                    <div>
                        <h1 className="text-lg sm:text-xl font-black text-[#0C3D2E] tracking-tight flex items-center gap-1.5">
                            <ShieldCheck size={20} className="text-[#F7931E]" />
                            Register Your Clinic or Practice
                        </h1>
                        <p className="text-slate-600 text-xs mt-0.5 font-semibold">
                            {accountType === "Solo Doctor" ? "Solo veterinarian sign-up" : "Clinic sign-up"} - payment and super admin approval required to activate
                        </p>
                    </div>
                    <div className="bg-[#F7931E] text-white rounded-full px-3 py-1 flex items-center gap-1.5 shrink-0 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        <span className="text-xs font-black tracking-wide">
                            Step {step} of {steps.length} ({progressPercentage}%)
                        </span>
                    </div>
                </div>

                {/* Stepper */}
                <div className="bg-[#F4F9F7] border-b border-[#D9ECE7] px-4 sm:px-6 py-3">
                    <div className="relative pt-0.5 pb-0.5">
                        <div className="absolute top-[16px] left-5 right-5 h-1 bg-slate-200 rounded-full z-0" />
                        <div
                            className="absolute top-[16px] left-5 h-1 bg-[#F7931E] rounded-full z-0 transition-all duration-500 ease-out"
                            style={{ width: `calc(${progressPercentage}% - ${step === 1 ? 0 : 10}px)` }}
                        />
                        <div className="relative z-10 flex justify-between items-start">
                            {steps.map((item, index) => {
                                const isCompleted = step > index + 1;
                                const isActive = step === index + 1;
                                const IconComponent = item.icon;
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => { if (index + 1 < step) setStep(index + 1); }}
                                        className={`flex flex-col items-center select-none ${index + 1 <= step ? "cursor-pointer" : "cursor-not-allowed opacity-75"}`}
                                    >
                                        <div
                                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                                                isCompleted
                                                    ? "bg-[#0C3D2E] text-white shadow-md ring-2 ring-emerald-50 scale-105"
                                                    : isActive
                                                        ? "bg-[#F7931E] text-white shadow-md ring-2 ring-orange-100 scale-105"
                                                        : "bg-white text-slate-400 border border-slate-200 shadow-xs"
                                            }`}
                                        >
                                            {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : <IconComponent className="w-4 h-4" />}
                                        </div>
                                        <p className={`mt-1 text-[11px] font-bold text-center ${isCompleted ? "text-emerald-700" : isActive ? "text-orange-600 font-extrabold" : "text-slate-400"}`}>
                                            {item.shortTitle}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-4 sm:p-6 min-h-[360px]">
                        {step === 1 && (
                            <div className="space-y-5">
                                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-1.5 w-fit">
                                    {[
                                        { key: "Clinic", label: "I'm a Clinic" },
                                        { key: "Solo Doctor", label: "I'm a Solo Veterinarian" },
                                    ].map((opt) => (
                                        <button
                                            key={opt.key}
                                            type="button"
                                            onClick={() => setAccountType(opt.key)}
                                            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${accountType === opt.key ? "bg-[#0C3D2E] text-white" : "text-gray-500 hover:text-gray-700"}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className={labelCls}>{accountType === "Solo Doctor" ? "Practice Name" : "Clinic Name"}</label>
                                        <input className={inputCls} value={form.clinicName} onChange={update("clinicName")} />
                                        {errors.clinicName && <p className={errCls}>{errors.clinicName}</p>}
                                    </div>
                                    <div>
                                        <label className={labelCls}>Facility Type</label>
                                        <input className={inputCls} value={form.facilityType} onChange={update("facilityType")} placeholder="e.g. Private Clinic" />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Contact Email</label>
                                        <input type="email" className={inputCls} value={form.email} onChange={update("email")} />
                                        {errors.email && <p className={errCls}>{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className={labelCls}>Contact Phone</label>
                                        <input className={inputCls} value={form.phone} onChange={update("phone")} maxLength={10} />
                                        {errors.phone && <p className={errCls}>{errors.phone}</p>}
                                    </div>
                                    <div>
                                        <label className={labelCls}>Year of Establishment</label>
                                        <input className={inputCls} value={form.year} onChange={update("year")} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className={labelCls}>Address</label>
                                    <input className={inputCls} value={form.addressLine1} onChange={update("addressLine1")} />
                                    {errors.addressLine1 && <p className={errCls}>{errors.addressLine1}</p>}
                                </div>
                                <div>
                                    <label className={labelCls}>City</label>
                                    <input className={inputCls} value={form.city} onChange={update("city")} />
                                    {errors.city && <p className={errCls}>{errors.city}</p>}
                                </div>
                                <div>
                                    <label className={labelCls}>District</label>
                                    <input className={inputCls} value={form.district} onChange={update("district")} />
                                </div>
                                <div>
                                    <label className={labelCls}>State</label>
                                    <input className={inputCls} value={form.state} onChange={update("state")} />
                                    {errors.state && <p className={errCls}>{errors.state}</p>}
                                </div>
                                <div>
                                    <label className={labelCls}>PIN Code</label>
                                    <input className={inputCls} value={form.pincode} onChange={update("pincode")} maxLength={6} />
                                    {errors.pincode && <p className={errCls}>{errors.pincode}</p>}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={labelCls}>Admin Name</label>
                                    <input className={inputCls} value={form.adminName} onChange={update("adminName")} />
                                    {errors.adminName && <p className={errCls}>{errors.adminName}</p>}
                                </div>
                                <div>
                                    <label className={labelCls}>Admin Email</label>
                                    <input type="email" className={inputCls} value={form.adminEmail} onChange={update("adminEmail")} />
                                    {errors.adminEmail && <p className={errCls}>{errors.adminEmail}</p>}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className={labelCls}>Admin Mobile Number</label>
                                    <div className="flex gap-2">
                                        <input
                                            className={inputCls}
                                            value={form.adminPhone}
                                            onChange={(e) => {
                                                update("adminPhone")(e);
                                                setOtpSent(false);
                                                setOtpVerified(false);
                                                setOtp("");
                                            }}
                                            maxLength={10}
                                            disabled={otpVerified}
                                        />
                                        {!otpVerified && (
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                disabled={otpBusy || resendCooldown > 0 || !isValidPhone(form.adminPhone)}
                                                className="shrink-0 rounded-xl bg-[#0C3D2E] px-4 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : otpSent ? "Resend OTP" : "Send OTP"}
                                            </button>
                                        )}
                                        {otpVerified && (
                                            <span className="flex shrink-0 items-center gap-1 rounded-xl bg-green-50 px-4 text-xs font-bold text-green-700">
                                                <CheckCircle2 size={14} /> Verified
                                            </span>
                                        )}
                                    </div>
                                    {errors.adminPhone && <p className={errCls}>{errors.adminPhone}</p>}

                                    {otpSent && !otpVerified && (
                                        <div className="mt-2 flex gap-2">
                                            <input
                                                className={inputCls}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                                maxLength={6}
                                                placeholder="Enter 6 digit OTP"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleVerifyOtp}
                                                disabled={otpBusy}
                                                className="shrink-0 rounded-xl bg-[#F7931E] px-4 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Verify OTP
                                            </button>
                                        </div>
                                    )}
                                    {otpError && <p className={errCls}>{otpError}</p>}
                                </div>

                                <div>
                                    <label className={labelCls}>Password</label>
                                    <input type="password" className={inputCls} value={form.password} onChange={update("password")} />
                                    {errors.password && <p className={errCls}>{errors.password}</p>}
                                </div>
                                <div>
                                    <label className={labelCls}>Confirm Password</label>
                                    <input type="password" className={inputCls} value={form.confirmPassword} onChange={update("confirmPassword")} />
                                    {errors.confirmPassword && <p className={errCls}>{errors.confirmPassword}</p>}
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div>
                                {errors.plan && <p className={errCls}>{errors.plan}</p>}
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {plans.map((p) => {
                                        const isSelected = form.plan === p.subscriptionPlan && form.billingCycle === p.billingCycle;
                                        return (
                                            <button
                                                type="button"
                                                key={`${p.subscriptionPlan}-${p.billingCycle}`}
                                                onClick={() => setForm((prev) => ({ ...prev, plan: p.subscriptionPlan, billingCycle: p.billingCycle }))}
                                                className={`rounded-xl border p-4 text-left transition ${isSelected ? "border-[#F7931E] bg-[#F7931E]/5 ring-2 ring-[#F7931E]/30" : "border-gray-200 hover:border-gray-300"}`}
                                            >
                                                <p className="font-bold text-gray-900">{p.subscriptionPlan}</p>
                                                <p className="text-xs text-gray-500">{p.billingCycle}</p>
                                                <p className="mt-2 text-lg font-black text-[#0C3D2E]">₹{p.price?.toLocaleString()}</p>
                                                {p.trialPeriodDays > 0 && (
                                                    <p className="mt-1 text-[11px] font-semibold text-green-600">{p.trialPeriodDays} day free trial</p>
                                                )}
                                            </button>
                                        );
                                    })}
                                    {plans.length === 0 && <p className="text-sm text-gray-400">Loading plans...</p>}
                                </div>
                                <p className="mt-4 text-xs text-gray-400">
                                    After submitting, you'll be taken to payment. Your account still needs super admin approval
                                    before you can access the dashboard.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer navigation */}
                    <div className="border-t border-slate-100 px-4 py-3 sm:px-6 flex justify-between items-center gap-3 bg-white">
                        <button
                            type="button"
                            disabled={step === 1}
                            onClick={() => setStep((prev) => prev - 1)}
                            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                        {step < steps.length ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={isStepIncomplete(step)}
                                className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-orange-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next Step
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={submitting || isStepIncomplete(4)}
                                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-emerald-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Registering..." : "Register & Continue to Payment"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
