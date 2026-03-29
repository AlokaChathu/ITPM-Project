import { useContext } from 'react'
import { AppContent } from '../context/AppContext'
import Image1 from '../assets/TalenTracerLogo2.png'

function Header() {

    const {userData} = useContext(AppContent);

    

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center
    text-gray-800'>
      <img src={Image1} alt=""  className='w-auto h-40 rounded-full mb-6' />

      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2 text-white'>Hey {userData ?userData.name:'Student'} </h1>
      
      <h2 className='text-3xl sm:text-5xl font-semibold mb-4 text-white'>Welcome to Talent Tracer</h2>

      <p className='mb-8 max-w-md text-white/80'>Register, log in, and complete your tasks within a fully secure system.</p>

      <a href=""><button className='border border-white/80 rounded-full px-8 py-2.5 text-white/80 hover:bg-gray-100 hover:text-black cursor-pointer transition-all'>Get Started</button></a>
    </div>
  )
}

export default Header
