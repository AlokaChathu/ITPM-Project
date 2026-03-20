import React, { useContext } from 'react'
import { AppContent } from '../context/AppContext'

function CustomerHome() {
  const { userData } = useContext(AppContent)

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-4xl font-bold text-center mt-10 text-indigo-900 mb-10'>Customer Dashboard</h1>
        
        {userData ? (
          <div className='bg-white rounded-lg shadow-lg p-8 space-y-6'>
            <div className='border-b pb-4'>
              <h2 className='text-2xl font-bold text-indigo-800'>{userData.name}</h2>
              <p className='text-gray-600'>{userData.email}</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-indigo-50 p-4 rounded-lg'>
                <p className='text-gray-600 text-sm font-semibold'>AGE</p>
                <p className='text-xl font-bold text-indigo-900'>{userData.age}</p>
              </div>

              <div className='bg-indigo-50 p-4 rounded-lg'>
                <p className='text-gray-600 text-sm font-semibold'>PHONE</p>
                <p className='text-xl font-bold text-indigo-900'>{userData.phone}</p>
              </div>

              <div className='bg-indigo-50 p-4 rounded-lg col-span-1 md:col-span-2'>
                <p className='text-gray-600 text-sm font-semibold'>ADDRESS</p>
                <p className='text-xl font-bold text-indigo-900'>{userData.address}</p>
              </div>

              <div className='bg-indigo-50 p-4 rounded-lg'>
                <p className='text-gray-600 text-sm font-semibold'>ACCOUNT STATUS</p>
                <p className={`text-xl font-bold ${userData.isAccountVerified ? 'text-green-600' : 'text-red-600'}`}>
                  {userData.isAccountVerified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className='text-center text-gray-600'>
            <p>Loading user data...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerHome
