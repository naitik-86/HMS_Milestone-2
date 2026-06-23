import {
    AddClinicModal,
    LatestClinicRequests,
} from "../components";

function Clinics() {
    return (
        <div className="p-4 sm:p-6 space-y-6">
            <AddClinicModal />

            <LatestClinicRequests />

            {/* <ClinicForm /> */}
        </div>
    );
}

export default Clinics;