import { useState } from "react";
import DoctorSidebar from "./component/DoctorSidebar";
import DoctorWizard from "./component/DoctorWizard";

function App() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="flex bg-slate-100">
      <DoctorSidebar
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />

      <div className="flex-1">
        <DoctorWizard
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      </div>
    </div>
  );
}

export default App;