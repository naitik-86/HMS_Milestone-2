export default function Select({
    label,
    options = [],
    requiredField = false,
    ...props
}) {
    return (
        <div>
            <label className="text-sm">
                {label}
                {requiredField && (
                    <span className="text-red-500"> *</span>
                )}
            </label>

            <select
                {...props}
                required={requiredField}
                value={props.value ?? ""}
                className="w-full border p-2 rounded-xl mt-1"
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