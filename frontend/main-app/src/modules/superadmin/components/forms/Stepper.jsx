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
        <div className="bg-white border-b">
            <div className="overflow-x-auto scrollbar-hide">
                <div className="flex items-center min-w-max px-4 md:px-8 py-4">

                    {tabs.map(([key, label], index) => {
                        const step = index + 1;
                        const completed = index <= currentStep;

                        return (
                            <div
                                key={key}
                                className="flex items-center flex-shrink-0"
                            >
                                {/* STEP */}
                                <div className="flex flex-col items-center">

                                    <button
                                        onClick={() => setActiveTab(key)}
                                        className={`
                                            w-9 h-9 md:w-10 md:h-10
                                            rounded-full
                                            flex items-center justify-center
                                            text-sm md:text-base
                                            font-semibold
                                            transition
                                            ${completed
                                                ? "bg-orange-500 text-white"
                                                : "bg-orange-100 text-orange-400"
                                            }
                                        `}
                                    >
                                        {step}
                                    </button>

                                    {/* MOBILE LABEL */}
                                    <span
                                        className={`
                                            mt-2 text-[10px]
                                            max-w-[70px]
                                            text-center
                                            md:hidden
                                            ${completed
                                                ? "text-orange-600"
                                                : "text-slate-400"
                                            }
                                        `}
                                    >
                                        {label}
                                    </span>
                                </div>

                                {/* DESKTOP LABEL */}
                                <div className="ml-3 mr-5 hidden md:block">
                                    <p
                                        className={`
                                            text-sm font-medium
                                            flex items-center gap-2
                                            ${completed
                                                ? "text-orange-600"
                                                : "text-slate-400"
                                            }
                                        `}
                                    >
                                        {label}

                                        {activeTab === key && (
                                            <span className="px-2 py-0.5 text-[10px] rounded-full bg-orange-100 text-orange-600 font-semibold">
                                                {progress}%
                                            </span>
                                        )}
                                    </p>
                                </div>

                                {/* CONNECTOR */}
                                {index !== tabs.length - 1 && (
                                    <div
                                        className="
                                            w-10 sm:w-14 md:w-24
                                            h-1
                                            rounded-full
                                            bg-orange-100
                                            overflow-hidden
                                            mx-2
                                        "
                                    >
                                        <div
                                            className={`
                                                h-full
                                                transition-all
                                                duration-300
                                                ${index < currentStep
                                                    ? "bg-orange-500 w-full"
                                                    : "bg-orange-500 w-0"
                                                }
                                            `}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}