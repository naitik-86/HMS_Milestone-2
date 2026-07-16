import {
    X,
    ShieldCheck,
    Clock3,
    CheckCircle2,
    Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TrialPaymentModal({
    open,
    onClose,
    remainingTrialDays,
    clinicId,
    email,
}) {
    const navigate = useNavigate();

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

            <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-[0_20px_80px_rgba(0,0,0,0.25)]">

                {/* Header */}

                <div className="relative border-b bg-white px-8 py-7">

                    <button
                        onClick={onClose}
                        className="absolute right-5 top-5 rounded-full p-2 text-gray-500 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
                            <Sparkles className="text-orange-600" size={28} />
                        </div>

                        <div>

                            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                PetCare HMS
                            </span>

                            <h2 className="text-2xl font-bold text-gray-900">
                                Trial Activated
                            </h2>

                            <p className="text-gray-500">
                                Your clinic is ready to explore every premium feature.
                            </p>

                        </div>

                    </div>

                </div>

                {/* Body */}

                <div className="space-y-7 p-8">

                    {/* Trial Card */}

                    <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-emerald-50 p-6">

                        <div className="flex items-center justify-between">

                            <div>

                                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                                    Trial Active
                                </span>

                                <h3 className="mt-4 text-lg font-semibold text-gray-800">
                                    Remaining Trial
                                </h3>

                            </div>

                            <div className="text-center">

                                <p className="text-6xl font-extrabold text-blue-700">
                                    {remainingTrialDays}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Days Left
                                </p>

                            </div>

                        </div>

                    </div>

                    <div>

                        <h4 className="mb-4 text-lg font-semibold text-gray-800">
                            During your trial you get:
                        </h4>

                        <div className="space-y-3">

                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="text-green-600" size={20} />
                                <span>Unlimited access to HMS features</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <ShieldCheck className="text-blue-600" size={20} />
                                <span>Secure patient & clinic management</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Clock3 className="text-orange-500" size={20} />
                                <span>Upgrade anytime without losing data</span>
                            </div>

                        </div>

                    </div>

                    <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">

                        <p className="text-sm leading-6 text-gray-700">
                            Once your trial expires, your clinic access will be
                            restricted until a subscription plan is activated.
                            Upgrade now to ensure uninterrupted access.
                        </p>

                    </div>

                </div>

                {/* Footer */}

                <div className="flex flex-col-reverse gap-3 border-t bg-gray-50 p-6 sm:flex-row sm:justify-end">

                    <button
                        onClick={onClose}
                        className="rounded-xl border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-100"
                    >
                        Continue Trial
                    </button>

                    <button
                        onClick={() =>
                            navigate("/payment", {
                                state: {
                                    clinicId,
                                    email,
                                },
                            })
                        }
                        className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3 font-semibold text-white shadow-lg transition duration-300 hover:scale-[1.02] hover:from-orange-600 hover:to-orange-700"
                    >
                        Upgrade Now →
                    </button>

                </div>

            </div>

        </div>
    );
}