import React from 'react';

const TemplatePage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Template Page</h1>
        <p className="text-gray-600">This is a template page.</p>
      </div>
    </div>
  );
};

export default TemplatePage;
