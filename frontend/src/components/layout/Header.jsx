import React from 'react';
import { Shield, Wifi } from 'lucide-react';

const Header = ({ activeRole }) => {
  const roleDisplay = {
    police: 'Police Officer',
    prosecutor: 'Public Prosecutor',
    judge: 'Honorable Judge'
  };

  return (
    <header className="bg-white border-b border-gov-border py-4 px-6 flex justify-between items-center shadow-panel-md">
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-gov-judicial-blue rounded-lg flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gov-primary tracking-wide">
            {roleDisplay[activeRole] || 'Dashboard'}
          </h2>
          <p className="text-xs text-slate-500 font-medium">Secure Judicial Portal</p>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-slate-600 bg-gov-bg-muted px-3 py-2 rounded-xl border border-gov-border">
            <Wifi className="w-4 h-4 mr-2 text-gov-emerald" />
            <span className="text-sm font-medium">System:</span>
            <span className="ml-1 font-semibold text-gov-emerald">Online</span>
          </div>

          <div className="flex items-center bg-white px-4 py-2 rounded-xl border border-gov-border shadow-sm">
            <Shield className="w-4 h-4 mr-2 text-gov-judicial-blue" />
            <span className="text-sm font-semibold text-slate-700">
              {activeRole === 'judge' ? 'Judicial Access' : 
               activeRole === 'prosecutor' ? 'Prosecution Access' : 'Law Enforcement Access'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gov-emerald rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-500 font-medium">Encrypted</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
