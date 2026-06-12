import { useState } from "react";

import ReportsHeader from "./ReportHeader";
import ReportModal from "./ReportModal";
import ReportsGrid from "./ReportsGrid";

import { reportCategories } from "./ReportCategories";

function ReportsManagement() {
    const [selectedCategory, setSelectedCategory] =
        useState(null);

    return (
        <div className="space-y-8">

            <ReportsHeader />

            <ReportsGrid
                categories={reportCategories}
                onSelect={setSelectedCategory}
            />

            {selectedCategory && (
                <ReportModal
                    category={selectedCategory}
                    onClose={() =>
                        setSelectedCategory(null)
                    }
                />
            )}
        </div>
    );
}

export default ReportsManagement;