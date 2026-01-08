import React, { useState } from 'react';
import jsPDF from 'jspdf';

const DiffView = ({ analysis, firText, witnessText, onBack }) => {
  // Use props if available, else fall back to mock data
  const safeFirText = firText || `FIRST INFORMATION REPORT... (Mock)`;
  const safeWitnessText = witnessText || `WITNESS STATEMENT... (Mock)`;

  // Parse discrepancies from analysis if available
  const discrepancies = analysis?.discrepancies || [];
  const similarityScore = analysis?.similarity_score ? (analysis.similarity_score * 100).toFixed(0) : "N/A";
  const confidenceScore = analysis?.confidence ? (analysis.confidence * 100).toFixed(0) : "N/A";
  
  // IPC Section Mapping (Simple Heuristic for Demo)
  const getIPCSections = (text) => {
    const ipcMapping = {
       "robbery": "Section 390",
       "theft": "Section 378",
       "murder": "Section 300",
       "hurt": "Section 319",
       "grievous hurt": "Section 320",
       "assault": "Section 351",
       "cheating": "Section 415"
    };
    
    const sections = new Set();
    const lowerText = text.toLowerCase();
    
    Object.keys(ipcMapping).forEach(keyword => {
        if (lowerText.includes(keyword)) {
            sections.add(`${ipcMapping[keyword]} (${keyword.toUpperCase()})`);
        }
    });

    return Array.from(sections);
  };

  const detectedIPC = getIPCSections(safeFirText);

  // PDF Generation Logic
  const handleGenerateReport = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42); // Judicial Blue
    doc.text("Nyaya-Drishti: Evidence Analysis Report", 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    
    // Summary
    doc.setDrawColor(0);
    doc.line(20, 35, 190, 35);
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text("Analysis Summary", 20, 45);
    
    doc.setFontSize(12);
    doc.text(`Similarity Score: ${similarityScore}%`, 20, 55);
    doc.text(`AI Confidence: ${confidenceScore}%`, 20, 65);
    
    // IPC Sections
    if (detectedIPC.length > 0) {
        doc.setFontSize(14);
        doc.text("Suggested IPC Sections", 20, 80);
        doc.setFontSize(12);
        detectedIPC.forEach((ipc, index) => {
            doc.text(`• ${ipc}`, 25, 90 + (index * 7));
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
    <div className="flex h-screen bg-paper-white font-sans text-slate-grey overflow-hidden">
      
      {/* 1. Sidebar Navigation (Left) */}
      <nav className="w-20 bg-judicial-blue flex flex-col items-center py-8 z-20 shadow-xl">
        <div className="mb-10 p-2 bg-paper-white/10 rounded-lg cursor-pointer" onClick={onBack}>
           {/* Back Arrow / Logo */}
           <svg className="w-8 h-8 text-paper-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </div>
        
        <div className="flex flex-col space-y-8">
            <div className="p-3 rounded-xl cursor-pointer transition-all bg-polygon-purple text-white shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            </div>
             <div className="p-3 rounded-xl cursor-pointer text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
             </div>
             <div className="p-3 rounded-xl cursor-pointer text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
        </div>
      </nav>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
            <div className="flex items-center space-x-4">
                <h1 className="font-serif text-2xl text-judicial-blue font-bold tracking-tight">Case #2024-881</h1>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold uppercase tracking-wider rounded-sm border border-green-200">
                    {analysis ? "Analysis Complete" : "Analysis Pending"}
                </span>
            </div>
            
            <div className="flex items-center space-x-4">
                 {/* IPC Tags in Header */}
                 {detectedIPC.length > 0 && (
                     <div className="flex space-x-2 mr-4">
                        {detectedIPC.map((ipc, idx) => (
                            <span key={idx} className="text-xs font-bold text-white bg-crimson-red px-2 py-1 rounded">
                                {ipc}
                            </span>
                        ))}
                     </div>
                 )}
                <span className="text-sm text-slate-500">Last updated: Just now</span>
                <div className="w-8 h-8 bg-judicial-blue rounded-full flex items-center justify-center text-white font-serif font-bold">JD</div>
            </div>
        </header>

        {/* Diff View Container */}
        <div className="flex-1 flex overflow-hidden p-6 gap-6 relative">
            
            {/* Visual Metaphor Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #0F172A 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            {/* Left Panel: FIR */}
            <div className="flex-1 bg-white rounded-none border border-gray-200 shadow-card flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h2 className="font-serif text-lg font-semibold text-judicial-blue">FIR Document</h2>
                    <span className="text-xs text-gray-400 font-mono">HASH: 0x7A...9F</span>
                </div>
                <div className="p-8 font-serif leading-relaxed text-gray-700 whitespace-pre-wrap flex-1 overflow-y-auto relative">
                    {safeFirText}
                </div>
            </div>

            {/* Center: Connectors (Visual Only for Mockup) */}
            <div className="w-12 flex flex-col items-center justify-center relative pointer-events-none">
                 <div className="absolute top-1/4 w-full h-px bg-crimson-red/20"></div>
                 <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 bg-paper-white border border-crimson-red rounded-full flex items-center justify-center z-10">
                        <span className="text-crimson-red text-xs">!</span>
                    </div>
                 </div>
                 <div className="absolute top-3/4 w-full h-px bg-crimson-red/20"></div>
            </div>

            {/* Right Panel: Witness Statement */}
            <div className="flex-1 bg-white rounded-none border border-gray-200 shadow-card flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h2 className="font-serif text-lg font-semibold text-judicial-blue">Witness Statements</h2>
                     <span className="text-xs text-gray-400 font-mono">HASH: 0x3B...2C</span>
                </div>
                <div className="p-8 font-serif leading-relaxed text-gray-700 whitespace-pre-wrap flex-1 overflow-y-auto">
                     {safeWitnessText}
                </div>
            </div>

            {/* 3. AI Insights Sidebar (Floating) */}
            <aside className="w-80 bg-judicial-blue text-paper-white shadow-2xl flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center space-x-2 text-polygon-purple mb-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        <span className="text-xs font-bold uppercase tracking-widest">AI Analysis</span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold">Insights Panel</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {discrepancies.length > 0 ? (
                        discrepancies.map((disc, i) => (
                             <InsightCard
                                key={i}
                                title={disc.source || "Discrepancy"}
                                severity="High"
                                desc={disc.details || disc}
                            />
                        ))
                    ) : (
                         <div className="text-sm text-gray-400">No major discrepancies found yet.</div>
                    )}
                    
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <h4 className="text-sm font-semibold text-gray-400 mb-4">CONSISTENCY SCORE</h4>
                        <div className="flex items-end space-x-2">
                            <span className="text-4xl font-bold text-white">{similarityScore}%</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1 mt-2 rounded-full overflow-hidden">
                            <div className="bg-crimson-red h-full" style={{ width: `${similarityScore}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-900 border-t border-white/5">
                    <button 
                        onClick={handleGenerateReport}
                        className="w-full py-3 bg-paper-white text-judicial-blue font-semibold hover:bg-gray-100 transition-colors uppercase text-sm tracking-wider"
                    >
                        Generate Report (PDF)
                    </button>
                </div>
            </aside>

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
