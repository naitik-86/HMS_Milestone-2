import { useEffect, useMemo } from "react";

export default function Upload({
    label,
    requiredField = false,
    value,
    onChange,
    onRemove,
    accept = ".pdf,application/pdf",
    error = "",
}) {
    const hasError = Boolean(error);
    const fileName = typeof value === "string" ? value : value?.name || "";
    const previewUrl = useMemo(() => {
        if (!value || typeof value === "string" || !value.type?.startsWith("image/")) return "";
        return URL.createObjectURL(value);
    }, [value]);
    const isImage = Boolean(previewUrl);

    useEffect(() => {
        if (!previewUrl) return undefined;

        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    return (
        <div className="w-full">
            <label className={`block mb-2 text-sm font-medium ${hasError ? "text-red-600" : "text-slate-700"}`}>
                {label}
                {requiredField && (
                    <span className="text-red-500"> *</span>
                )}
            </label>

            <label
                className={`
                    w-full
                    h-12
                    border
                    border-dashed
                    rounded-lg
                    bg-white
                    transition-all
                    duration-200
                    cursor-pointer
                    flex
                    items-center
                    justify-center
                    px-4
                    ${hasError ? "border-red-400" : "border-slate-300 hover:border-orange-500"}
                `}
            >
                {!value ? (
                    <div className="flex items-center gap-2 text-slate-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-orange-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16"
                            />
                        </svg>

                        <span className="text-sm font-medium">
                            Upload File
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center justify-between w-full gap-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            {isImage && (
                                <img
                                    src={previewUrl}
                                    alt="preview"
                                    className="w-8 h-8 rounded object-cover border"
                                />
                            )}

                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-green-600">
                                    {fileName}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                onRemove && onRemove();
                            }}
                            className="
                                text-red-500
                                hover:text-red-600
                                text-base
                                font-semibold
                            "
                            aria-label={`Remove ${label}`}
                        >
                            X
                        </button>
                    </div>
                )}

                <input
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={onChange}
                />
            </label>

            {hasError && (
                <p className="mt-1 text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}
