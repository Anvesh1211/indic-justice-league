import React from "react";
import FileUpload from "./FileUpload";
import { uploadFiles, analyzeDocuments } from "../services/api";

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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Nyaya-Drishti Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Legal Evidence Analysis & Verification System
      </p>

      {/* Upload Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upload Documents</h2>
        <FileUpload onFilesSelected={handleFileUpload} />
      </div>

      {/* Text Input Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Text Input</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">FIR Text</label>
            <textarea
              placeholder="Paste the First Information Report text here..."
              value={firText}
              onChange={(e) => setFirText(e.target.value)}
              rows="10"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Witness Statement Text
            </label>
            <textarea
              placeholder="Paste the witness statement text here..."
              value={witnessText}
              onChange={(e) => setWitnessText(e.target.value)}
              rows="10"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Documents"}
          </button>
          <button
            onClick={handleClear}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
