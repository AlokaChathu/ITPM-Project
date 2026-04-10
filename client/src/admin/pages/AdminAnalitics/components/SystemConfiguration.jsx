import React, { useState, useEffect } from "react";
import { Settings, Save, RefreshCw } from "lucide-react";

const SystemConfiguration = () => {
  const [config, setConfig] = useState({
    minGpaRequirement: "2.5",
    internshipDurationMonths: "6",
    evalWeightTechnical: "40",
    evalWeightCommunication: "35",
    evalWeightAttendance: "25",
    systemMaintenance: false,
    emailNotifications: true,
    autoBackup: true,
    backupFrequency: "daily"
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const weightSum = Number(config.evalWeightTechnical) + Number(config.evalWeightCommunication) + Number(config.evalWeightAttendance);

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (weightSum !== 100) {
      alert("Evaluation weights must total 100%");
      return;
    }

    setLoading(true);
    
    // Mock save operation
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const handleReset = () => {
    setConfig({
      minGpaRequirement: "2.5",
      internshipDurationMonths: "6",
      evalWeightTechnical: "40",
      evalWeightCommunication: "35",
      evalWeightAttendance: "25",
      systemMaintenance: false,
      emailNotifications: true,
      autoBackup: true,
      backupFrequency: "daily"
    });
    setSaved(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">System Configuration</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Settings className="h-4 w-4" />
          System Settings
        </div>
      </div>

      {/* Academic Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum GPA Requirement
            </label>
            <input
              type="number"
              min="0"
              max="4"
              step="0.1"
              value={config.minGpaRequirement}
              onChange={(e) => handleChange('minGpaRequirement', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">Scale: 0.0 - 4.0</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Internship Duration (Months)
            </label>
            <input
              type="number"
              min="1"
              max="24"
              value={config.internshipDurationMonths}
              onChange={(e) => handleChange('internshipDurationMonths', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">Duration: 1 - 24 months</p>
          </div>
        </div>
      </div>

      {/* Evaluation Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Evaluation Weight Distribution</h3>
        <p className="text-gray-600 mb-4">Technical, Communication, and Attendance weights must total 100%</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technical Skills (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={config.evalWeightTechnical}
              onChange={(e) => handleChange('evalWeightTechnical', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Communication (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={config.evalWeightCommunication}
              onChange={(e) => handleChange('evalWeightCommunication', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attendance (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={config.evalWeightAttendance}
              onChange={(e) => handleChange('evalWeightAttendance', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div className={`mt-4 p-3 rounded-lg ${weightSum === 100 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-sm font-semibold ${weightSum === 100 ? 'text-green-800' : 'text-red-800'}`}>
            Total Weight: {weightSum}% {weightSum === 100 ? 'Valid' : 'Must equal 100%'}
          </p>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Maintenance Mode</p>
              <p className="text-sm text-gray-600">Temporarily disable user access</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.systemMaintenance}
                onChange={(e) => handleChange('systemMaintenance', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Send system notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.emailNotifications}
                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Automatic Backup</p>
              <p className="text-sm text-gray-600">Enable scheduled system backups</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoBackup}
                onChange={(e) => handleChange('autoBackup', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backup Frequency
            </label>
            <select
              value={config.backupFrequency}
              onChange={(e) => handleChange('backupFrequency', e.target.value)}
              disabled={!config.autoBackup}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={loading || weightSum !== 100}
          className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white border-t-transparent"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Configuration
            </>
          )}
        </button>
        
        <button
          onClick={handleReset}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className="h-4 w-4" />
          Reset to Defaults
        </button>
      </div>
      
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          Configuration saved successfully!
        </div>
      )}
    </div>
  );
};

export default SystemConfiguration;
