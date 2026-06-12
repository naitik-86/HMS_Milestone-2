import React, { useState } from "react";

export default function SmsWhatsappTemplates() {
    const [templates, setTemplates] = useState([
        {
            id: 1,
            title: "OTP Verification",
            desc: "Configure OTP verification template",
            message:
                "Your OTP is {{otp}}. Please do not share it with anyone.",
        },
        {
            id: 2,
            title: "Appointment Reminder",
            desc: "Configure appointment reminder template",
            message:
                "Hello {{name}}, this is a reminder for your appointment on {{date}} at {{time}}.",
        },
        {
            id: 3,
            title: "Payment Confirmation",
            desc: "Configure payment confirmation template",
            message:
                "Your payment of ₹{{amount}} has been received successfully.",
        },
        {
            id: 4,
            title: "Subscription Renewal",
            desc: "Configure subscription renewal template",
            message:
                "Hello {{name}}, your subscription will renew on {{renewalDate}}.",
        },
    ]);

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({
        message: "",
    });

    const handleConfigure = (template) => {
        setSelected(template);
        setForm({
            message: template.message,
        });
        setOpen(true);
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = () => {
        const updatedTemplates = templates.map((template) =>
            template.id === selected.id
                ? { ...template, ...form }
                : template
        );

        setTemplates(updatedTemplates);
        setOpen(false);
    };

    return (
        <>
            {/* TEMPLATE LIST */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <h2 className="font-semibold mb-6">
                    SMS & WhatsApp Templates
                </h2>

                <div className="divide-y">
                    {templates.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center py-5"
                        >
                            <div>
                                <h3 className="font-medium">
                                    {item.title}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    {item.desc}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleConfigure(item)}
                                className="px-4 py-2 border border-orange-500 text-orange-500 rounded-xl hover:bg-orange-50"
                            >
                                Configure
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL */}
            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">
                            Configure {selected?.title}
                        </h2>

                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            rows={8}
                            placeholder="Enter SMS / WhatsApp template..."
                            className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
                        />

                        <div className="mt-2 text-xs text-gray-500">
                            Available variables: {"{{name}}"}, {"{{otp}}"}, {"{{date}}"}, {"{{time}}"}, {"{{amount}}"}, {"{{renewalDate}}"}
                        </div>

                        <div className="flex justify-end gap-3 mt-5">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 border rounded-xl"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                className="px-5 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}