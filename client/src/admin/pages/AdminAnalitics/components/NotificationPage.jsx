import React, { useState, useEffect } from "react";
import { Bell, Send, Trash2, Users, Mail, MessageSquare } from "lucide-react";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    message: "",
    type: "info",
    recipients: "all"
  });
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // Mock notifications loading
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          message: "System maintenance scheduled for this weekend",
          type: "warning",
          recipients: "all",
          date: new Date().toISOString(),
          sender: "System Admin"
        },
        {
          id: 2,
          message: "New internship opportunities available",
          type: "info",
          recipients: "students",
          date: new Date(Date.now() - 86400000).toISOString(),
          sender: "Career Services"
        },
        {
          id: 3,
          message: "Monthly reports are now available",
          type: "success",
          recipients: "lecturers",
          date: new Date(Date.now() - 172800000).toISOString(),
          sender: "Academic Affairs"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      alert("Please enter a message");
      return;
    }

    setSending(true);
    
    // Mock sending notification
    setTimeout(() => {
      const newNotification = {
        id: Date.now(),
        message: formData.message,
        type: formData.type,
        recipients: formData.recipients,
        date: new Date().toISOString(),
        sender: "Current Admin"
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setFormData({ message: "", type: "info", recipients: "all" });
      setSending(false);
    }, 1500);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getRecipientIcon = (recipients) => {
    switch (recipients) {
      case 'students': return <Users className="h-4 w-4" />;
      case 'lecturers': return <Mail className="h-4 w-4" />;
      case 'companies': return <MessageSquare className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
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
        <h2 className="text-2xl font-bold text-gray-900">Notification Management</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Bell className="h-4 w-4" />
          {notifications.length} notifications
        </div>
      </div>

      {/* Send New Notification */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Send New Notification</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your notification message..."
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="info">Information</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipients
              </label>
              <select
                value={formData.recipients}
                onChange={(e) => setFormData(prev => ({ ...prev, recipients: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Users</option>
                <option value="students">Students Only</option>
                <option value="lecturers">Lecturers Only</option>
                <option value="companies">Companies Only</option>
                <option value="supervisors">Supervisors Only</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={sending}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white border-t-transparent"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Notification
              </>
            )}
          </button>
        </form>
      </div>

      {/* Notification History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification History</h3>
        
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                      {notification.type}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      {getRecipientIcon(notification.recipients)}
                      <span>{notification.recipients}</span>
                    </div>
                  </div>
                  <p className="text-gray-900 mb-2">{notification.message}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>From: {notification.sender}</span>
                    <span>·</span>
                    <span>{new Date(notification.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          {notifications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No notifications sent yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            <p className="text-sm text-gray-600">Total Sent</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {notifications.filter(n => n.recipients === 'all').length}
            </p>
            <p className="text-sm text-gray-600">All Users</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Mail className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {notifications.filter(n => n.recipients === 'students').length}
            </p>
            <p className="text-sm text-gray-600">Students</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {notifications.filter(n => n.recipients === 'lecturers').length}
            </p>
            <p className="text-sm text-gray-600">Lecturers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
