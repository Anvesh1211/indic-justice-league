import React, { useState } from 'react';
import { FileText, Search, Filter, Download, Eye, Shield, Hash, Calendar, User, AlertTriangle, CheckCircle } from 'lucide-react';

const EvidenceVault = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  const evidenceItems = [
    {
      id: 'EVT-001',
      caseId: 'CASE-2023-001',
      title: 'First Information Report - Theft Case',
      type: 'FIR',
      uploadedBy: 'Officer Raj Kumar',
      uploadDate: '2024-01-08T14:30:00Z',
      status: 'verified',
      hash: '0x4a7d1ed414474e4033ac29cc0ff3d07700a3c3e0a9f7bca5c2c1a9b8f0d3e2f1',
      size: '2.4 MB',
      format: 'PDF',
      contradictions: 0
    },
    {
      id: 'EVT-002',
      caseId: 'CASE-2023-001',
      title: 'Witness Statement - Neighbor Testimony',
      type: 'Witness Statement',
      uploadedBy: 'Witness Protection Unit',
      uploadDate: '2024-01-08T15:45:00Z',
      status: 'verified',
      hash: '0x8b1a9953c4611296a827abf8c47804d7',
      size: '1.1 MB',
      format: 'PDF',
      contradictions: 2
    },
    {
      id: 'EVT-003',
      caseId: 'CASE-2023-002',
      title: 'Crime Scene Photographs',
      type: 'Photographic Evidence',
      uploadedBy: 'Forensic Team',
      uploadDate: '2024-01-07T10:20:00Z',
      status: 'pending',
      hash: '0x9c2e5f8a1b7d4c3e6a9f0b5d8e2c7a4',
      size: '15.7 MB',
      format: 'JPG',
      contradictions: 0
    },
    {
      id: 'EVT-004',
      caseId: 'CASE-2023-003',
      title: 'Medical Examination Report',
      type: 'Medical Report',
      uploadedBy: 'Dr. Sarah Johnson',
      uploadDate: '2024-01-06T16:15:00Z',
      status: 'verified',
      hash: '0x3f7a9b2c1e8d5f4a6b9c0d2e5f8a1b7',
      size: '3.2 MB',
      format: 'PDF',
      contradictions: 1
    },
    {
      id: 'EVT-005',
      caseId: 'CASE-2023-001',
      title: 'CCTV Footage - Location A',
      type: 'Video Evidence',
      uploadedBy: 'Technical Unit',
      uploadDate: '2024-01-05T09:30:00Z',
      status: 'flagged',
      hash: '0x6d4e8c2a5f9b1e7d3c0a8b5e2f9a4c1',
      size: '125.3 MB',
      format: 'MP4',
      contradictions: 3
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'flagged':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'flagged':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Shield className="w-4 h-4 text-slate-600" />;
    }
  };

  const filteredEvidence = evidenceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gov-border rounded-xl p-6 shadow-panel">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gov-judicial-blue rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gov-primary tracking-wide">Evidence Vault</h1>
            <p className="text-slate-500 font-medium">Secure Digital Evidence Management System</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gov-border rounded-xl p-4 shadow-panel">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Total Evidence</span>
            <FileText className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-gov-primary">{evidenceItems.length}</div>
          <div className="text-xs text-slate-500 mt-1">All cases</div>
        </div>

        <div className="bg-white border border-gov-border rounded-xl p-4 shadow-panel">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Verified</span>
            <CheckCircle className="w-4 h-4 text-gov-emerald" />
          </div>
          <div className="text-2xl font-bold text-gov-emerald">
            {evidenceItems.filter(e => e.status === 'verified').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Blockchain secured</div>
        </div>

        <div className="bg-white border border-gov-border rounded-xl p-4 shadow-panel">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Pending Review</span>
            <AlertTriangle className="w-4 h-4 text-gov-amber" />
          </div>
          <div className="text-2xl font-bold text-gov-amber">
            {evidenceItems.filter(e => e.status === 'pending').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Awaiting verification</div>
        </div>

        <div className="bg-white border border-gov-border rounded-xl p-4 shadow-panel">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Flagged</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">
            {evidenceItems.filter(e => e.status === 'flagged').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Requires attention</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border border-gov-border rounded-xl p-4 shadow-panel">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search evidence by title, case ID, or uploader..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gov-border rounded-xl bg-gov-bg-muted focus:ring-2 focus:ring-gov-judicial-blue focus:border-gov-judicial-blue text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gov-border rounded-xl bg-gov-bg-muted focus:ring-2 focus:ring-gov-judicial-blue focus:border-gov-judicial-blue text-sm"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>
        </div>
      </div>

      {/* Evidence Table */}
      <div className="bg-white border border-gov-border rounded-xl overflow-hidden shadow-panel">
        <div className="bg-gov-panel-bg px-6 py-4 border-b border-gov-border">
          <h2 className="text-lg font-semibold text-gov-primary tracking-wide flex items-center">
            <Shield className="w-5 h-5 mr-2 text-gov-judicial-blue" />
            Evidence Registry
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gov-bg-muted border-b border-gov-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gov-primary uppercase tracking-wide">
                  Evidence ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gov-primary uppercase tracking-wide">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gov-primary uppercase tracking-wide">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gov-primary uppercase tracking-wide">
                  Uploaded By
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gov-primary uppercase tracking-wide">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gov-primary uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gov-primary uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-border">
              {filteredEvidence.map((item) => (
                <tr key={item.id} className="hover:bg-gov-bg-muted/50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Hash className="w-3 h-3 text-slate-400" />
                      <span className="text-sm font-mono text-gov-primary">{item.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gov-primary">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.caseId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">{item.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="text-sm text-slate-600">{item.uploadedBy}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        {new Date(item.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(item.status)}
                      <span className={`px-2 py-1 rounded-lg border text-xs font-medium ${getStatusBadge(item.status)}`}>
                        {item.status.toUpperCase()}
                      </span>
                      {item.contradictions > 0 && (
                        <span className="text-xs text-red-600 font-medium">
                          {item.contradictions} conflict{item.contradictions !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedEvidence(item)}
                        className="p-2 text-gov-judicial-blue hover:bg-gov-judicial-blue/10 rounded-lg transition-colors duration-150"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-150"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEvidence.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No evidence found</p>
            <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Evidence Detail Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gov-panel-bg px-6 py-4 border-b border-gov-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gov-primary">Evidence Details</h3>
                <button
                  onClick={() => setSelectedEvidence(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Evidence ID</p>
                  <p className="text-sm font-mono text-gov-primary">{selectedEvidence.id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Status</p>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedEvidence.status)}
                    <span className={`px-2 py-1 rounded-lg border text-xs font-medium ${getStatusBadge(selectedEvidence.status)}`}>
                      {selectedEvidence.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Title</p>
                <p className="text-sm font-medium text-gov-primary">{selectedEvidence.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Type</p>
                  <p className="text-sm text-slate-600">{selectedEvidence.type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Format</p>
                  <p className="text-sm text-slate-600">{selectedEvidence.format}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Uploaded By</p>
                  <p className="text-sm text-slate-600">{selectedEvidence.uploadedBy}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Upload Date</p>
                  <p className="text-sm text-slate-600">
                    {new Date(selectedEvidence.uploadDate).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Blockchain Hash</p>
                <div className="flex items-center space-x-2">
                  <Hash className="w-3 h-3 text-slate-400" />
                  <p className="text-sm font-mono text-slate-600 break-all">{selectedEvidence.hash}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gov-border">
                <button
                  onClick={() => setSelectedEvidence(null)}
                  className="px-4 py-2 border border-gov-border text-slate-700 rounded-xl hover:bg-gov-bg-muted transition-colors duration-150"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-gov-judicial-blue text-white rounded-xl hover:bg-slate-800 transition-colors duration-150">
                  Download Evidence
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceVault;
