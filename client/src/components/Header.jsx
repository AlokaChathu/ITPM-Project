import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import Image1 from '../assets/TalenTracerLogo.png'

function Header() {

    const { userData } = useContext(AppContent);
    const navigate = useNavigate();

    const handleGetStarted = () => {
      if (userData) {
        navigate('/customer-home');
      } else {
        navigate('/login');
      }
    };

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center
    text-gray-800'>
      <img src={Image1} alt=""  className='w-auto h-40 rounded-full mb-6' />

      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2 text-white/65'>Hey {userData ?userData.name:'Developer'} </h1>
      
      <h2 className='text-3xl sm:text-5xl font-semibold mb-4 text-white/85'>Welcome to Talent Tracer</h2>

      <p className='mb-8 max-w-md text-white/65'>Register, log in, and complete your tasks within a fully secure system.</p>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={handleGetStarted}
          className="relative z-20 border border-white/80 rounded-full px-8 py-2.5 text-white/80 hover:bg-gray-100 hover:text-black cursor-pointer transition-all"
        >
          Get Started
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/login')}
          className='rounded-full border border-indigo-300/60 bg-white/10 px-8 py-2.5 text-sm font-medium text-indigo-100 hover:bg-white/20 cursor-pointer transition-all'
        >
          Admin portal
        </button>
      </div>
      <p className="mt-3 max-w-md text-xs text-white/45">
        Staff: Admin portal → register or sign in → Dashboard, Users, Roles, and more in the sidebar.
      </p>
    </div>
  )
}

export default Header
