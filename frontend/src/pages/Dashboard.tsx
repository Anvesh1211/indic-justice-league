import React from 'react';
import { CaseSummaryPanel } from '../components/dashboard/CaseSummaryPanel';
import { EvidenceIntegrityStatus } from '../components/dashboard/EvidenceIntegrityStatus';
import { ChainOfCustodyStepper } from '../components/dashboard/ChainOfCustodyStepper';

const Dashboard: React.FC = () => {
  // Mock data - in a real app, this would come from your state management
  const caseData = {
    caseId: 'CASE-2023-001',
    firNumber: 'FIR/2023/001/ND',
    dateFiled: '2023-11-15',
    status: 'in_review' as const,
  };

  const evidenceData = {
    isVerified: true,
    lastVerified: '2023-11-15 14:30:45 UTC',
    totalEvidence: 12,
    verifiedEvidence: 12,
  };

  const custodySteps = [
    {
      id: '1',
      name: 'Evidence Collected',
      description: 'Physical evidence collected and logged',
      status: 'completed' as const,
      timestamp: '2023-11-15 09:30',
    },
    {
      id: '2',
      name: 'Digital Fingerprint',
      description: 'Cryptographic hashes generated',
      status: 'completed' as const,
      timestamp: '2023-11-15 10:15',
    },
    {
      id: '3',
      name: 'Blockchain Anchored',
      description: 'Hash stored on blockchain',
      status: 'completed' as const,
      timestamp: '2023-11-15 10:30',
    },
    {
      id: '4',
      name: 'AI Analysis',
      description: 'Evidence analysis completed',
      status: 'completed' as const,
      timestamp: '2023-11-15 14:30',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Judicial Overview</h1>
        <p className="text-slate-600">Case monitoring and evidence integrity dashboard</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-1">
          <CaseSummaryPanel
            caseId={caseData.caseId}
            firNumber={caseData.firNumber}
            dateFiled={caseData.dateFiled}
            status={caseData.status}
          />
          
          <div className="lg:hidden">
            <ChainOfCustodyStepper 
              steps={custodySteps}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-2">
          <EvidenceIntegrityStatus
            isVerified={evidenceData.isVerified}
            lastVerified={evidenceData.lastVerified}
            totalEvidence={evidenceData.totalEvidence}
            verifiedEvidence={evidenceData.verifiedEvidence}
          />

          <div className="hidden lg:block">
            <ChainOfCustodyStepper 
              steps={custodySteps}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
