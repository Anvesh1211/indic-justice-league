import { AlertCircle, ShieldCheck } from "lucide-react";

export default function AIReport() {
  const contradictions = [
    { type: "Time", fir: "10:00 PM", witness: "8:00 PM", severity: "High", confidence: 94 },
    { type: "Location", fir: "Central Street", witness: "Market Road", severity: "Medium", confidence: 78 },
  ];

  return (
    <div className="min-h-screen bg-white p-12">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Contradiction Report</h1>
        <p className="text-slate-600 mb-8">Case ID: FIR-2026-001234</p>
        
        <div className="border border-slate-200 rounded-sm overflow-hidden mb-8">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">Contradiction Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">FIR Value</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">Witness Value</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">Confidence</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">Severity</th>
              </tr>
            </thead>
            <tbody>
              {contradictions.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-6 py-4 text-sm text-slate-900 border-b border-slate-200">{item.type}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-700 border-b border-slate-200">{item.fir}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-700 border-b border-slate-200">{item.witness}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 border-b border-slate-200">{item.confidence}%</td>
                  <td className="px-6 py-4 text-right border-b border-slate-200">
                    {item.severity === "High" && (
                      <span className="inline-flex items-center bg-red-50 border border-red-200 text-red-700 px-2 py-1 text-xs rounded-sm">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        High
                      </span>
                    )}
                    {item.severity === "Medium" && (
                      <span className="inline-flex items-center bg-amber-50 border border-amber-200 text-amber-700 px-2 py-1 text-xs rounded-sm">
                        {item.severity}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="border border-emerald-200 bg-emerald-50 rounded-sm p-4 flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-700">This AI report is cryptographically sealed and immutable on the blockchain.</p>
        </div>
      </div>
    </div>
  );
}
