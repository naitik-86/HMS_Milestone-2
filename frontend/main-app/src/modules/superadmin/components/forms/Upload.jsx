export default function Upload({
    label,
    requiredField = false,
    value,
    onChange,
    onRemove,
}) {
    const isImage = value && value.type?.startsWith("image/");

    return (
        <div>
            <label className="text-sm">
                {label}
                {requiredField && <span className="text-red-500"> *</span>}
            </label>

            <label className="border-dashed border p-4 rounded-xl mt-1 block cursor-pointer border-black">

                {!value ? (
                    <div className="text-center text-orange-400">
                        <p className="font-medium">Upload File</p>
                        <p className="text-xs text-gray-400">
                            Click to browse
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">

                        {/* 🔥 Image Preview */}
                        {isImage && (
                            <img
                                src={URL.createObjectURL(value)}
                                alt="preview"
                                className="w-16 h-16 object-cover rounded-lg border"
                            />
                        )}

                        {/* 🔥 File Info */}
                        <div className="flex-1">
                            <p className="text-green-600 font-medium truncate">
                                {value.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {(value.size / 1024).toFixed(1)} KB
                            </p>
                            <p className="text-xs text-blue-500">
                                Click to change file
                            </p>
                        </div>

                        {/* 🔥 Remove Button */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                onRemove && onRemove();
                            }}
                            className="text-red-500 text-sm"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <input
                    type="file"
                    className="hidden"
                    onChange={onChange}
                />
            </label>
        </div>
    );
};