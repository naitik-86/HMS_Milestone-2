import { useState } from "react";

import OwnerVerificationForm from "./OwnerVerificationForm";
import PetRegistrationForm from "./PetRegistrationForm";
import PetHistoryForm from "./PetHistoryForm";
import ReasonForVisitForm from "./ReasonForVisitForm";

export default function RegistrationWizard({
  onClose,
}) {
  const [activeStep, setActiveStep] =
    useState(1);

  const renderForm = () => {
    switch (activeStep) {
      case 1:
        return <OwnerVerificationForm />;

      case 2:
        return <PetRegistrationForm />;

      case 3:
        return <PetHistoryForm />;

      case 4:
        return <ReasonForVisitForm />;

      default:
        return <OwnerVerificationForm />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">

      <div className="bg-white w-[85%] max-w-7xl h-[90vh] rounded-3xl overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="border-b p-5 flex justify-between items-center">

          <h2 className="text-2xl font-bold">
            New Registration
          </h2>

          <button
            onClick={onClose}
            className="text-red-500 text-xl font-bold"
          >
            ✕
          </button>

        </div>

        <div className="flex h-full">

          {/* Sidebar */}
          <div className="w-80 border-r bg-gray-50 p-5">

            <div className="space-y-3">

              <button
                onClick={() => setActiveStep(1)}
                className={`w-full text-left p-4 rounded-xl ${
                  activeStep === 1
                    ? "bg-orange-500 text-white"
                    : "bg-white"
                }`}
              >
                1. Owner Verification
              </button>

              <button
                onClick={() => setActiveStep(2)}
                className={`w-full text-left p-4 rounded-xl ${
                  activeStep === 2
                    ? "bg-orange-500 text-white"
                    : "bg-white"
                }`}
              >
                2. Pet Registration
              </button>

              <button
                onClick={() => setActiveStep(3)}
                className={`w-full text-left p-4 rounded-xl ${
                  activeStep === 3
                    ? "bg-orange-500 text-white"
                    : "bg-white"
                }`}
              >
                3. Pet History
              </button>

              <button
                onClick={() => setActiveStep(4)}
                className={`w-full text-left p-4 rounded-xl ${
                  activeStep === 4
                    ? "bg-orange-500 text-white"
                    : "bg-white"
                }`}
              >
                4. Reason For Visit
              </button>

            </div>

          </div>

          {/* Form Area */}
          <div className="flex-1 p-8 overflow-y-auto">
            {renderForm()}
          </div>

        </div>

      </div>

    </div>
  );
}