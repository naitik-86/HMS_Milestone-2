/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
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

export default function RegisterClinic() {
    const navigate = useNavigate();
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
        // Switching type invalidates whatever plan was previously picked -
        // it belongs to the other catalog.
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

    const validate = () => {
        const next = {};
        if (!form.clinicName.trim() || form.clinicName.trim().length < 3) next.clinicName = "Clinic name must be at least 3 characters.";
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid clinic email.";
        if (!isValidPhone(form.phone)) next.phone = "Enter a valid 10 digit clinic phone number.";
        if (!form.addressLine1.trim()) next.addressLine1 = "Address is required.";
        if (!form.city.trim()) next.city = "City is required.";
        if (!form.state.trim()) next.state = "State is required.";
        if (!/^\d{6}$/.test(form.pincode.trim())) next.pincode = "Enter a valid 6 digit PIN code.";
        if (!form.adminName.trim() || form.adminName.trim().length < 3) next.adminName = "Admin name must be at least 3 characters.";
        if (!form.adminEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.adminEmail.trim())) next.adminEmail = "Enter a valid admin email.";
        if (!isValidPhone(form.adminPhone)) next.adminPhone = "Enter a valid 10 digit admin mobile number.";
        if (!otpVerified) next.adminPhone = next.adminPhone || "Verify the admin mobile OTP before continuing.";
        if (form.password.length < 8) next.password = "Password must be at least 8 characters.";
        if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match.";
        if (!form.plan || !form.billingCycle) next.plan = "Select a plan to continue.";

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
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

            showToast({ type: "success", title: "Clinic registered", description: "Complete payment to activate your account." });
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

    const inputCls = "w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-[#F7931E] focus:ring-2 focus:ring-[#F7931E]/20";
    const labelCls = "block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-500";
    const errCls = "mt-1 text-xs font-medium text-red-500";

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="mx-auto max-w-3xl">
                <div className="mb-6 flex items-center gap-2">
                    <ShieldCheck size={26} className="text-[#0C3D2E]" />
                    <h1 className="text-2xl font-bold text-gray-900">Register Your Clinic or Practice</h1>
                </div>
                <p className="mb-4 text-sm text-gray-500">
                    Set up your account and choose a plan. You'll complete payment on the next step, then a super admin
                    reviews and approves your registration before you can access the dashboard.
                </p>

                <div className="mb-6 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-1.5 w-fit">
                    {[
                        { key: "Clinic", label: "I'm a Clinic" },
                        { key: "Solo Doctor", label: "I'm a Solo Veterinarian" },
                    ].map((opt) => (
                        <button
                            key={opt.key}
                            type="button"
                            onClick={() => setAccountType(opt.key)}
                            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                                accountType === opt.key ? "bg-[#0C3D2E] text-white" : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-base font-bold text-gray-900">
                            {accountType === "Solo Doctor" ? "Practice Details" : "Clinic Details"}
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className={labelCls}>Clinic Name</label>
                                <input className={inputCls} value={form.clinicName} onChange={update("clinicName")} />
                                {errors.clinicName && <p className={errCls}>{errors.clinicName}</p>}
                            </div>
                            <div>
                                <label className={labelCls}>Facility Type</label>
                                <input className={inputCls} value={form.facilityType} onChange={update("facilityType")} placeholder="e.g. Private Clinic" />
                            </div>
                            <div>
                                <label className={labelCls}>Clinic Email</label>
                                <input type="email" className={inputCls} value={form.email} onChange={update("email")} />
                                {errors.email && <p className={errCls}>{errors.email}</p>}
                            </div>
                            <div>
                                <label className={labelCls}>Clinic Phone</label>
                                <input className={inputCls} value={form.phone} onChange={update("phone")} maxLength={10} />
                                {errors.phone && <p className={errCls}>{errors.phone}</p>}
                            </div>
                            <div>
                                <label className={labelCls}>Year of Establishment</label>
                                <input className={inputCls} value={form.year} onChange={update("year")} />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-base font-bold text-gray-900">Address</h2>
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
                    </section>

                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-base font-bold text-gray-900">Admin Account</h2>
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
                    </section>

                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-base font-bold text-gray-900">Choose a Plan</h2>
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
                    </section>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-xl bg-gradient-to-r from-[#0C3D2E] to-[#092E23] py-3.5 text-sm font-bold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? "Registering..." : "Register & Continue to Payment"}
                    </button>
                </form>
            </div>
        </div>
    );
}
