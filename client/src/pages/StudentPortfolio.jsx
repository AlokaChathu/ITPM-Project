import React, { useContext, useEffect, useState } from 'react';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar2 from '../components/Navbar2';

function StudentPortfolio() {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      axios.defaults.withCredentials = true;

      // Fetch Skills
      const portfolioRes = await axios.get('http://localhost:4000/api/portfolio/my-portfolio');
      if (portfolioRes.data.success && portfolioRes.data.data) {
        setSkills(portfolioRes.data.data.skills || []);
      }

      // Fetch Messages
      const msgRes = await axios.get('http://localhost:4000/api/messages/my-messages');
      if (msgRes.data.success) {
        setMessages(msgRes.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData) fetchData();
  }, [userData]);

  // Add a new skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    const trimmedSkill = newSkill.trim();

    // 1. Empty Check
    if (!trimmedSkill) return;

    // 2. Length Validation (Between 5 and 50 characters)
    if (trimmedSkill.length < 5 || trimmedSkill.length > 50) {
      return toast.error("Skill name must be between 5 and 50 characters.");
    }

    // 3. Max Skills Limit Validation (Prevents spamming the database)
    if (skills.length >= 20) {
      return toast.error("You have reached the maximum limit of 20 skills.");
    }

    // 4. Case-Insensitive Duplicate Check (Prevents "React" and "react")
    const isDuplicate = skills.some(skill => skill.toLowerCase() === trimmedSkill.toLowerCase());
    if (isDuplicate) {
      return toast.info("Skill already added!");
    }

    const updatedSkills = [...skills, trimmedSkill];

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post('http://localhost:4000/api/portfolio/update-skills', { skills: updatedSkills });
      if (data.success) {
        setSkills(updatedSkills);
        setNewSkill('');
        toast.success("Skill added!");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Remove a skill
  const handleRemoveSkill = async (skillToRemove) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post('http://localhost:4000/api/portfolio/update-skills', { skills: updatedSkills });
      if (data.success) {
        setSkills(updatedSkills);
        toast.success("Skill removed!");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Mark message as read
  const handleMarkRead = async (messageId) => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.put(`http://localhost:4000/api/messages/read/${messageId}`);
      if (data.success) {
        // Update UI instantly
        setMessages(messages.map(msg => msg._id === messageId ? { ...msg, isRead: true } : msg));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!userData || isLoading) return <div className='min-h-screen flex justify-center items-center bg-slate-50'><div className='w-[100vw] h-[100vh] flex justify-center items-center'><p>Page is Loading...</p></div></div>;

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (

    <>
      <Navbar2 />
      <div className='min-h-screen  p-8'>
        <div className='max-w-5xl mx-auto'>
          <button onClick={() => navigate('/customer-home')} className='mb-6 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2 transition'>
            ← Back to Dashboard
          </button>

          <h1 className='text-3xl font-bold text-slate-800 mb-8'>My Portfolio & Inbox</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Skills Section */}
            <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-indigo-600 h-fit">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">My Skills</h2>
              <p className="text-slate-500 text-sm mb-6">Add your technical and soft skills to stand out to recruiters.</p>

              <form onSubmit={handleAddSkill} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g. React, Python, Leadership"
                  className="flex-1 border rounded-lg p-2.5 outline-none focus:border-indigo-500"
                />
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition">
                  Add
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <div key={index} className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-full flex items-center gap-2 font-medium">
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)} className="text-indigo-400 hover:text-red-500 font-bold transition">✕</button>
                  </div>
                ))}
                {skills.length === 0 && <p className="text-slate-400 text-sm">No skills added yet.</p>}
              </div>
            </div>

            {/* Inbox Section */}
            <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-blue-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Direct Messages</h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{unreadCount} New</span>
                )}
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {messages.map(msg => (
                  <div key={msg._id} className={`p-4 rounded-xl border ${msg.isRead ? 'bg-slate-50 border-slate-200' : 'bg-blue-50 border-blue-200 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-slate-500">From: Admin Team</span>
                      <span className="text-xs text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-700 text-sm mb-3">{msg.text}</p>

                    {!msg.isRead && (
                      <button onClick={() => handleMarkRead(msg._id)} className="text-xs font-bold text-blue-600 hover:text-blue-800">
                        Mark as Read ✓
                      </button>
                    )}
                  </div>
                ))}
                {messages.length === 0 && <p className="text-slate-400 text-sm text-center py-8">Your inbox is empty.</p>}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default StudentPortfolio;