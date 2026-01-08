export default function AuditLog() {
  const logs = [
    { action: "Evidence Uploaded", actor: "Police Officer", timestamp: "2026-01-07 10:02:15", txRef: "0xABC123..." },
    { action: "SHA-256 Hashed", actor: "System", timestamp: "2026-01-07 10:02:45", txRef: "0xDEF456..." },
    { action: "Blockchain Anchored", actor: "System", timestamp: "2026-01-07 10:03:10", txRef: "0xGHI789..." },
    { action: "AI Analysis Started", actor: "System", timestamp: "2026-01-07 10:04:00", txRef: "0xJKL012..." },
    { action: "Report Generated", actor: "System", timestamp: "2026-01-07 10:05:30", txRef: "0xMNO345..." },
    { action: "Viewed by Prosecutor", actor: "Prosecutor", timestamp: "2026-01-07 10:45:20", txRef: "0xPQR678..." },
  ];

  return (
    <div className="min-h-screen bg-white p-12">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Audit Trail</h1>
        
        <div className="border border-slate-200 rounded-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">Action</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">Actor</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">Timestamp</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">Transaction Ref</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-6 py-4 text-sm text-slate-900 border-b border-slate-200">{log.action}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 border-b border-slate-200">{log.actor}</td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-700 border-b border-slate-200">{log.timestamp}</td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-600 border-b border-slate-200">{log.txRef}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
