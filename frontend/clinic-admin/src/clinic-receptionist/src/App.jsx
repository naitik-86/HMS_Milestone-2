import { useState } from "react";

import ReceptionSidebar from "./components/ReceptionSidebar";

import ReceptionDashboard from "./pages/ReceptionDashboard";
import NewRegistrationPet from "./pages/NewRegistrationPet";
import ExistingCustomerPet from "./pages/ExistingCustomerPet";
import PetHistory from "./pages/PetHistory";

function App() {
  const [activePage, setActivePage] =
    useState("dashboard");

  return (
    <div className="flex">

      <ReceptionSidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="flex-1 bg-slate-100 min-h-screen">

        {activePage ===
          "dashboard" && (
          <ReceptionDashboard />
        )}

        {activePage ===
          "new-registration" && (
          <NewRegistrationPet />
        )}

        {activePage ===
          "existing-customer" && (
          <ExistingCustomerPet />
        )}

        {activePage ===
          "history" && (
          <PetHistory />
        )}

      </div>
    </div>
  );
}

export default App;