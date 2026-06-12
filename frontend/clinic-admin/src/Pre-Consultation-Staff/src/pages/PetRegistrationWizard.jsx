import { useState } from "react";

import VitalsForm from "../components/VitalsForm";
import BriefHistoryForm from "../components/BriefHistoryForm";
import ProblemDescriptionForm from "../components/ProblemDescriptionForm";
import ObservationForm from "../components/ObservationForm";

export default function PetRegistrationWizard({ onClose }) {
  const [step, setStep] = useState(1);

  const steps = [
    "Vitals",
    "Brief History",
    "Problem Description",
    "Observation",
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">

      <div className="bg-white rounded-3xl w-full max-w-7xl h-[95vh] overflow-hidden shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-200">

          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              New Registration
            </h2>

            <p className="text-slate-500 mt-2">
              Complete Pre Consultation Assessment
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-xl font-bold"
          >
            ✕
          </button>

        </div>

        {/* Stepper */}
        <div className="p-8 border-b border-slate-200">

          <div className="flex items-center justify-between">

            {steps.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center flex-1 relative"
              >

                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg ${
                    index + 1 <= step
                      ? "bg-orange-500 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {index + 1}
                </div>

                <p className="mt-3 text-sm font-semibold text-center">
                  {item}
                </p>

                {index !== steps.length - 1 && (
                  <div
                    className={`hidden md:block absolute top-7 left-[60%] w-full h-1 ${
                      index + 1 < step
                        ? "bg-orange-500"
                        : "bg-slate-200"
                    }`}
                  />
                )}

              </div>
            ))}

          </div>

        </div>

        {/* Form Section */}
       {/* Form Section */}
<div
  className="
    flex-1
    p-8
    bg-slate-50
    overflow-y-auto
    max-h-[calc(95vh-270px)]
    scrollbar-hide
  "
>

  <div className="bg-white rounded-3xl p-8">

    {step === 1 && <VitalsForm />}

    {step === 2 && <BriefHistoryForm />}

    {step === 3 && <ProblemDescriptionForm />}

    {step === 4 && <ObservationForm />}

  </div>

</div>

        {/* Footer */}
        <div className="flex items-center justify-between p-8 border-t border-slate-200 bg-white">

          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className={`px-8 py-3 rounded-2xl font-medium ${
              step === 1
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "border border-slate-300 hover:bg-slate-100"
            }`}
          >
            Previous
          </button>

          <div className="flex gap-4">

            <button
              onClick={onClose}
              className="px-8 py-3 border border-slate-300 rounded-2xl hover:bg-slate-100"
            >
              Cancel
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-medium"
              >
                Next
              </button>
            ) : (
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-2xl font-medium"
              >
                Save Registration
              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}