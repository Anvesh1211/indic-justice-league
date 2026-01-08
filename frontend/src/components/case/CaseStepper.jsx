import React from 'react';
import { Upload, Hash, Link2, FileCheck, Check, Clock, Shield } from 'lucide-react';

const steps = [
  { id: 'upload', label: 'Document Upload', icon: Upload, description: 'Upload legal documents and evidence' },
  { id: 'hash', label: 'Generate Hash', icon: Hash, description: 'Create cryptographic hash signatures' },
  { id: 'blockchain', label: 'Blockchain Storage', icon: Link2, description: 'Secure storage on distributed ledger' },
  { id: 'analysis', label: 'AI Analysis', icon: FileCheck, description: 'Automated contradiction detection' },
];

const StatusIcon = ({ status }) => {
  if (status === 'completed') {
    return <Check className="w-4 h-4 text-gov-emerald" />;
  } else if (status === 'in-progress') {
    return <div className="w-3 h-3 rounded-full bg-gov-judicial-blue animate-pulse" />;
  }
  return <Clock className="w-4 h-4 text-slate-300" />;
};

const CaseStepper = ({ currentStep = 'upload' }) => {
  const getStatus = (stepId) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'in-progress';
    return 'pending';
  };

  return (
    <div className="bg-white border border-gov-border rounded-xl overflow-hidden shadow-panel">
      <div className="bg-gov-panel-bg px-6 py-4 border-b border-gov-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gov-judicial-blue rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gov-primary tracking-wide">Case Processing Status</h3>
            <p className="text-xs text-slate-500 font-medium">Judicial Evidence Workflow</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gov-border -z-10">
            <div 
              className="bg-gov-judicial-blue h-full transition-all duration-500"
              style={{
                height: `${(steps.findIndex(step => step.id === currentStep) / (steps.length - 1)) * 100}%`
              }}
            />
          </div>
          
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => {
              const status = getStatus(step.id);
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex items-start">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mr-4 border-2 transition-all duration-200 ${
                    status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                    isCurrent ? 'bg-gov-judicial-blue text-white border-gov-judicial-blue shadow-lg' : 'bg-gov-bg-muted text-slate-400 border-gov-border'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-sm font-semibold tracking-wide ${
                          isCurrent ? 'text-gov-judicial-blue' : 'text-gov-primary'
                        }`}>
                          {step.label}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">{step.description}</p>
                      </div>
                      <div className="ml-4">
                        <StatusIcon status={status} />
                      </div>
                    </div>
                   
                    {status === 'completed' && (
                      <div className="mt-3 bg-gov-bg-muted border border-gov-border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-mono text-slate-600 break-all">
                              Transaction: 0x7f9a2b3c4d5e6f...3a4b
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date().toLocaleString()}
                            </p>
                          </div>
                          <Check className="w-4 h-4 text-gov-emerald" />
                        </div>
                      </div>
                    )}
                    
                    {isCurrent && (
                      <div className="mt-3 bg-gov-judicial-blue/5 border border-gov-judicial-blue/20 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gov-judicial-blue rounded-full animate-pulse"></div>
                          <p className="text-xs text-gov-judicial-blue font-medium">Processing...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStepper;
