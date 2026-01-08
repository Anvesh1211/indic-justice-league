import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FileSearch, Scale, Fingerprint, ShieldCheck } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const navigationItems = [
    { icon: Scale, label: "Dashboard", href: "#" },
    { icon: FileSearch, label: "Evidence Vault", href: "/case/1" },
    { icon: Fingerprint, label: "Analysis", href: "/analysis/1" },
    { icon: ShieldCheck, label: "Audit Trail", href: "/audit/1" },
  ];

  return (
    <div className="flex min-h-screen bg-gov-bg-muted">
      {/* Sidebar */}
      <aside className="w-72 border-r border-gov-border bg-gov-panel-bg shadow-panel">
        <nav className="p-6 space-y-8">
          <div className="flex items-center space-x-3 mb-6">
            <Scale className="w-6 h-6 text-gov-primary" />
            <span className="font-bold text-gov-primary tracking-wide">Nyaya-Drishti</span>
          </div>

          <div className="space-y-2">
            {navigationItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.href}
                className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl text-sm font-medium"
              >
                <item.icon className="w-4 h-4 text-slate-700" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Role Indicator */}
          <div className="border-t border-gov-border pt-6">
            <p className="text-xs text-slate-500 mb-2">Current Role</p>
            <div className="px-3 py-2 bg-white border border-gov-border rounded-xl text-sm font-medium text-slate-900">
              {user.role}
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gov-primary mb-2 tracking-wide">Dashboard</h1>
            <p className="text-slate-600">Welcome back, {user.role}</p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="bg-white border border-gov-border rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-medium text-slate-700 mb-2">Active Cases</h3>
              <p className="text-3xl font-bold text-gov-primary">12</p>
            </div>
            <div className="bg-white border border-gov-border rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-medium text-slate-700 mb-2">Evidence Items</h3>
              <p className="text-3xl font-bold text-gov-primary">234</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gov-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gov-primary mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/case/1"
                className="block px-4 py-3 border border-gov-border bg-white text-slate-900 text-sm font-medium rounded-xl hover:bg-slate-50"
              >
                View Latest Case
              </Link>
              <Link
                to="/audit/1"
                className="block px-4 py-3 border border-gov-border bg-white text-slate-900 text-sm font-medium rounded-xl hover:bg-slate-50"
              >
                View Audit Log
              </Link>
              {user.role === "POLICE" && (
                <Link
                  to="/upload"
                  className="block px-4 py-3 border border-gov-border bg-white text-slate-900 text-sm font-medium rounded-xl hover:bg-slate-50"
                >
                  Create New Case
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
