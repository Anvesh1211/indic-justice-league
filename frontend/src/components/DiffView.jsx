import React, { useMemo } from "react";
import { FileText, AlertTriangle, CheckCircle, Info, Hash } from 'lucide-react';

const DiffView = ({ analysis, firText, witnessText }) => {
  const diffResults = useMemo(() => {
    // Simple diff algorithm - compare line by line
    const firLines = firText.split("\n");
    const witnessLines = witnessText.split("\n");

    const diffs = [];
    const maxLength = Math.max(firLines.length, witnessLines.length);

    for (let i = 0; i < maxLength; i++) {
      const firLine = firLines[i] || "";
      const witnessLine = witnessLines[i] || "";

      if (firLine !== witnessLine) {
        diffs.push({
          lineNumber: i + 1,
          firText: firLine,
          witnessText: witnessLine,
          isSame: false,
        });
      } else if (firLine) {
        diffs.push({
          lineNumber: i + 1,
          firText: firLine,
          witnessText: witnessLine,
          isSame: true,
        });
    }

    // Discrepancies
    const startY = detectedIPC.length > 0 ? 110 : 80;
    doc.setFontSize(14);
    doc.text("Identified Discrepancies", 20, startY);
    
    doc.setFontSize(10);
    let yPos = startY + 10;
    
    discrepancies.forEach((disc, i) => {
       const text = typeof disc === 'string' ? disc : disc.details || "Discrepancy detected";
       const splitText = doc.splitTextToSize(`${i+1}. ${text}`, 170);
       doc.text(splitText, 20, yPos);
       yPos += (splitText.length * 5) + 5; // spacing
    });
    
    // Blockchain Proof
    if (analysis?.tx_hash) {
       doc.setFontSize(10);
       doc.setTextColor(128); // Grey
       doc.text(`Blockchain Transaction Hash: ${analysis.tx_hash}`, 20, 280);
    }

    doc.save("Evidence_Analysis_Report.pdf");
  };
  
  return (
    <div className="bg-white border border-gov-border rounded-xl overflow-hidden shadow-panel">
      {/* Analysis Header */}
      <div className="bg-gov-panel-bg px-6 py-4 border-b border-gov-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gov-primary tracking-wide flex items-center">
            <FileText className="w-5 h-5 mr-2 text-gov-judicial-blue" />
            Document Analysis Results
          </h3>
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500 font-mono">Analysis ID: ANA-{Date.now().toString(36).toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6 border-b border-gov-border bg-gov-bg-muted/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gov-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Similarity Score</span>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Info className="w-4 h-4 text-gov-judicial-blue" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gov-primary">
              {(analysis?.similarity_score * 100 || 0).toFixed(1)}%
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {analysis?.similarity_score > 0.8 ? 'High Match' : analysis?.similarity_score > 0.5 ? 'Moderate Match' : 'Low Match'}
            </div>
          </div>

          <div className="bg-white border border-gov-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Discrepancies</span>
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-gov-amber" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gov-primary">
              {analysis?.discrepancies?.length || 0}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {analysis?.discrepancies?.length > 0 ? 'Requires Review' : 'No Issues Detected'}
            </div>
          </div>

          <div className="bg-white border border-gov-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Status</span>
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-gov-emerald" />
              </div>
            </div>
            <div className="text-lg font-bold text-gov-emerald">Verified</div>
            <div className="text-xs text-slate-500 mt-1">Blockchain Secured</div>
          </div>
        </div>
      </div>

      {/* Document Comparison */}
      <div className="p-6 border-b border-gov-border">
        <h4 className="text-sm font-semibold text-gov-primary uppercase tracking-wide mb-4">Side-by-Side Comparison</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-semibold text-gov-primary flex items-center">
                <FileText className="w-4 h-4 mr-2 text-gov-judicial-blue" />
                FIR Document
              </h5>
              <span className="text-xs text-slate-500 font-mono">DOC-001</span>
            </div>
            <div className="bg-gov-bg-muted border border-gov-border rounded-xl p-4 max-h-96 overflow-y-auto">
              {diffResults.map((diff, index) => (
                <div
                  key={index}
                  className={`py-2 px-3 text-sm font-mono border-b border-gov-border/50 last:border-0 ${
                    diff.isSame ? "bg-white" : "bg-red-50 border-l-4 border-l-red-400"
                  }`}
                >
                  <div className="flex items-start">
                    <span className="text-slate-400 font-mono text-xs w-12 flex-shrink-0">
                      {String(diff.lineNumber).padStart(3, '0')}
                    </span>
                    <span className={`flex-1 ${diff.isSame ? "text-slate-700" : "text-red-700 font-medium"}`}>
                      {diff.firText || <em className="text-slate-400 italic">[empty line]</em>}
                    </span>
                  </div>
                </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-semibold text-gov-primary flex items-center">
                <FileText className="w-4 h-4 mr-2 text-gov-emerald" />
                Witness Statement
              </h5>
              <span className="text-xs text-slate-500 font-mono">DOC-002</span>
            </div>
            <div className="bg-gov-bg-muted border border-gov-border rounded-xl p-4 max-h-96 overflow-y-auto">
              {diffResults.map((diff, index) => (
                <div
                  key={index}
                  className={`py-2 px-3 text-sm font-mono border-b border-gov-border/50 last:border-0 ${
                    diff.isSame ? "bg-white" : "bg-emerald-50 border-l-4 border-l-emerald-400"
                  }`}
                >
                  <div className="flex items-start">
                    <span className="text-slate-400 font-mono text-xs w-12 flex-shrink-0">
                      {String(diff.lineNumber).padStart(3, '0')}
                    </span>
                    <span className={`flex-1 ${diff.isSame ? "text-slate-700" : "text-emerald-700 font-medium"}`}>
                      {diff.witnessText || <em className="text-slate-400 italic">[empty line]</em>}
                    </span>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discrepancies */}
      {analysis?.discrepancies?.length > 0 && (
        <div className="p-6 border-b border-gov-border bg-amber-50/30">
          <h4 className="text-sm font-semibold text-gov-primary uppercase tracking-wide mb-4 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-gov-amber" />
            Identified Discrepancies ({analysis.discrepancies.length})
          </h4>
          <div className="space-y-3">
            {analysis.discrepancies.map((disc, index) => (
              <div key={index} className="bg-white border border-amber-200 rounded-xl p-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-amber-700 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{disc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analysis?.recommendations?.length > 0 && (
        <div className="p-6 bg-gov-bg-muted/30">
          <h4 className="text-sm font-semibold text-gov-primary uppercase tracking-wide mb-4 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-gov-emerald" />
            Judicial Recommendations ({analysis.recommendations.length})
          </h4>
          <div className="space-y-3">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="bg-white border border-gov-border rounded-xl p-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{rec}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-components
const InsightCard = ({ title, severity, desc }) => (
    <div className="bg-white/5 border border-white/10 p-4 rounded-sm hover:bg-white/10 transition-colors cursor-pointer group">
        <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-sm text-white group-hover:text-polygon-purple transition-colors truncate pr-2">{title}</h4>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${severity === 'High' ? 'border-crimson-red text-crimson-red' : 'border-yellow-500 text-yellow-500'}`}>
                {severity}
            </span>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
            {desc}
        </p>
    </div>
);

export default DiffView;
