import { useAuth } from "../context/AuthContext";
import { Upload } from "lucide-react";

export default function UploadCase() {
  const { user } = useAuth();
  
  if (user?.role !== "POLICE") {
    return (
      <div className="min-h-screen bg-gov-bg-muted p-12">
        <div className="text-center">
          <p className="text-slate-600">Access Denied. Police role required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gov-bg-muted p-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gov-primary mb-8 tracking-wide">Create New Case</h1>

        <form className="space-y-6 bg-white border border-gov-border rounded-xl p-8 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Case ID</label>
            <input
              type="text"
              placeholder="FIR-2026-001234"
              className="w-full border border-gov-border rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-gov-judicial-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">FIR Document</label>
            <input
              type="file"
              className="w-full border border-gov-border rounded-xl py-2 px-3 text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Evidence File</label>
            <input
              type="file"
              className="w-full border border-gov-border rounded-xl py-2 px-3 text-sm bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white border border-gov-judicial-blue text-gov-judicial-blue py-3 px-4 text-sm font-medium rounded-xl hover:bg-gov-panel-bg focus:outline-none focus:ring-2 focus:ring-gov-judicial-blue flex items-center justify-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Evidence</span>
          </button>

          <div className="border-t border-gov-border pt-6">
            <p className="text-sm text-slate-600 mb-2 font-medium">Status</p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-700">Evidence hashing & blockchain anchoring in progress…</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
