import Navbar from '../../components/Navbar.jsx'
import React from 'react'

const UserHomePage = () => {
  return (
    <div>
        <Navbar />
        <div className='pt-20 flex justify-center items-center h-screen'>
        <h1>Welcome to the User Home Page</h1>
        </div>
    </div>
  )
}

export default UserHomePage