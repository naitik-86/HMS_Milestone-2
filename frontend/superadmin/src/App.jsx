import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import Clinics from "./pages/Clinics";
// import Doctors from "./pages/Doctors";
// import Plans from "./pages/Plans";
import AdminLayout from "./layouts/AdminLayout";

import {
  Settings,
  Plans,
  Clinics,
  Dashboard,
  Doctors,
  Verification,
  Reports
} from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="clinics" element={<Clinics />} />
          <Route path="Veterinarian" element={<Doctors />} />
          <Route path="plans" element={<Plans />} />
          <Route path="reports" element={<Reports />} />
          <Route path="verification" element={<Verification />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;