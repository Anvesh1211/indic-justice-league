import React, { useState } from "react";
import { uploadFiles } from "../services/api";
import { Upload, FileText, CheckCircle, AlertTriangle, X } from 'lucide-react';

const FileUpload = ({ onFilesSelected }) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  const handleChange = (e) => {
    const inputFiles = e.target.files;
    handleFiles(inputFiles);
  };

  const handleFiles = (fileList) => {
    const validFiles = Array.from(fileList).filter(
      (file) =>
        file.type.startsWith("image/") ||
        file.type === "application/pdf" ||
        file.name.endsWith(".pdf")
    );

    if (validFiles.length > 0) {
      setFiles(validFiles);
      onFilesSelected?.(validFiles);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    try {
      setUploading(true);
      const result = await uploadFiles(files);
      setUploadedFiles(result.uploaded || []);
      setFiles([]);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
          dragActive
            ? "border-gov-judicial-blue bg-blue-50/30"
            : "border-gov-border bg-gov-bg-muted hover:border-gov-judicial-blue/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gov-judicial-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-gov-judicial-blue" />
          </div>
          <h3 className="text-lg font-semibold text-gov-primary mb-2">Upload Legal Documents</h3>
          <p className="text-sm text-slate-600 mb-4">Drag and drop files here, or click to browse</p>
          <p className="text-xs text-slate-500 mb-4">Supported formats: PDF, JPG, PNG (Max 10MB per file)</p>
          
          <input
            type="file"
            multiple
            onChange={handleChange}
            accept=".pdf,image/*"
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="inline-flex items-center px-6 py-3 bg-gov-judicial-blue text-white font-medium rounded-xl hover:bg-slate-800 cursor-pointer transition-all duration-200 shadow-sm"
          >
            <FileText className="w-4 h-4 mr-2" />
            Select Files
          </label>
        </div>
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="bg-white border border-gov-border rounded-xl overflow-hidden shadow-panel">
          <div className="bg-gov-panel-bg px-6 py-4 border-b border-gov-border">
            <h3 className="text-sm font-semibold text-gov-primary uppercase tracking-wide">
              Selected Files ({files.length})
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gov-bg-muted rounded-xl border border-gov-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gov-judicial-blue/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gov-judicial-blue" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gov-primary">{file.name}</p>
                      <p className="text-xs text-slate-500">
                        {(file.size / 1024).toFixed(2)} KB • {file.type || 'Unknown type'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const newFiles = files.filter((_, i) => i !== index);
                      setFiles(newFiles);
                    }}
                    className="text-slate-400 hover:text-red-600 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-6 py-3 bg-gov-emerald text-white font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm flex items-center"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Success */}
      {uploadedFiles.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 shadow-panel">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-emerald-800 uppercase tracking-wide mb-2">
                Upload Successful
              </h3>
              <p className="text-sm text-emerald-700 mb-3">
                {uploadedFiles.length} file(s) have been successfully uploaded and secured in the evidence vault.
              </p>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-200">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-800">{file.filename}</span>
                    </div>
                    <span className="text-xs text-emerald-600 font-mono">ID: {file.id || 'EVT-' + Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
