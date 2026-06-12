import { BrowserRouter, Routes, Route } from "react-router-dom";

import PreConsultationDashboard from "./pages/PreConsultationDashboard";
import PendingPets from "./pages/PendingPets";
import CompletedPets from "./pages/CompletedPets";
import HistoryPets from "./pages/HistoryPets";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PreConsultationDashboard />} />
        <Route path="/pending-pets" element={<PendingPets />} />
        <Route path="/completed-pets" element={<CompletedPets />} />
        <Route path="/history-pets" element={<HistoryPets />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;