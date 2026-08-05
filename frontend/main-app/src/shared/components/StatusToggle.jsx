/**
 * Reusable Active/Inactive toggle switch (real switch look - track + sliding
 * knob), used anywhere a list row needs an at-a-glance status that can also
 * be flipped with one click. Replaces the earlier pattern of a plain
 * colored badge that happened to have an onClick handler - that looked
 * identical to every other static status badge in the app, so users
 * couldn't tell it was interactive. This makes "clickable" visually obvious.
 */
export default function StatusToggle({
    checked,
    onChange,
    disabled = false,
    busy = false,
    onLabel = "Active",
    offLabel = "Inactive",
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={onChange}
            disabled={disabled || busy}
            title={`Click to ${checked ? "deactivate" : "activate"}`}
            className="inline-flex items-center gap-2 cursor-pointer border-none bg-transparent p-0 disabled:opacity-60 disabled:cursor-wait"
        >
            <span
                className="relative inline-block h-5 w-9 shrink-0 rounded-full transition-colors duration-200"
                style={{ backgroundColor: checked ? "#16A34A" : "#D1D5DB" }}
            >
                <span
                    className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
                    style={{ transform: checked ? "translateX(18px)" : "translateX(2px)" }}
                />
            </span>
            <span
                className="text-xs font-bold"
                style={{ color: checked ? "#16A34A" : "#6B7280" }}
            >
                {busy ? "…" : checked ? onLabel : offLabel}
            </span>
        </button>
    );
}
