import { GovernanceFormPanel } from '@/components/GovernanceFormPanel';

export const GovernanceSetupPage = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Setup</p>
        <h1 className="mt-1 text-3xl font-bold text-navy-900">Pengaturan Organisasi</h1>
      </div>

      <GovernanceFormPanel />
    </div>
  );
};
