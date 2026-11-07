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
import { EvaluationPage } from '@/pages/EvaluationPage';
import { AuditLogPage } from '@/pages/AuditLogPage';

const publicRoutes = [
  <Route key="login" path="/login" element={<LoginPage />} />,
  <Route key="register" path="/register" element={<RegisterPage />} />,
  <Route key="waiting" path="/waiting-approval" element={<WaitingApprovalPage />} />,
];

const allApprovedRoles = [
  'super_admin',
  'ketua_ipnu',
  'ketua_ippnu',
  'wakil_ketua',
  'sekretaris',
  'bendahara',
  'koordinator_departemen',
  'anggota',
] as const;

const managementRoles = [
  'super_admin',
  'ketua_ipnu',
  'ketua_ippnu',
  'wakil_ketua',
  'sekretaris',
  'koordinator_departemen',
] as const;

const financeRoles = ['super_admin', 'sekretaris', 'bendahara'] as const;
const auditRoles = ['super_admin', 'sekretaris', 'bendahara'] as const;

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {publicRoutes}

        <Route element={<ProtectedRoute requireApproved allowedRoles={[...allApprovedRoles]} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/organization" element={<OrganizationProfilePage />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/kaderisasi" element={<KaderisasiPage />} />
          <Route path="/evaluations" element={<EvaluationPage />} />
        </Route>

        <Route element={<ProtectedRoute requireApproved allowedRoles={[...managementRoles]} />}>
          <Route path="/members" element={<MembersPage />} />
          <Route path="/governance" element={<GovernancePage />} />
          <Route path="/governance-setup" element={<GovernanceSetupPage />} />
          <Route path="/operations" element={<OperationsPage />} />
          <Route path="/administration" element={<AdministrationPage />} />
        </Route>

        <Route element={<ProtectedRoute requireApproved allowedRoles={[...financeRoles]} />}>
          <Route path="/finance" element={<FinancePage />} />
        </Route>

        <Route element={<ProtectedRoute requireApproved allowedRoles={[...auditRoles]} />}>
          <Route path="/audit-log" element={<AuditLogPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <Toaster position="top-right" richColors />
    </>
  );
}
