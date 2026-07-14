import { useEffect, useState } from "react";

export default function Upload({
    label,
    requiredField = false,
    value,
    onChange,
    onRemove,
    accept = ".pdf,application/pdf",
}) {
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(() => {
        if (!value || !value.type?.startsWith("image/")) {
            setPreviewUrl("");
            return;
        }

        const nextPreviewUrl = URL.createObjectURL(value);
        setPreviewUrl(nextPreviewUrl);

        return () => URL.revokeObjectURL(nextPreviewUrl);
    }, [value]);

    return (
        <div className="w-full">
            <label className="text-sm font-medium text-slate-700">
                {label}
                {requiredField && (
                    <span className="text-red-500"> *</span>
                )}
            </label>

            <label className="
                w-full
                border-2
                border-dashed
                border-slate-300
                hover:border-orange-400
                p-4
                rounded-xl
                mt-1
                block
                cursor-pointer
                transition
                bg-white
            ">

                {!value ? (
                    <div className="text-center py-3">
                        <p className="font-medium text-orange-500">
                            Upload File
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                            Click to browse
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                        {previewUrl && (
                            <img
                                src={previewUrl}
                                alt="preview"
                                className="
                                    w-16 h-16
                                    object-cover
                                    rounded-lg
                                    border
                                    mx-auto sm:mx-0
                                "
                            />
                        )}

                        <div className="flex-1 min-w-0 text-center sm:text-left">
                            <p className="text-green-600 font-medium truncate">
                                {value.name}
                            </p>

                            <p className="text-xs text-slate-500">
                                {(value.size / 1024).toFixed(1)} KB
                            </p>

                            <p className="text-xs text-blue-500">
                                Click to change file
                            </p>
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
                                text-lg
                                self-center
                            "
                        >
                            ✕
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
        </div>
    );
}
