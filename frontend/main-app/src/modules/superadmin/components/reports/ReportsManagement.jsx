import { useState } from "react";

import ReportsHeader from "./ReportHeader";
import ReportModal from "./ReportModal";
import ReportsGrid from "./ReportsGrid";

import { reportCategories } from "./ReportCategories";

function ReportsManagement() {
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 md:space-y-8">

            <ReportsHeader />

            <ReportsGrid
                categories={reportCategories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
            />

            {selectedCategory && (
                <ReportModal
                    category={selectedCategory}
                    onClose={() => setSelectedCategory(null)}
                />
            )}
        </div>
    );
}

export default ReportsManagement;