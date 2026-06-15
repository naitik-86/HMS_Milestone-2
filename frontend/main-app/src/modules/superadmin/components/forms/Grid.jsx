export function Grid({ children }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
        </div>
    );
}

export function Full({ children }) {
    return (
        <div className="md:col-span-2">
            {children}
        </div>
    );
}