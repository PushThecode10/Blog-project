import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import React from 'react'
import Footer from './components/Footer.jsx'

const MainLayout = () => {
  return (
    <div>
        <Navbar />
      <main>
        <Outlet />
      </main>
       <Footer />
    </div>
  )
}

export default MainLayout
