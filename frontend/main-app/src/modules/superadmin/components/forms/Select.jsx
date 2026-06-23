export default function Select({
    label,
    options = [],
    requiredField = false,
    ...props
}) {
    return (
        <div className="w-full">
            <label className="text-sm font-medium text-slate-700">
                {label}
                {requiredField && (
                    <span className="text-red-500"> *</span>
                )}
            </label>

            <select
                {...props}
                required={requiredField}
                value={props.value ?? ""}
                className="
                    w-full
                    mt-1
                    px-3
                    py-2.5
                    text-sm md:text-base
                    border
                    border-slate-300
                    rounded-xl
                    outline-none
                    focus:ring-2
                    focus:ring-orange-400
                    focus:border-orange-400
                    transition
                "
            >
                <option value="">Select</option>

                {options.map((o) => (
                    <option key={o} value={o}>
                        {o}
                    </option>
                ))}
            </select>
        </div>
    );
}