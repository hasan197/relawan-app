import React from 'react';

const OfflinePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-6xl mb-4">📵</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Anda Sedang Offline</h1>
        <p className="text-gray-600 mb-6">
          Maaf, sepertinya Anda sedang tidak terhubung ke internet. 
          Silakan periksa koneksi Anda dan coba lagi.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Muat Ulang Halaman
        </button>
      </div>
    </div>
  );
};

export default OfflinePage;
