import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './features/dashboard/Dashboard';
import StaffEnrollment from './features/staff/StaffEnrollment';
import DoctorDetails from './features/doctors/DoctorDetails';
import LabTechnician from './features/lab/LabTechnician';
import Groomer from './features/groomer/Groomer';
import KennelStaff from './features/kennel/KennelStaff';
import ClinicSettings from './features/settings/ClinicSettings';
import Reports from './features/reports/Reports';

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

const pages = {
  dashboard: Dashboard, staff: StaffEnrollment, doctors: DoctorDetails,
  lab: LabTechnician, groomer: Groomer, kennel: KennelStaff,
  settings: ClinicSettings, reports: Reports,
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const meta = pageMeta[activePage];
  const Page = pages[activePage] || Dashboard;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#F5F1EA', overflow: 'hidden' }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Header title={meta.title} subtitle={meta.subtitle} />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Page />
        </div>
      </div>
    </div>
  );
}
