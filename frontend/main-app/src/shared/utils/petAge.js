// Formats a pet's age for display, preferring an exact calculation from
// date of birth (which can show days/months for a young pet) and falling
// back to a stored whole-years age field. Callers that just did
// `pet.age ? \`${pet.age} yrs\` : "N/A"` treated a real age of 0 (a pet
// under a year old) as if no age had been recorded at all, always
// showing "N/A" for puppies/kittens.
export function formatPetAge(pet) {
    if (!pet) return "N/A";

    if (pet.dob) {
        const dob = new Date(pet.dob);
        if (!Number.isNaN(dob.getTime())) {
            const now = new Date();
            let totalDays = Math.floor((now - dob) / (1000 * 60 * 60 * 24));
            if (totalDays < 0) totalDays = 0;

            if (totalDays < 30) {
                return `${totalDays} ${totalDays === 1 ? "day" : "days"}`;
            }

            let months = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
            if (now.getDate() < dob.getDate()) months -= 1;
            if (months < 0) months = 0;

            if (months < 12) {
                return `${months} ${months === 1 ? "month" : "months"}`;
            }

            const years = Math.floor(months / 12);
            const remainderMonths = months % 12;
            const yearsLabel = `${years} ${years === 1 ? "yr" : "yrs"}`;
            return remainderMonths === 0
                ? yearsLabel
                : `${yearsLabel} ${remainderMonths} ${remainderMonths === 1 ? "mo" : "mos"}`;
        }
    }

    if (pet.age !== undefined && pet.age !== null && pet.age !== "") {
        const years = Number(pet.age);
        if (!Number.isNaN(years)) {
            return years === 0 ? "Under 1 yr" : `${years} ${years === 1 ? "yr" : "yrs"}`;
        }
    }

    return "N/A";
}
