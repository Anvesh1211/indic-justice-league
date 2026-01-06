import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    // TODO: Implement upload logic
    alert("File uploaded: " + (file ? file.name : "No file"));
  };

  return (
    <div className="mb-4">
      <input type="file" onChange={handleFileChange} />
      <button
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleUpload}
        disabled={!file}
      >
        Upload
      </button>
    </div>
  );
};

export default FileUpload;
