import { ShieldCheck } from "lucide-react";

export default function BlockchainVerify() {
  const verification = [
    { label: "Smart Contract", value: "0xABC123...EF0", status: "verified" },
    { label: "Evidence Hash", value: "0x7f8a9c4d2e1b5f9a...", status: "verified" },
    { label: "AI Report Hash", value: "0x3456789abcdef012...", status: "verified" },
    { label: "Block Number", value: "18234567", status: "verified" },
    { label: "Timestamp", value: "2026-01-07 10:32:45", status: "verified" },
  ];

  return (
    <div className="min-h-screen bg-white p-12">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Blockchain Verification</h1>
        
        <div className="border border-slate-200 rounded-sm overflow-hidden mb-8">
          <table className="w-full">
            <tbody>
              {verification.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 w-1/3 border-b border-slate-200">{row.label}</td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-700 border-b border-slate-200 flex-1">{row.value}</td>
                  <td className="px-6 py-4 text-right border-b border-slate-200">
                    {row.status === "verified" && (
                      <span className="inline-flex items-center space-x-1 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-1 text-xs rounded-sm">
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
        
        <div className="border border-emerald-200 bg-emerald-50 rounded-sm p-6">
          <h3 className="font-medium text-emerald-900 mb-2">Integrity Status</h3>
          <p className="text-sm text-emerald-700">All evidence items have been successfully anchored to the blockchain. No tampering detected.</p>
        </div>
      </div>
    </div>
  );
}
