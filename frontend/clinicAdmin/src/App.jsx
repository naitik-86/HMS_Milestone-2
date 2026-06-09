import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import StaffEnrollment from './pages/StaffEnrollment';
import DoctorDetails from './pages/DoctorDetails';
import LabTechnician from './pages/LabTechnician';
import Groomer from './pages/Groomer';
import KennelStaff from './pages/KennelStaff';
import ClinicSettings from './pages/ClinicSettings';
import Reports from './pages/Reports';

const pageMeta = {
  dashboard: { title: 'Dashboard', subtitle: 'Clinic Admin Panel · Friday, 5 June 2026' },
  staff: { title: 'Staff Enrollment', subtitle: 'Manage and enroll all clinic staff members' },
  doctors: { title: 'Doctor Details', subtitle: 'Manage doctor profiles, qualifications & registrations' },
  lab: { title: 'Lab Technician', subtitle: 'Manage lab staff qualifications & capabilities' },
  groomer: { title: 'Groomer', subtitle: 'Manage grooming staff & service capabilities' },
  kennel: { title: 'Kennel Staff', subtitle: 'Manage kennel staff & animal handling details' },
  settings: { title: 'Clinic Settings', subtitle: 'Configure clinic profile, prescriptions & notifications' },
  reports: { title: 'Reports & Analytics', subtitle: 'Clinic performance metrics & insights' },
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const meta = pageMeta[activePage];

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'staff': return <StaffEnrollment />;
      case 'doctors': return <DoctorDetails />;
      case 'lab': return <LabTechnician />;
      case 'groomer': return <Groomer />;
      case 'kennel': return <KennelStaff />;
      case 'settings': return <ClinicSettings />;
      case 'reports': return <Reports />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#F5F1EA', overflow: 'hidden' }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Header title={meta.title} subtitle={meta.subtitle} />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
