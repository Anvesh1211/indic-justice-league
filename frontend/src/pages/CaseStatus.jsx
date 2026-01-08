import { CheckCircle2 } from "lucide-react";

export default function CaseStatus() {
  const steps = [
    { title: "Evidence Uploaded", timestamp: "2026-01-07 10:30:00", txHash: "0xABC123..." },
    { title: "Hash Generated", timestamp: "2026-01-07 10:31:15", txHash: "0xDEF456..." },
    { title: "Blockchain Anchored", timestamp: "2026-01-07 10:32:45", txHash: "0xGHI789..." },
    { title: "OCR Completed", timestamp: "2026-01-07 10:35:00", txHash: "0xJKL012..." },
  ];

  return (
    <div className="min-h-screen bg-white p-12">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Case Processing Status</h1>
        <p className="text-slate-600 mb-8">FIR-2026-001234</p>
        
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div key={idx} className="border border-slate-200 rounded-sm p-6 flex items-start space-x-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-medium text-slate-900 mb-1">{step.title}</h3>
                <p className="text-xs font-mono text-slate-600">TX: {step.txHash}</p>
                <p className="text-xs text-slate-500 mt-2">{step.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
