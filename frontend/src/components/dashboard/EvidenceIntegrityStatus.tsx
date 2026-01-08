import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface EvidenceIntegrityStatusProps {
  isVerified: boolean;
  lastVerified: string;
  totalEvidence: number;
  verifiedEvidence: number;
}

export const EvidenceIntegrityStatus: React.FC<EvidenceIntegrityStatusProps> = ({
  isVerified,
  lastVerified,
  totalEvidence,
  verifiedEvidence,
}) => {
  return (
    <div className={`border ${isVerified ? 'border-emerald-200' : 'border-amber-200'} p-6 bg-white`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-slate-900">Evidence Integrity</h3>
          <p className="text-sm text-slate-500 mt-1">
            Last verified: <span className="font-mono">{lastVerified}</span>
          </p>
        </div>
        
        {isVerified ? (
          <div className="flex items-center text-emerald-600">
            <CheckCircle2 className="h-6 w-6 mr-2" />
            <span className="font-medium">INTEGRITY VERIFIED</span>
          </div>
        ) : (
          <div className="flex items-center text-amber-600">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span className="font-medium">VERIFICATION PENDING</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm text-slate-600 mb-1">
          <span>Evidence Processed</span>
          <span>{verifiedEvidence} of {totalEvidence} items</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full ${isVerified ? 'bg-emerald-500' : 'bg-amber-500'}`}
            style={{ width: `${(verifiedEvidence / totalEvidence) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
