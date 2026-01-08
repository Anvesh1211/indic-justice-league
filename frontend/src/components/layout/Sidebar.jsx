import React from 'react';
import { BookOpen, FileText, Shield, Scale, Link2, Activity, LogOut } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: <BookOpen size={18} />, path: '/' },
  { name: 'Cases', icon: <FileText size={18} />, path: '/cases' },
  { name: 'Evidence Vault', icon: <Scale size={18} />, path: '/evidence' },
  { name: 'Audit Log', icon: <Activity size={18} />, path: '/audit' },
  { name: 'Blockchain Verify', icon: <Link2 size={18} />, path: '/verify' },
  { name: 'System Security', icon: <Shield size={18} />, path: '/security' },
];

const Sidebar = ({ activeRole, onRoleChange }) => {
  return (
    <div className="w-80 h-screen bg-white border-r border-gov-border flex flex-col shadow-panel">
      <div className="p-6 border-b border-gov-border bg-gov-panel-bg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gov-judicial-blue rounded-xl flex items-center justify-center">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gov-primary tracking-wide">Nyaya-Drishti</h1>
            <p className="text-xs text-slate-500 font-medium">Judicial Evidence System</p>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Current Role</label>
          <select 
            value={activeRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-full p-3 border border-gov-border rounded-xl text-sm bg-white focus:ring-2 focus:ring-gov-judicial-blue focus:border-gov-judicial-blue font-medium transition-all duration-200"
          >
            <option value="police">🚔 Police Officer</option>
            <option value="prosecutor">⚖️ Public Prosecutor</option>
            <option value="judge">🏛️ Honorable Judge</option>
          </select>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 px-3">Navigation</p>
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.path}
                className="flex items-center p-3 text-slate-700 hover:bg-gov-bg-muted rounded-xl text-sm font-medium transition-all duration-200 group"
              >
                <span className="mr-3 text-slate-500 group-hover:text-gov-judicial-blue transition-colors duration-200">{item.icon}</span>
                <span className="group-hover:text-gov-primary transition-colors duration-200">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gov-border bg-gov-panel-bg">
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">System Status</span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-gov-emerald rounded-full mr-1.5 animate-pulse"></span>
              Online
            </span>
          </div>
        </div>
        <button className="flex items-center w-full p-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl cursor-pointer transition-all duration-200 group">
          <LogOut size={18} className="mr-3 group-hover:scale-110 transition-transform duration-200" />
          <span className="text-sm font-medium">Secure Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
