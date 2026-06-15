import { useState } from "react";
import { X } from "lucide-react";

const modulesList = [
    "Lab Module",
    "Grooming",
    "Kennel",
    "Pharmacy",
    "Inventory",
    "Telemedicine",
    "API Access",
    "White Labeling",
];

export default function PlanForm({ onClose }) {
    const [form, setForm] = useState({
        planName: "",
        tier: "basic",

        monthlyPrice: 0,
        quarterlyPrice: 0,
        annualPrice: 0,

        trialDays: 14,

        maxStaff: 5,
        maxDoctors: 2,
        maxPetRecords: 100,
        storage: 5,

        modules: [],
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const toggleModule = (module) => {
        setForm((prev) => ({
            ...prev,
            modules: prev.modules.includes(module)
                ? prev.modules.filter((m) => m !== module)
                : [...prev.modules, module],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(form);

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden">

                {/* Header */}

                <div className="flex items-center justify-between px-8 py-5 border-b">
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                            Create Plan
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Configure pricing, limits and modules.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-orange-50 flex items-center justify-center"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-8 max-h-[75vh] overflow-y-auto">

                        {/* Pricing */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <Field
                                label="Plan Name"
                                name="planName"
                                value={form.planName}
                                onChange={handleChange}
                            />

                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Tier
                                </label>

                                <select
                                    name="tier"
                                    value={form.tier}
                                    onChange={handleChange}
                                    className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="basic">
                                        Basic
                                    </option>

                                    <option value="standard">
                                        Standard
                                    </option>

                                    <option value="premium">
                                        Premium
                                    </option>
                                </select>
                            </div>

                            <Field
                                label="Monthly Price (₹)"
                                name="monthlyPrice"
                                type="number"
                                value={form.monthlyPrice}
                                onChange={handleChange}
                            />

                            <Field
                                label="Quarterly Price (₹)"
                                name="quarterlyPrice"
                                type="number"
                                value={form.quarterlyPrice}
                                onChange={handleChange}
                            />

                            <Field
                                label="Annual Price (₹)"
                                name="annualPrice"
                                type="number"
                                value={form.annualPrice}
                                onChange={handleChange}
                            />

                            <Field
                                label="Trial Days"
                                name="trialDays"
                                type="number"
                                value={form.trialDays}
                                onChange={handleChange}
                            />

                            <Field
                                label="Max Staff"
                                name="maxStaff"
                                type="number"
                                value={form.maxStaff}
                                onChange={handleChange}
                            />

                            <Field
                                label="Max Doctors"
                                name="maxDoctors"
                                type="number"
                                value={form.maxDoctors}
                                onChange={handleChange}
                            />

                            <Field
                                label="Max Pet Records"
                                name="maxPetRecords"
                                type="number"
                                value={form.maxPetRecords}
                                onChange={handleChange}
                            />

                            <Field
                                label="Storage (GB)"
                                name="storage"
                                type="number"
                                value={form.storage}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Modules */}

                        <div className="mt-8 border-t pt-6">
                            <h3 className="font-semibold text-lg mb-6">
                                Modules
                            </h3>

                            <div className="grid md:grid-cols-2 gap-y-5 gap-x-10">

                                {modulesList.map((module) => (
                                    <div
                                        key={module}
                                        className="flex justify-between items-center"
                                    >
                                        <span className="text-slate-700">
                                            {module}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleModule(module)
                                            }
                                            className={`w-12 h-7 rounded-full relative transition
                                            ${form.modules.includes(module)
                                                    ? "bg-orange-500"
                                                    : "bg-slate-300"
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition
                                                ${form.modules.includes(module)
                                                        ? "right-1"
                                                        : "left-1"
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}

                    <div className="border-t px-8 py-5 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 border rounded-xl"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-medium"
                        >
                            Create Plan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Field({
    label,
    name,
    value,
    onChange,
    type = "text",
}) {
    return (
        <div>
            <label className="text-sm font-medium text-slate-700">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
            />
        </div>
    );
}