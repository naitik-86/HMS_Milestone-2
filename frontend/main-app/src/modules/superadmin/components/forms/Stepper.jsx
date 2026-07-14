export default function Stepper({
    tabs,
    activeTab,
}) {
    const currentStep =
        tabs.findIndex(([key]) => key === activeTab);

    const progress = Math.round(
        (currentStep / (tabs.length - 1)) * 100
    );

    return (
        <div className="bg-white border-b">
            <div>
                <div className="flex items-center justify-between px-4 py-4">

                    {tabs.map(([key, label], index) => {
                        const step = index + 1;
                        const completed = index <= currentStep;

                        return (
                            <div
                                key={key}
                                className="flex items-center flex-1 min-w-0"
                            >
                                {/* STEP */}
                                <div className="flex flex-col items-center shrink-0">

                                    <div
                                        className={`
                                            w-8 h-8
                                            rounded-full
                                            flex items-center justify-center
                                            text-xs
                                            font-semibold
                                            ${completed
                                                ? "bg-orange-500 text-white"
                                                : "bg-orange-100 text-orange-400"
                                            }
                                        `}
                                    >
                                        {step}
                                    </div>

                                    {/* MOBILE LABEL */}
                                    <span
                                        className={`
                                            mt-2 text-[9px]
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
                                <div className="ml-2 mr-2 hidden md:block min-w-0 flex-1">
                                    <p
                                        className={`
                                            text-xs font-medium
                                            truncate
                                            ${completed
                                                ? "text-orange-600"
                                                : "text-slate-400"
                                            }
                                        `}
                                    >
                                        {label}

                                        {activeTab === key && (
                                            <span className="ml-2 px-2 py-0.5 text-[10px] rounded-full bg-orange-100 text-orange-600 font-semibold">
                                                {progress}%
                                            </span>
                                        )}
                                    </p>
                                </div>

                                {/* CONNECTOR */}
                                {index !== tabs.length - 1 && (
                                    <div
                                        className="
                                            flex-1
                                            h-1
                                            rounded-full
                                            bg-orange-100
                                            overflow-hidden
                                            mx-2
                                        "
                                    >
                                        <div
                                            className={`
                                                h-full transition-all duration-300
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