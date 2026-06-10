import { useState } from "react";

import ReceptionSidebar from "./component/ReceptionSidebar";

import ReceptionDashboard from "./pages/ReceptionDashboard";

import OwnerVerificationForm from "./component/OwnerVerificationForm";
import PetRegistrationForm from "./component/PetRegistrationForm";
import PetHistoryForm from "./component/PetHistoryForm";
import ReasonForVisitForm from "./component/ReasonForVisitForm";

function App() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="flex">

      <ReceptionSidebar
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />

      <div className="flex-1 bg-slate-100 min-h-screen">

        {activeStep === 0 && (
          <ReceptionDashboard />
        )}

        {activeStep === 1 && (
          <OwnerVerificationForm />
        )}

        {activeStep === 2 && (
          <PetRegistrationForm />
        )}

        {activeStep === 3 && (
          <PetHistoryForm />
        )}

        {activeStep === 4 && (
          <ReasonForVisitForm />
        )}

      </div>

    </div>
  );
}

export default App;