import PreConsultationDashboard from "../pages/PreConsultationDashboard";
import VitalsForm from "./VitalsForm";
import BriefHistoryForm from "./BriefHistoryForm";
import ProblemDescriptionForm from "./ProblemDescriptionForm";
import ObservationForm from "./ObservationForm";

export default function PreConsultationWizard({
  activeStep,
  setActiveStep,
}) {
  switch (activeStep) {
    case 0:
      return <PreConsultationDashboard />;

    case 1:
      return <VitalsForm />;

    case 2:
      return <BriefHistoryForm />;

    case 3:
      return <ProblemDescriptionForm />;

    case 4:
      return <ObservationForm />;

    default:
      return <PreConsultationDashboard />;
  }
}