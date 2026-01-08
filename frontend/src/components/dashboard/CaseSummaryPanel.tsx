import React from 'react';
import { Scale, FileSearch, ShieldCheck } from 'lucide-react';

interface CaseSummaryPanelProps {
  caseId: string;
  firNumber: string;
  dateFiled: string;
  status: 'pending' | 'in_review' | 'closed';
}

const statusStyles = {
  pending: 'bg-amber-100 text-amber-800',
  in_review: 'bg-blue-100 text-blue-800',
  closed: 'bg-emerald-100 text-emerald-800',
};

export const CaseSummaryPanel: React.FC<CaseSummaryPanelProps> = ({
  caseId,
  firNumber,
  dateFiled,
  status,
}) => {
  return (
    <div className="border border-slate-200 p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-slate-900">Case Summary</h2>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusStyles[status]}`}>
          {status.replace('_', ' ')}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <FileSearch className="h-5 w-5 text-slate-400 mr-3" />
          <div>
            <p className="text-sm text-slate-500">Case ID</p>
            <p className="font-mono text-slate-900">{caseId}</p>
          </div>
        </div>

        <div className="flex items-center">
          <ShieldCheck className="h-5 w-5 text-slate-400 mr-3" />
          <div>
            <p className="text-sm text-slate-500">FIR Number</p>
            <p className="font-mono text-slate-900">{firNumber}</p>
          </div>
        </div>

        <div className="flex items-center">
          <Scale className="h-5 w-5 text-slate-400 mr-3" />
          <div>
            <p className="text-sm text-slate-500">Date Filed</p>
            <p className="font-mono text-slate-900">{dateFiled}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
