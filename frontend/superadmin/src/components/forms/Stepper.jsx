
export default function Stepper({
    tabs,
    activeTab,
    setActiveTab,
}) {
    const currentStep =
        tabs.findIndex(([key]) => key === activeTab) + 1;

    return (
        <div className="bg-white px-8 py-3 border-b">
            <div className="flex items-center justify-center">
                {tabs.map(([key, label], index) => {
                    const step = index + 1;
                    const completed = step <= currentStep;

                    return (
                        <div key={key} className="flex items-center">
                            {/* Circle */}
                            <button
                                onClick={() => setActiveTab(key)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition
                                ${completed
                                        ? "bg-orange-500 text-white"
                                        : "bg-orange-100 text-orange-400"
                                    }`}
                            >
                                {step}
                            </button>

                            {/* Label */}
                            <div className="ml-2 mr-4 hidden md:block">
                                <p
                                    className={`text-sm font-medium ${completed
                                        ? "text-orange-600"
                                        : "text-slate-400"
                                        }`}
                                >
                                    {label}
                                </p>
                            </div>

                            {/* Line */}
                            {index !== tabs.length - 1 && (
                                <div className="w-20 md:w-28 h-1 rounded-full bg-orange-100 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${step < currentStep
                                            ? "bg-orange-500 w-full"
                                            : "bg-orange-500 w-0"
                                            }`}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}