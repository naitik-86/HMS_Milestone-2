import { useEffect, useMemo, useRef, useState } from "react";

// Live-capture counterpart to Upload.jsx for the Profile Photo field -
// shares the same value/onRemove/error contract (a File object once
// captured, or an existing filename string in edit mode) so the parent
// form doesn't need to know which mode produced the photo.
export default function CameraCapture({ label, value, onCapture, onRemove, error = "" }) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cameraError, setCameraError] = useState("");

    const hasError = Boolean(error);
    const fileName = typeof value === "string" ? value : value?.name || "";
    const previewUrl = useMemo(() => {
        if (!value || typeof value === "string" || !value.type?.startsWith("image/")) return "";
        return URL.createObjectURL(value);
    }, [value]);

    useEffect(() => {
        if (!previewUrl) return undefined;
        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setIsCameraOpen(false);
    };

    // Release the camera if the component unmounts (e.g. switching back to
    // Upload mode, or navigating away) while the stream is still open.
    useEffect(() => stopCamera, []);

    const openCamera = async () => {
        setCameraError("");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
            });
            streamRef.current = stream;
            setIsCameraOpen(true);
        } catch (err) {
            console.error(err);
            setCameraError("Unable to access the camera. Check your browser's camera permission for this site.");
        }
    };

    useEffect(() => {
        if (isCameraOpen && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [isCameraOpen]);

    const capturePhoto = () => {
        const video = videoRef.current;
        if (!video || !video.videoWidth) return;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
            (blob) => {
                if (!blob) return;
                const file = new File([blob], `profile-photo-${Date.now()}.jpg`, { type: "image/jpeg" });
                onCapture(file);
                stopCamera();
            },
            "image/jpeg",
            0.9
        );
    };

    return (
        <div className="w-full">
            <label className={`block mb-2 text-xs sm:text-sm font-semibold uppercase tracking-wider ${hasError ? "text-red-600" : "text-gray-600"}`}>
                {label}
            </label>

            {value ? (
                <div
                    className={`w-full min-h-[48px] sm:min-h-[52px] border-2 border-dashed rounded-lg sm:rounded-xl bg-white flex items-center justify-between gap-3 px-3 sm:px-4 py-2 sm:py-3 ${hasError ? "border-red-500 bg-red-50/30" : "border-gray-300"}`}
                >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        {previewUrl && (
                            <img src={previewUrl} alt="preview" className="w-7 h-7 sm:w-8 sm:h-8 rounded object-cover border border-gray-200" />
                        )}
                        <p className="truncate text-xs sm:text-sm font-semibold text-green-600">{fileName}</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => onRemove && onRemove()}
                        className="text-red-500 hover:text-red-700 text-lg sm:text-xl font-bold shrink-0 transition-colors"
                        aria-label={`Remove ${label}`}
                    >
                        ✕
                    </button>
                </div>
            ) : isCameraOpen ? (
                <div className="rounded-lg sm:rounded-xl border-2 border-gray-300 bg-black overflow-hidden">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full max-h-64 object-contain" />
                    <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={stopCamera}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={capturePhoto}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#F7931E] hover:bg-[#e08319] transition-colors cursor-pointer"
                        >
                            Capture Photo
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={openCamera}
                    className={`w-full min-h-[48px] sm:min-h-[52px] border-2 border-dashed rounded-lg sm:rounded-xl bg-white transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 ${hasError ? "border-red-500 bg-red-50/30 hover:bg-red-50/50" : "border-gray-300 hover:border-orange-500 hover:bg-orange-50/20"}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-medium text-gray-500">Open Camera</span>
                </button>
            )}

            {cameraError && <p className="mt-1.5 text-xs sm:text-sm font-semibold text-red-600">{cameraError}</p>}
            {hasError && <p className="mt-1.5 text-xs sm:text-sm font-semibold text-red-600">{error}</p>}
        </div>
    );
}
