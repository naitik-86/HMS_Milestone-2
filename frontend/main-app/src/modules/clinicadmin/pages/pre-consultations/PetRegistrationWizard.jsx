import { useState } from "react";

import {
  VitalsForm,
  BriefHistoryForm,
  ProblemDescriptionForm,
  ObservationForm,
} from "../../components";

export default function PetRegistrationWizard({ onClose }) {
  const [step, setStep] = useState(1);

  const steps = [
    "Vitals",
    "Brief History",
    "Problem Description",
    "Observation",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-2 md:p-6">

      <div className="bg-white rounded-none md:rounded-3xl w-full h-screen md:h-[95vh] md:max-w-7xl mx-auto overflow-hidden shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 md:p-8 border-b border-slate-200">

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              New Registration
            </h2>

            <p className="text-sm md:text-base text-slate-500 mt-1">
              Complete Pre Consultation Assessment
            </p>
          </div>

          <button
            onClick={onClose}
            className="self-end sm:self-auto w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-xl font-bold"
          >
            ✕
          </button>

        </div>

        {/* Stepper */}
        <div className="p-4 md:p-8 border-b border-slate-200 overflow-x-auto">

          <div className="flex min-w-[700px] items-center justify-between">

            {steps.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center flex-1 relative"
              >

                <div
                  className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-sm md:text-lg ${
                    index + 1 <= step
                      ? "bg-orange-500 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {index + 1}
                </div>

                <p className="mt-2 text-xs md:text-sm font-semibold text-center">
                  {item}
                </p>

                {index !== steps.length - 1 && (
                  <div
                    className={`absolute top-5 md:top-7 left-[60%] w-full h-1 ${
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
        <div className="flex-1 overflow-y-auto bg-slate-50 p-3 md:p-8">

          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 min-h-full">

            {step === 1 && <VitalsForm />}

            {step === 2 && <BriefHistoryForm />}

            {step === 3 && <ProblemDescriptionForm />}

            {step === 4 && <ObservationForm />}

          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-white p-4 md:p-8">

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">

            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className={`w-full sm:w-auto px-6 md:px-8 py-3 rounded-2xl font-medium ${
                step === 1
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "border border-slate-300 hover:bg-slate-100"
              }`}
            >
              Previous
            </button>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 md:px-8 py-3 border border-slate-300 rounded-2xl hover:bg-slate-100"
              >
                Cancel
              </button>

              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 md:px-8 py-3 rounded-2xl font-medium"
                >
                  Next
                </button>
              ) : (
                <button
                  className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-6 md:px-8 py-3 rounded-2xl font-medium"
                >
                  Save Registration
                </button>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}