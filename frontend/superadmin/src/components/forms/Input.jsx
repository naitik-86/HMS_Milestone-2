export default function Input({
    label,
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

            <input
                {...props}
                required={requiredField}
                value={props.value ?? ""}
                onChange={props.onChange}
                className="w-full border p-2 rounded-xl mt-1"
            />
        </div>
    );
}