import React, { useState, useEffect } from "react";
import { Archive, RefreshCw, Download, AlertCircle } from "lucide-react";

const BackupRestore = () => {
  const [backupStatus, setBackupStatus] = useState({
    hasBackup: false,
    lastBackupDate: null,
    backupSize: null,
    isRunning: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock backup status loading
    setTimeout(() => {
      setBackupStatus({
        hasBackup: true,
        lastBackupDate: new Date().toISOString(),
        backupSize: "245.8 MB",
        isRunning: false
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleBackup = async () => {
    setBackupStatus(prev => ({ ...prev, isRunning: true }));
    
    // Mock backup process
    setTimeout(() => {
      setBackupStatus({
        hasBackup: true,
        lastBackupDate: new Date().toISOString(),
        backupSize: "247.2 MB",
        isRunning: false
      });
    }, 3000);
  };

  const handleRestore = async () => {
    if (!backupStatus.hasBackup) return;
    
    if (window.confirm("Are you sure you want to restore from the latest backup? This will overwrite current data.")) {
      // Mock restore process
      setTimeout(() => {
        alert("Restore completed successfully!");
      }, 2000);
    }
  };

  const handleDownload = () => {
    // Mock download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `backup_${new Date().toISOString().split('T')[0]}.zip`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Backup & Restore</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Archive className="h-4 w-4" />
          System Backup
        </div>
      </div>

      {/* Backup Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
              backupStatus.hasBackup ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Archive className={`h-8 w-8 ${backupStatus.hasBackup ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <p className="font-semibold text-gray-900">
              {backupStatus.hasBackup ? 'Backup Available' : 'No Backup'}
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <RefreshCw className="h-8 w-8 text-blue-600" />
            </div>
            <p className="font-semibold text-gray-900">
              {backupStatus.lastBackupDate 
                ? new Date(backupStatus.lastBackupDate).toLocaleDateString()
                : 'Never'
              }
            </p>
            <p className="text-sm text-gray-600">Last Backup</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <Download className="h-8 w-8 text-purple-600" />
            </div>
            <p className="font-semibold text-gray-900">
              {backupStatus.backupSize || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">Backup Size</p>
          </div>
        </div>
      </div>

      {/* Backup Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Create Backup</h4>
            <p className="text-gray-600 text-sm mb-4">
              Create a complete backup of all system data including users, internships, and configurations.
            </p>
            <button
              onClick={handleBackup}
              disabled={backupStatus.isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {backupStatus.isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white border-t-transparent"></div>
                  Creating Backup...
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4" />
                  Create Backup
                </>
              )}
            </button>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Restore Backup</h4>
            <p className="text-gray-600 text-sm mb-4">
              Restore system data from the latest backup. This action cannot be undone.
            </p>
            <button
              onClick={handleRestore}
              disabled={!backupStatus.hasBackup || backupStatus.isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="h-4 w-4" />
              Restore Backup
            </button>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Download Latest Backup</h4>
              <p className="text-gray-600 text-sm">
                Download the backup file for external storage or manual restoration.
              </p>
            </div>
            <button
              onClick={handleDownload}
              disabled={!backupStatus.hasBackup}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Backup History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup History</h3>
        
        <div className="space-y-3">
          {[
            { date: '2024-01-15', size: '247.2 MB', type: 'Manual' },
            { date: '2024-01-14', size: '245.8 MB', type: 'Automatic' },
            { date: '2024-01-13', size: '244.1 MB', type: 'Automatic' },
            { date: '2024-01-12', size: '242.9 MB', type: 'Manual' }
          ].map((backup, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Archive className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Backup - {backup.date}</p>
                  <p className="text-sm text-gray-600">{backup.type} backup</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{backup.size}</span>
                <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900 mb-2">Important Notice</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>Backups are stored securely and automatically encrypted</li>
              <li>Regular backups are recommended to prevent data loss</li>
              <li>System backups include all user data and configurations</li>
              <li>Keep external copies of critical backups for disaster recovery</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupRestore;
