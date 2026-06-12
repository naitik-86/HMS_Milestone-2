
import {
  VitalsForm,
  BriefHistoryForm,
  ProblemDescriptionForm,
  ObservationForm
} from "../../components"

import { PreConsultationDashboard } from "../../pages"

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