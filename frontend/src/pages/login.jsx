import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Scale } from "lucide-react";

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  function login(role) {
    setUser({ role });
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="border border-slate-200 rounded-sm p-12">
          {/* Header */}
          <div className="flex items-center justify-center mb-8">
            <Scale className="w-8 h-8 text-slate-900 mr-3" />
            <h1 className="text-2xl font-bold text-slate-900">Nyaya-Drishti</h1>
          </div>
          
          <p className="text-center text-slate-600 text-sm mb-8">
            Judicial Evidence Management System
          </p>

          {/* Role Selection */}
          <div className="space-y-4">
            <button
              onClick={() => login("POLICE")}
              className="w-full bg-white border border-slate-300 text-slate-900 py-3 px-4 text-sm font-medium rounded-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Login as Police
            </button>
            
            <button
              onClick={() => login("PROSECUTOR")}
              className="w-full bg-white border border-slate-300 text-slate-900 py-3 px-4 text-sm font-medium rounded-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Login as Prosecutor
            </button>
            
            <button
              onClick={() => login("JUDGE")}
              className="w-full bg-white border border-slate-300 text-slate-900 py-3 px-4 text-sm font-medium rounded-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Login as Judge
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-slate-500 text-xs mt-8">
            Secure system. For authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}