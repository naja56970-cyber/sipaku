import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardPage } from '@/pages/DashboardPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { WaitingApprovalPage } from '@/pages/WaitingApprovalPage';
import { OrganizationProfilePage } from '@/pages/OrganizationProfilePage';
import { MembersPage } from '@/pages/MembersPage';
import { GovernancePage } from '@/pages/GovernancePage';
import { GovernanceSetupPage } from '@/pages/GovernanceSetupPage';
import { OperationsPage } from '@/pages/OperationsPage';
import { AgendaPage } from '@/pages/AgendaPage';
import { AdministrationPage } from '@/pages/AdministrationPage';
import { FinancePage } from '@/pages/FinancePage';
import { KaderisasiPage } from '@/pages/KaderisasiPage';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/waiting-approval" element={<WaitingApprovalPage />} />
        <Route element={<ProtectedRoute requireApproved />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/organization" element={<OrganizationProfilePage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/governance" element={<GovernancePage />} />
          <Route path="/governance-setup" element={<GovernanceSetupPage />} />
          <Route path="/operations" element={<OperationsPage />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/administration" element={<AdministrationPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/kaderisasi" element={<KaderisasiPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}
