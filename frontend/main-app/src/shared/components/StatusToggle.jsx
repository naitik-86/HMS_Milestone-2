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
            className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap cursor-pointer border-none bg-transparent p-0 disabled:opacity-60 disabled:cursor-wait"
        >
            {/* Fixed size, never allowed to shrink - a tight table cell
                should scroll/wrap around this, not squeeze it. */}
            <span
                className="relative inline-block shrink-0 rounded-full transition-colors duration-200"
                style={{ height: "20px", width: "36px", minWidth: "36px" }}
            >
                <span
                    className="absolute inline-block rounded-full transition-colors duration-200"
                    style={{ inset: 0, backgroundColor: checked ? "#16A34A" : "#D1D5DB" }}
                />
                {/* Clean white round knob, in both states - it's the part
                    that visibly slides, making it obvious this can be
                    clicked again to flip back. Inline boxShadow (not the
                    Tailwind `shadow` class) so it's never dependent on
                    which shadow scale a Tailwind version ships with. */}
                <span
                    className="absolute rounded-full transition-transform duration-200"
                    style={{
                        top: "2px",
                        height: "16px",
                        width: "16px",
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                        transform: checked ? "translateX(18px)" : "translateX(2px)",
                    }}
                />
            </span>
            {/* min-w keeps "Active"/"Inactive" from shifting the row width
                as it toggles, and guarantees the full word always has room. */}
            <span
                className="text-xs font-bold whitespace-nowrap"
                style={{ color: checked ? "#16A34A" : "#6B7280", minWidth: "48px" }}
            >
                {busy ? "…" : checked ? onLabel : offLabel}
            </span>
        </button>
    );
}
