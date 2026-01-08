import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import DiffView from "./components/DiffView";
import "./App.css";

function App() {
  const [view, setView] = useState("dashboard"); // 'dashboard' | 'results'
  const [analysisCheck, setAnalysisCheck] = useState(null);
  const [firData, setFirData] = useState("");
  const [witnessData, setWitnessData] = useState("");

  const handleAnalysisComplete = (result, fir, witness) => {
    setAnalysisCheck(result);
    setFirData(fir);
    setWitnessData(witness);
    setView("results");
  };

  const handleBack = () => {
    setView("dashboard");
    setAnalysisCheck(null);
  }

  return (
    <div className="min-h-screen bg-paper-white">
      {view === "dashboard" && (
        <Dashboard onAnalysisComplete={handleAnalysisComplete} />
      )}
      {view === "results" && (
        <DiffView 
            analysis={analysisCheck}
            firText={firData} 
            witnessText={witnessData} 
            onBack={handleBack}
        />
      )}
    </div>
  );
}

export default App;
