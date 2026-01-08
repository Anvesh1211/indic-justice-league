import React from 'react';
import { FileText, AlertTriangle, Hash, Shield, Clock } from 'lucide-react';

const highlightText = (text, highlights = []) => {
  if (!highlights.length) return text;
  
  const parts = [];
  let lastIndex = 0;
  
  highlights.forEach((highlight, i) => {
    // Add text before the highlight
    if (highlight.start > lastIndex) {
      parts.push(text.substring(lastIndex, highlight.start));
    }
    
    // Add the highlighted text
    parts.push(
      <span key={i} className="bg-red-100 text-red-800 px-0.5 rounded-sm">
        {text.substring(highlight.start, highlight.end)}
      </span>
    );
    
    lastIndex = highlight.end;
  });
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts;
};

const EvidencePanel = ({ title, content, highlights = [], docId = '', className = '' }) => (
  <div className={`flex-1 flex flex-col ${className}`}>
    <div className="bg-gov-panel-bg border-b border-gov-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="w-4 h-4 text-gov-judicial-blue mr-2" />
          <h3 className="text-sm font-semibold text-gov-primary tracking-wide">{title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Hash className="w-3 h-3 text-slate-400" />
          <span className="text-xs text-slate-500 font-mono">{docId}</span>
        </div>
      </div>
    </div>
    <div className="p-4 overflow-y-auto flex-1 bg-white">
      {content ? (
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {highlightText(content, highlights)}
          </p>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-slate-400">
          <div className="text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">No document selected</p>
          </div>
        </div>
      )}
    </div>
  </div>
);

const ContradictionMarker = ({ contradiction, index }) => (
  <div className="absolute -right-2 -top-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
    <AlertTriangle className="w-3 h-3" />
  </div>
);

const EvidenceViewer = ({ leftDoc, rightDoc, contradictions = [] }) => {
  return (
    <div className="bg-white border border-gov-border rounded-xl overflow-hidden shadow-panel">
      {/* Header */}
      <div className="bg-gov-panel-bg px-6 py-4 border-b border-gov-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gov-judicial-blue rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gov-primary tracking-wide">Evidence Comparison</h3>
              <p className="text-xs text-slate-500 font-medium">Legal Document Analysis</p>
            </div>
          </div>
          
          {contradictions.length > 0 && (
            <div className="flex items-center text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-200">
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span className="font-medium">{contradictions.length} contradiction{contradictions.length !== 1 ? 's' : ''} detected</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Document Panels */}
      <div className="flex h-96">
        <div className="relative border-r border-gov-border">
          <EvidencePanel 
            title="FIR Document"
            content={leftDoc?.content}
            highlights={contradictions.map(c => c.left)}
            docId="FIR-2023-001"
            className="border-r border-gov-border"
          />
          {leftDoc && (
            <div className="absolute bottom-4 right-4 bg-white border border-gov-border rounded-xl px-3 py-2 shadow-panel">
              <div className="flex items-center space-x-2 mb-1">
                <Hash className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500 font-medium">Blockchain Hash</span>
              </div>
              <div className="font-mono text-xs text-slate-700 truncate max-w-48">{leftDoc.hash || '0x000...000'}</div>
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500">{new Date(leftDoc.date).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <EvidencePanel 
            title="Witness Statement"
            content={rightDoc?.content}
            highlights={contradictions.map(c => c.right)}
            docId="WIT-2023-045"
          />
          {rightDoc && (
            <div className="absolute bottom-4 right-4 bg-white border border-gov-border rounded-xl px-3 py-2 shadow-panel">
              <div className="flex items-center space-x-2 mb-1">
                <Hash className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500 font-medium">Blockchain Hash</span>
              </div>
              <div className="font-mono text-xs text-slate-700 truncate max-w-48">{rightDoc.hash || '0x000...000'}</div>
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500">{new Date(rightDoc.date).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Contradictions Summary */}
      {contradictions.length > 0 && (
        <div className="border-t border-gov-border bg-red-50/30">
          <div className="p-6">
            <h4 className="text-sm font-semibold text-gov-primary uppercase tracking-wide mb-4 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
              Detected Contradictions ({contradictions.length})
            </h4>
            <div className="space-y-3">
              {contradictions.map((contradiction, i) => (
                <div key={i} className="bg-white border border-red-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-red-700 font-semibold text-sm">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-sm text-gov-primary">Contradiction {i + 1}:</span>
                      <p className="text-sm text-slate-700 mt-1 leading-relaxed">{contradiction.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceViewer;
