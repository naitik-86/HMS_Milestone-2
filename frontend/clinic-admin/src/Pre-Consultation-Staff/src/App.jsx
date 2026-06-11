import { useState } from "react";
import "./App.css";

import PreConsultationSidebar from "./compnent/PreConsultationSidebar";
import PreConsultationWizard from "./compnent/PreConsultationWizard";

function App() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="flex">
      <PreConsultationSidebar
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />

      <div className="flex-1">
        <PreConsultationWizard
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      </div>
    </div>
  );
}

export default App;