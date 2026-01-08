import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';

type StepStatus = 'completed' | 'current' | 'upcoming' | 'error';

interface Step {
  id: string;
  name: string;
  description: string;
  status: StepStatus;
  timestamp?: string;
}

interface ChainOfCustodyStepperProps {
  steps: Step[];
  className?: string;
}

export const ChainOfCustodyStepper: React.FC<ChainOfCustodyStepperProps> = ({ 
  steps, 
  className = '' 
}) => {
  const getStepIcon = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
      case 'current':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-amber-600" />;
      default:
        return <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />;
    }
  };

  return (
    <div className={`border border-slate-200 bg-white p-6 ${className}`}>
      <h3 className="text-lg font-medium text-slate-900 mb-6">Chain of Custody</h3>
      
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {steps.map((step, stepIdx) => (
            <li key={step.id}>
              <div className="relative pb-8">
                {stepIdx !== steps.length - 1 ? (
                  <span 
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200"
                    aria-hidden="true"
                  />
                ) : null}
                
                <div className="relative flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white ring-8 ring-white">
                    {getStepIcon(step.status)}
                  </div>
                  
                  <div className="min-w-0 flex-1 pt-1.5">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${
                        step.status === 'completed' ? 'text-emerald-600' : 
                        step.status === 'error' ? 'text-amber-600' : 
                        'text-slate-900'
                      }`}>
                        {step.name}
                      </p>
                      {step.timestamp && (
                        <span className="text-xs text-slate-500 font-mono">
                          {step.timestamp}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Example usage:
/*
<ChainOfCustodyStepper
  steps={[
    {
      id: '1',
      name: 'Evidence Collected',
      description: 'Physical evidence collected and logged',
      status: 'completed',
      timestamp: '2023-11-15 09:30',
    },
    {
      id: '2',
      name: 'Digital Fingerprint',
      description: 'Creating cryptographic hash',
      status: 'current',
      timestamp: '2023-11-15 10:15',
    },
    {
      id: '3',
      name: 'Blockchain Anchored',
      description: 'Hash stored on blockchain',
      status: 'upcoming',
    },
  ]}
/>
*/
