import { useState, useRef } from "react";
import { completePreConsultation } from "../../api/preConsultationApi";
import {
  VitalsForm,
  BriefHistoryForm,
  ProblemDescriptionForm,
  ObservationForm,
} from "../../components";

export default function PetRegistrationWizard({ onClose, petData, onCompleted }) {
  const [step, setStep] = useState(1);
  const scrollRef = useRef(null);

  const handleFinish = async () => {
    try {
      await completePreConsultation(petData);
      onCompleted();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };
  const steps = [
    "Vitals",
    "History",
    "Problem",
    "Observe",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-0 md:p-6 overflow-hidden">

      <div className="bg-white rounded-none md:rounded-3xl w-full h-screen md:h-[95vh] md:max-w-7xl mx-auto shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between p-4 md:p-8 border-b border-slate-200">

          <div className="pr-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              New Registration
            </h2>

            <p className="text-sm md:text-base text-slate-500 mt-1">
              Complete Pre Consultation Assessment
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-xl font-bold"
          >
            ✕
          </button>

        </div>

        {/* Stepper */}
        <div className="px-3 py-2 md:p-8 border-b border-slate-200 overflow-x-auto">

          <div className="flex min-w-[500px] md:min-w-0 items-center justify-between">

            {steps.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center flex-1 relative"
              >

                <div
                  className={`w-8 h-8 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-sm md:text-lg ${index + 1 <= step
                    ? "bg-orange-500 text-white"
                    : "bg-slate-200 text-slate-500"
                    }`}
                >
                  {index + 1}
                </div>

                <p className="mt-1 text-[10px] md:text-sm font-semibold text-center whitespace-nowrap">
                  {item}
                </p>

                {index !== steps.length - 1 && (
                  <div
                    className={`absolute top-5 md:top-7 left-[60%] w-full h-1 ${index + 1 < step
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
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto"
        >
          <div className="bg-slate-50 p-3 md:p-8">

            <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 min-h-full">

              {step === 1 && <VitalsForm />}

              {step === 2 && <BriefHistoryForm />}

              {step === 3 && <ProblemDescriptionForm />}

              {step === 4 && <ObservationForm />}
              <div className="mt-8 border-t border-slate-200 pt-6">

                <div className="grid grid-cols-2 gap-3">

                  <button
                    onClick={() => {
                      setStep(step - 1);

                      scrollRef.current?.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                    disabled={step === 1}
                    className={`h-11 rounded-xl font-medium text-sm ${step === 1
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "border border-slate-300 hover:bg-slate-100"
                      }`}
                  >
                    Previous
                  </button>

                  <button
                    onClick={onClose}
                    className="h-11 border border-slate-300 rounded-xl text-sm hover:bg-slate-100"
                  >
                    Cancel
                  </button>

                </div>

                {step < 4 ? (
                  <button
                    onClick={() => {
                      setStep(step + 1);

                      scrollRef.current?.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                    className="mt-3 w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="mt-3 w-full h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium"
                  >
                    Finish
                  </button>
                )}

              </div>

            </div>
          </div>
        </div>

        {/* Footer */}


      </div>

    </div>
  );
}