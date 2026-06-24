import { DoctorsTable, AddDoctor } from "../components";

function Doctors() {
    return (
        <div className="p-4 sm:p-6 space-y-6">

            <AddDoctor />

            <DoctorsTable />

        </div>
    );
}

export default Doctors;