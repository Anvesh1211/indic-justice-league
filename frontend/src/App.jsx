import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import CaseStepper from './components/case/CaseStepper';
import EvidenceViewer from './components/evidence/EvidenceViewer';

// Mock data
const mockFIR = {
  id: 'FIR-2023-001',
  content: 'First Information Report registered on 15th November 2023 at 14:30 hours. The complainant reported a theft of valuable items from their residence while they were away. Estimated value of stolen items is approximately ₹2,50,000. The complainant suspects the involvement of a former employee who had access to the premises.',
  hash: '0x4a7d1ed414474e4033ac29cc0ff3d07700a3c3e0a9f7bca5c2c1a9b8f0d3e2f1',
  date: '2023-11-15T14:30:00Z'
};

const mockWitness = {
  id: 'WIT-2023-045',
  content: 'Witness statement recorded on 16th November 2023. The witness, a neighbor, reported seeing a suspicious individual matching the description of the former employee near the premises on the day of the incident. The witness mentioned the individual was carrying a large bag and appeared to be in a hurry.',
  hash: '0x8b1a9953c4611296a827abf8c47804d7',
  date: '2023-11-16T10:15:00Z'
};

const mockContradictions = [
  {
    left: { start: 200, end: 250 },
    right: { start: 180, end: 220 },
    description: 'Discrepancy in the estimated value of stolen items.'
  },
  {
    left: { start: 350, end: 380 },
    right: { start: 300, end: 350 },
    description: 'Timeline inconsistency regarding the suspect\'s presence.'
  }
];

function App() {
  const [activeRole, setActiveRole] = useState('police');
  const [currentStep, setCurrentStep] = useState('upload');

  return (
    <Router>
      <div className="flex h-screen bg-gov-bg-muted text-slate-800 font-sans">
        <Sidebar activeRole={activeRole} onRoleChange={setActiveRole} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header activeRole={activeRole} />
          
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 max-w-none">
              {/* Case Processing Stepper */}
              <CaseStepper currentStep={currentStep} />
              
              {/* Evidence Comparison */}
              <EvidenceViewer 
                leftDoc={mockFIR}
                rightDoc={mockWitness}
                contradictions={mockContradictions}
              />
              
              {/* Action Buttons based on Role */}
              <div className="flex justify-end space-x-3 mt-8">
                {activeRole === 'police' && (
                  <>
                    <button 
                      onClick={() => setCurrentStep('hash')}
                      className="px-6 py-2.5 bg-gov-judicial-blue text-white text-sm font-medium rounded-xl hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-judicial-blue focus:ring-offset-2 transition-colors duration-200"
                    >
                      Process Evidence
                    </button>
                    <button className="px-6 py-2.5 border border-gov-border bg-white text-slate-700 text-sm font-medium rounded-xl hover:bg-gov-bg-muted focus:outline-none focus:ring-2 focus:ring-gov-judicial-blue focus:ring-offset-2 transition-colors duration-200">
                      Upload New Document
                    </button>
                  </>
                )}
                
                {activeRole === 'judge' && (
                  <button className="px-6 py-2.5 bg-gov-emerald text-white text-sm font-medium rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-gov-emerald focus:ring-offset-2 transition-colors duration-200">
                    Verify Chain of Custody
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
