import React, { useState } from "react";


import {
    BrandingTab,
    EmailTab,
    GeneralTab,
    PaymentTab,
    SecurityTab,
    SmsTab,
} from "../components";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("branding");

    const tabs = [
        ["branding", "Branding"],
        ["email", "Email"],
        ["sms", "SMS & WhatsApp"],
        ["payment", "Payment"],
        ["security", "Security"],
        ["general", "General"],
    ];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto">

                <h1 className="text-2xl font-semibold">System Settings</h1>
                <p className="text-gray-500 mb-4">
                    Platform configuration and preferences
                </p>

                {/* Tabs */}
                <div className="flex gap-2 bg-gray-200 p-1 rounded-xl w-fit mb-6">
                    {tabs.map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`px-4 py-2 rounded-xl text-sm ${activeTab === key
                                ? "bg-white shadow text-black"
                                : "text-gray-600"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === "branding" && <BrandingTab />}
                {activeTab === "email" && <EmailTab />}
                {activeTab === "sms" && <SmsTab />}
                {activeTab === "payment" && <PaymentTab />}
                {activeTab === "security" && <SecurityTab />}
                {activeTab === "general" && <GeneralTab />}
            </div>
        </div>
    );
}