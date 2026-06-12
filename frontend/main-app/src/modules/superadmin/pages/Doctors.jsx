import DoctorForm from "../components/forms/doctorForm/DoctorForm"
import AddDoctor from "../components/forms/doctorForm/AddDoctor"
import { DoctorsTable } from "../components"

function Doctors() {
    return (
        <>
            <AddDoctor />
            <DoctorsTable />
        </>
    )
}

export default Doctors