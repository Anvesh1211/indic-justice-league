import React from "react";
import FileUpload from "./FileUpload";
import DiffView from "./DiffView";
import { analyzeDocuments } from "../services/api";
import { BookOpen, FileText, AlertTriangle, CheckCircle, Clock, Users, Shield } from 'lucide-react';

const Dashboard = ({ onAnalysisComplete }) => {
  const [firText, setFirText] = React.useState("");
  const [witnessText, setWitnessText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleFileUpload = async (files) => {
    try {
      setLoading(true);
      setError(null);
      
      const fileArray = Array.from(files);
      const result = await uploadFiles(fileArray);
      
      if (result.status === "success" && result.uploaded.length > 0) {
        // Simple heuristic: First file -> FIR, Second -> Witness
        // In a real app, we'd asking the user to tag them
        if (result.uploaded[0]) setFirText(result.uploaded[0].text);
        if (result.uploaded[1]) setWitnessText(result.uploaded[1].text);
      }
      
    } catch (err) {
      setError("Failed to upload files: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!firText.trim() || !witnessText.trim()) {
      setError("Please enter both FIR and witness statement text");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await analyzeDocuments(firText, witnessText);
      if (onAnalysisComplete) {
        onAnalysisComplete(result, firText, witnessText);
      }
    } catch (err) {
      setError("Failed to analyze documents: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFirText("");
    setWitnessText("");
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-white border border-gov-border rounded-xl p-6 shadow-panel">
        <div className="flex items-center space-x-4 mb-2">
          <div className="w-12 h-12 bg-gov-judicial-blue rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gov-primary tracking-wide">Judicial Dashboard</h1>
            <p className="text-slate-500 font-medium">Legal Evidence Analysis & Verification System</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gov-border rounded-xl p-6 shadow-panel">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-gov-judicial-blue" />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Active</span>
          </div>
          <div className="text-2xl font-bold text-gov-primary">24</div>
          <div className="text-sm text-slate-600 font-medium mt-1">Active Cases</div>
          <div className="text-xs text-gov-emerald font-medium mt-2">+3 this week</div>
        </div>

        <div className="bg-white border border-gov-border rounded-xl p-6 shadow-panel">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-gov-emerald" />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Verified</span>
          </div>
          <div className="text-2xl font-bold text-gov-primary">156</div>
          <div className="text-sm text-slate-600 font-medium mt-1">Evidence Items</div>
          <div className="text-xs text-gov-emerald font-medium mt-2">All secured</div>
        </div>

        <div className="bg-white border border-gov-border rounded-xl p-6 shadow-panel">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-gov-amber" />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Pending</span>
          </div>
          <div className="text-2xl font-bold text-gov-primary">8</div>
          <div className="text-sm text-slate-600 font-medium mt-1">Reviews</div>
          <div className="text-xs text-gov-amber font-medium mt-2">2 urgent</div>
        </div>

        <div className="bg-white border border-gov-border rounded-xl p-6 shadow-panel">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-gov-rose-muted" />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Alerts</span>
          </div>
          <div className="text-2xl font-bold text-gov-primary">2</div>
          <div className="text-sm text-slate-600 font-medium mt-1">Contradictions</div>
          <div className="text-xs text-gov-rose-muted font-medium mt-2">Requires review</div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white border border-gov-border rounded-xl overflow-hidden shadow-panel">
        <div className="bg-gov-panel-bg px-6 py-4 border-b border-gov-border">
          <h2 className="text-lg font-semibold text-gov-primary tracking-wide flex items-center">
            <FileText className="w-5 h-5 mr-2 text-gov-judicial-blue" />
            Document Upload & Analysis
          </h2>
        </div>
        <div className="p-6">
          <FileUpload onFilesSelected={handleFileUpload} />
        </div>
      </div>

      {/* Text Input Section */}
      <div className="bg-white border border-gov-border rounded-xl overflow-hidden shadow-panel">
        <div className="bg-gov-panel-bg px-6 py-4 border-b border-gov-border">
          <h2 className="text-lg font-semibold text-gov-primary tracking-wide">Manual Text Entry</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">FIR Text</label>
              <textarea
                placeholder="Paste the First Information Report text here..."
                value={firText}
                onChange={(e) => setFirText(e.target.value)}
                rows="12"
                className="w-full p-4 border border-gov-border rounded-xl bg-gov-bg-muted focus:ring-2 focus:ring-gov-judicial-blue focus:border-gov-judicial-blue font-mono text-sm leading-relaxed transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Witness Statement</label>
              <textarea
                placeholder="Paste the witness statement text here..."
                value={witnessText}
                onChange={(e) => setWitnessText(e.target.value)}
                rows="12"
                className="w-full p-4 border border-gov-border rounded-xl bg-gov-bg-muted focus:ring-2 focus:ring-gov-judicial-blue focus:border-gov-judicial-blue font-mono text-sm leading-relaxed transition-all duration-200"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-6 py-3 bg-gov-judicial-blue text-white font-medium rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              {loading ? "Analyzing..." : "Analyze Documents"}
            </button>
            <button
              onClick={handleClear}
              disabled={loading}
              className="px-6 py-3 border border-gov-border bg-white text-slate-700 font-medium rounded-xl hover:bg-gov-bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-panel">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-red-800 uppercase tracking-wide">System Error</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {analysis && (
        <div className="bg-white border border-gov-border rounded-xl overflow-hidden shadow-panel">
          <div className="bg-gov-panel-bg px-6 py-4 border-b border-gov-border">
            <h2 className="text-lg font-semibold text-gov-primary tracking-wide flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-gov-emerald" />
              Analysis Results
            </h2>
          </div>
          <div className="p-6">
            <DiffView
              analysis={analysis}
              firText={firText}
              witnessText={witnessText}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
