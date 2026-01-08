import { ShieldCheck } from "lucide-react";

export default function CaseOverview() {
  const caseData = [
    { label: "FIR Hash", value: "0x7f8a9c4d2e1b5f9a...", status: "verified" },
    { label: "Blockchain TX", value: "0x3456789abcdef012...", status: "verified" },
    { label: "AI Report Hash", value: "0x9876543210fedcba...", status: "verified" },
  ];

  return (
    <div className="min-h-screen bg-gov-bg-muted p-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gov-primary mb-8 tracking-wide">Case Overview</h1>

        <div className="bg-white border border-gov-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full">
            <tbody>
              {caseData.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"} >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 w-1/3 border-b border-gov-border">{row.label}</td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-700 border-b border-gov-border">{row.value}</td>
                  <td className="px-6 py-4 text-right border-b border-gov-border">
                    {row.status === "verified" && (
                      <span className="inline-flex items-center space-x-1 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-1 text-xs rounded-xl">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
