export default function EvidenceViewer() {
  return (
    <div className="min-h-screen bg-gov-bg-muted p-12">
      <h1 className="text-3xl font-bold text-gov-primary mb-8 tracking-wide">Evidence Viewer</h1>

      <div className="grid grid-cols-2 gap-8">
        {/* FIR */}
        <div className="bg-white border border-gov-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">FIR Document</h3>
          <div className="prose prose-sm text-slate-700 space-y-3">
            <p><strong>Incident Date:</strong> 2026-01-05</p>
            <p><strong>Time:</strong> 10:00 PM</p>
            <p><strong>Location:</strong> Central Street, District Court</p>
            <p><strong>Description:</strong> Evidence tampering investigation initiated at 10 PM on the incident site.</p>
          </div>
        </div>

        {/* Witness Statement */}
        <div className="bg-white border border-gov-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Witness Statement</h3>
          <div className="prose prose-sm text-slate-700 space-y-3">
            <p><strong>Witness Name:</strong> John Doe</p>
            <p><strong>Statement Time:</strong> 8:00 PM</p>
            <p><strong>Description:</strong> Witness observed initial incident at 8 PM, earlier than FIR report.</p>
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl mt-4">
              <p className="text-rose-700 text-sm">⚠ AI Analysis: Time discrepancy detected. Confidence: 94%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
