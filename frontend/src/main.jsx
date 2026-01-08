import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import UploadCase from "./pages/UploadCase";
import CaseStatus from "./pages/CaseStatus";
import CaseOverview from "./pages/CaseOverview";
import EvidenceViewer from "./pages/EvidenceViewer";
import AIReport from "./pages/AIReport";
import BlockchainVerify from "./pages/BloackchainVerify";
import AuditLog from "./pages/AuditLog";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadCase />} />
        <Route path="/status/:id" element={<CaseStatus />} />
        <Route path="/case/:id" element={<CaseOverview />} />
        <Route path="/evidence/:id" element={<EvidenceViewer />} />
        <Route path="/analysis/:id" element={<AIReport />} />
        <Route path="/verify/:id" element={<BlockchainVerify />} />
        <Route path="/audit/:id" element={<AuditLog />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
