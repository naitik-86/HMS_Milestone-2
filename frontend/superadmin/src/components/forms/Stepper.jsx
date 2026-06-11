export default function Stepper({
    tabs,
    activeTab,
    setActiveTab,
}) {
    const currentStep =
        tabs.findIndex(([key]) => key === activeTab);

    const progress = Math.round(
        (currentStep / (tabs.length - 1)) * 100
    );

    return (
        <div className="bg-white px-8 py-3 border-b">
            <div className="flex items-center justify-center">
                {tabs.map(([key, label], index) => {
                    const step = index + 1;
                    const completed = index <= currentStep;

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
                                    className={`text-sm font-medium flex items-center gap-2
                                    ${completed
                                            ? "text-orange-600"
                                            : "text-slate-400"
                                        }`}
                                >
                                    {label}

                                    {activeTab === key && (
                                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-orange-100 text-orange-600 font-semibold">
                                            {progress}%
                                        </span>
                                    )}
                                </p>
                            </div>

                            {/* Line */}
                            {index !== tabs.length - 1 && (
                                <div className="w-20 md:w-28 h-1 rounded-full bg-orange-100 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${index < currentStep
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