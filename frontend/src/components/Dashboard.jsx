import React from "react";
import FileUpload from "./FileUpload";
import DiffView from "./DiffView";

const Dashboard = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Nyaya-Drishti Dashboard</h1>
      <FileUpload />
      <DiffView />
    </div>
  );
};

export default Dashboard;
