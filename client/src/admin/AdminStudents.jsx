import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import NavBarAdmin from '../components/NavbarAdmin';

function AdminStudents() {
  const [portfolios, setPortfolios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Messaging Modal State
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  
  // Send/Edit Form State
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editText, setEditText] = useState('');

  // 1. Fetch all students
  const fetchPortfolios = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get('http://localhost:4000/api/portfolio/all');
      if (data.success) setPortfolios(data.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  // 2. Open Modal and Fetch History
  const handleOpenMessages = async (portfolio) => {
    setSelectedStudent(portfolio);
    setMessageText('');
    setEditingMsgId(null);
    fetchMessageHistory(portfolio.studentId._id);
  };

  const fetchMessageHistory = async (studentId) => {
    try {
      setIsHistoryLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`http://localhost:4000/api/messages/student/${studentId}`);
      if (data.success) setMessageHistory(data.data);
    } catch (error) {
      toast.error("Could not fetch message history.");
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // 3. Send a New Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      setIsSending(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.post('http://localhost:4000/api/messages/send', {
        studentId: selectedStudent.studentId._id,
        text: messageText
      });

      if (data.success) {
        toast.success("Message sent!");
        setMessageText('');
        fetchMessageHistory(selectedStudent.studentId._id); // Refresh history
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSending(false);
    }
  };

  // 4. Update an existing message
  const handleUpdateMessage = async (msgId) => {
    if (!editText.trim()) return;
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.put(`http://localhost:4000/api/messages/update/${msgId}`, { text: editText });
      
      if (data.success) {
        toast.success("Message updated!");
        setEditingMsgId(null);
        fetchMessageHistory(selectedStudent.studentId._id);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 5. Delete a message
  const handleDeleteMessage = async (msgId) => {
    if(!window.confirm("Delete this message?")) return;
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.delete(`http://localhost:4000/api/messages/delete/${msgId}`);
      if (data.success) {
        toast.success("Message deleted.");
        fetchMessageHistory(selectedStudent.studentId._id);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isLoading) return <div className='w-[100vw] h-[100vh] flex justify-center items-center'><p>Page is Loading...</p></div>;

  return (
    <><NavBarAdmin />
    <div className="min-h-screen  p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Student Directory</h1>
        <p className="text-slate-500 mb-8">View student skills and manage direct communications.</p>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map(portfolio => (
            <div key={portfolio._id} className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 flex flex-col">
              <div className="flex-grow mb-4">
                <h3 className="text-xl font-bold text-slate-800">{portfolio.studentId?.name || "Unknown Student"}</h3>
                <p className="text-slate-500 text-sm mb-4">{portfolio.studentId?.email}</p>
                
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Saved Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {portfolio.skills.map((skill, i) => (
                    <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs px-2 py-1 rounded font-medium">
                      {skill}
                    </span>
                  ))}
                  {portfolio.skills.length === 0 && <span className="text-xs text-slate-400">No skills added.</span>}
                </div>
              </div>
              
              <button 
                onClick={() => handleOpenMessages(portfolio)}
                className="w-full bg-blue-100 text-blue-700 py-2 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition"
              >
                Message History & Send
              </button>
            </div>
          ))}
          {portfolios.length === 0 && <p className="text-slate-500 col-span-full">No student portfolios created yet.</p>}
        </div>

        {/* Messaging History Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
              
              <div className="flex justify-between items-center mb-4 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Messages: {selectedStudent.studentId?.name}</h2>
                  <p className="text-xs text-slate-500">Admins can edit/delete messages before the student reads them.</p>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-red-500 font-bold text-2xl">✕</button>
              </div>
              
              {/* Message History Feed */}
              <div className="flex-grow overflow-y-auto mb-4 pr-2 space-y-4 min-h-[250px] bg-slate-50 p-4 rounded-xl border inset-shadow">
                {isHistoryLoading ? (
                  <div className="flex justify-center py-10"><LoadingSpinner /></div>
                ) : messageHistory.length === 0 ? (
                  <p className="text-center text-slate-400 py-10">No messages sent to this student yet.</p>
                ) : (
                  messageHistory.map(msg => (
                    <div key={msg._id} className={`p-4 rounded-xl border ${msg.isRead ? 'bg-white border-slate-200' : 'bg-blue-50 border-blue-200'}`}>
                      
                      {/* Read Status Header */}
                      <div className="flex justify-between items-start mb-2">
                         <span className={`text-xs font-bold px-2 py-0.5 rounded ${msg.isRead ? 'bg-slate-200 text-slate-600' : 'bg-blue-200 text-blue-800'}`}>
                           {msg.isRead ? 'Read ✓' : 'Unread'}
                         </span>
                         <span className="text-xs text-slate-400">{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>

                      {/* Message Content (or Edit Form) */}
                      {editingMsgId === msg._id ? (
                        <div className="mt-2">
                          <textarea 
                            value={editText} 
                            onChange={(e) => setEditText(e.target.value)} 
                            className="w-full border p-2 rounded-lg text-sm mb-2 outline-none focus:border-blue-500"
                            rows="3"
                          ></textarea>
                          <div className="flex gap-2">
                            <button onClick={() => handleUpdateMessage(msg._id)} className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700 font-bold">Save</button>
                            <button onClick={() => setEditingMsgId(null)} className="bg-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded hover:bg-slate-300 font-bold">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-700 text-sm whitespace-pre-wrap">{msg.text}</p>
                      )}

                      {/* Action Buttons (Only if unread) */}
                      {!msg.isRead && editingMsgId !== msg._id && (
                        <div className="flex gap-3 mt-3 pt-3 border-t border-blue-100">
                          <button 
                            onClick={() => { setEditingMsgId(msg._id); setEditText(msg.text); }}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteMessage(msg._id)}
                            className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Send New Message Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
                <input 
                  type="text"
                  required
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a new message..."
                  className="flex-grow border rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
                <button 
                  type="submit" 
                  disabled={isSending}
                  className="bg-blue-600 text-white font-bold px-6 rounded-xl hover:bg-blue-700 transition disabled:opacity-70 whitespace-nowrap"
                >
                  {isSending ? 'Sending...' : 'Send'}
                </button>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
    </>
  );
}

export default AdminStudents;