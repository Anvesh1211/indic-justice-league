import React from 'react';
import { Clock, User, Shield, FileText, CheckCircle, AlertTriangle, Hash } from 'lucide-react';

const AuditTrail = () => {
  const auditEvents = [
    {
      id: 'AUD-001',
      timestamp: '2024-01-08T14:30:00Z',
      type: 'document_upload',
      user: 'Officer Raj Kumar',
      role: 'Police',
      action: 'Uploaded FIR Document',
      details: 'FIR-2023-001 uploaded and hashed to blockchain',
      status: 'success',
      documentId: 'FIR-2023-001',
      hash: '0x4a7d1ed414474e4033ac29cc0ff3d07700a3c3e0a9f7bca5c2c1a9b8f0d3e2f1'
    },
    {
      id: 'AUD-002',
      timestamp: '2024-01-08T15:45:00Z',
      type: 'document_upload',
      user: 'Witness Protection Unit',
      role: 'System',
      action: 'Witness Statement Recorded',
      details: 'WIT-2023-045 statement uploaded and verified',
      status: 'success',
      documentId: 'WIT-2023-045',
      hash: '0x8b1a9953c4611296a827abf8c47804d7'
    },
    {
      id: 'AUD-003',
      timestamp: '2024-01-08T16:20:00Z',
      type: 'analysis',
      user: 'AI Analysis Engine',
      role: 'System',
      action: 'Document Analysis Completed',
      details: 'Detected 2 contradictions between FIR and witness statement',
      status: 'warning',
      documentId: 'ANA-001'
    },
    {
      id: 'AUD-004',
      timestamp: '2024-01-08T17:10:00Z',
      type: 'verification',
      user: 'Judge Sharma',
      role: 'Judiciary',
      action: 'Chain of Custody Verified',
      details: 'Verified integrity of evidence documents',
      status: 'success',
      documentId: 'VER-001'
    },
    {
      id: 'AUD-005',
      timestamp: '2024-01-08T18:00:00Z',
      type: 'access',
      user: 'Prosecutor Mehta',
      role: 'Prosecution',
      action: 'Evidence Accessed',
      details: 'Accessed case file for review',
      status: 'success',
      documentId: 'CASE-001'
    }
  ];

  const getEventIcon = (type, status) => {
    switch (type) {
      case 'document_upload':
        return <FileText className="w-4 h-4" />;
      case 'analysis':
        return <AlertTriangle className="w-4 h-4" />;
      case 'verification':
        return <CheckCircle className="w-4 h-4" />;
      case 'access':
        return <User className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-gov-emerald bg-emerald-50 border-emerald-200';
      case 'warning':
        return 'text-gov-amber bg-amber-50 border-amber-200';
      case 'error':
        return 'text-gov-rose-muted bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Police':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Judiciary':
        return 'bg-gov-judicial-blue/10 text-gov-judicial-blue border-gov-judicial-blue/30';
      case 'Prosecution':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'System':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gov-border rounded-xl p-6 shadow-panel">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gov-judicial-blue rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gov-primary tracking-wide">Audit Trail</h1>
            <p className="text-slate-500 font-medium">Complete System Activity Log</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-gov-border rounded-xl overflow-hidden shadow-panel">
        <div className="bg-gov-panel-bg px-6 py-4 border-b border-gov-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gov-primary tracking-wide flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gov-judicial-blue" />
              System Activity Timeline
            </h2>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-gov-emerald" />
              <span className="text-sm text-slate-600 font-medium">Immutable Blockchain Records</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gov-border"></div>
            
            {/* Events */}
            <div className="space-y-6">
              {auditEvents.map((event, index) => (
                <div key={event.id} className="relative flex items-start">
                  {/* Timeline Dot */}
                  <div className={`absolute left-6 w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center ${getStatusColor(event.status)}`}>
                    {getEventIcon(event.type, event.status)}
                  </div>
                  
                  {/* Event Content */}
                  <div className="ml-16 flex-1">
                    <div className="bg-gov-bg-muted border border-gov-border rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-slate-500" />
                            <span className="font-semibold text-gov-primary">{event.user}</span>
                          </div>
                          <div className={`px-2 py-1 rounded-lg border text-xs font-medium ${getRoleBadgeColor(event.role)}`}>
                            {event.role}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500 font-mono">{event.id}</div>
                          <div className="text-xs text-slate-500">
                            {new Date(event.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-gov-primary">{event.action}</span>
                          <div className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                            {event.status.toUpperCase()}
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-600 leading-relaxed">{event.details}</p>
                        
                        {event.documentId && (
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <div className="flex items-center space-x-1">
                              <FileText className="w-3 h-3" />
                              <span>Document: {event.documentId}</span>
                            </div>
                            {event.hash && (
                              <div className="flex items-center space-x-1">
                                <Hash className="w-3 h-3" />
                                <span className="font-mono truncate max-w-48">{event.hash}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gov-border rounded-xl p-4 shadow-panel">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Total Events</span>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-gov-primary">{auditEvents.length}</div>
          <div className="text-xs text-slate-500 mt-1">Last 24 hours</div>
        </div>

        <div className="bg-white border border-gov-border rounded-xl p-4 shadow-panel">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Successful</span>
            <CheckCircle className="w-4 h-4 text-gov-emerald" />
          </div>
          <div className="text-2xl font-bold text-gov-emerald">
            {auditEvents.filter(e => e.status === 'success').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Completed</div>
        </div>

        <div className="bg-white border border-gov-border rounded-xl p-4 shadow-panel">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Warnings</span>
            <AlertTriangle className="w-4 h-4 text-gov-amber" />
          </div>
          <div className="text-2xl font-bold text-gov-amber">
            {auditEvents.filter(e => e.status === 'warning').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Needs attention</div>
        </div>

        <div className="bg-white border border-gov-border rounded-xl p-4 shadow-panel">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Active Users</span>
            <User className="w-4 h-4 text-gov-judicial-blue" />
          </div>
          <div className="text-2xl font-bold text-gov-primary">
            {[...new Set(auditEvents.map(e => e.user))].length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Unique participants</div>
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
