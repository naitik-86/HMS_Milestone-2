import DoctorDashboard from "../pages/DoctorDashboard";

import HistoryReviewForm from "./HistoryReviewForm";
import ClinicalObservationForm from "./ClinicalObservationForm";
import DiagnosisForm from "./DiagnosisForm";
import LabRequisitionForm from "./LabRequisitionForm";
import TreatmentForm from "./TreatmentForm";
import SuggestionPlanForm from "./SuggestionPlanForm";

export default function DoctorWizard({
  activeStep,
  setActiveStep,
}) {
  switch (activeStep) {
    case 0:
      return (
        <DoctorDashboard
          setActiveStep={setActiveStep}
        />
      );

    case 1:
      return (
        <HistoryReviewForm
          setActiveStep={setActiveStep}
        />
      );

    case 2:
      return (
        <ClinicalObservationForm
          setActiveStep={setActiveStep}
        />
      );

    case 3:
      return (
        <DiagnosisForm
          setActiveStep={setActiveStep}
        />
      );

    case 4:
      return (
        <LabRequisitionForm
          setActiveStep={setActiveStep}
        />
      );

    case 5:
      return (
        <TreatmentForm
          setActiveStep={setActiveStep}
        />
      );

    case 6:
      return (
        <SuggestionPlanForm
          setActiveStep={setActiveStep}
        />
      );

    default:
      return (
        <DoctorDashboard
          setActiveStep={setActiveStep}
        />
      );
  }
}