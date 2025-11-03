import React from 'react'
import logo from '../assets/logo.svg'
import { Button } from './ui/button'
import { Navigate, NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate();
  return (
    <header className='py-2 fixed w-full bg-b dark:border-b-gray-600 border-b-gray-300 border-2 bg-white z-50'>
        <div className='max-w-7xl mx-auto flex justify-between items-center px-4 md:px-0'>
            {/* logo section */}
                 <div className='flex gap-7 items-center'>
            
                        <div className='flex gap-2 items-center'>
                            <img src={logo} alt="" className='w-7 h-7 md:w-10 md:h-10 dark:invert' />
                            <h1 className='font-bold text-3xl md:text-4xl'>Logo</h1>
                        </div>
                        </div>
                   
            {/* navigation links */}
            <nav className="space-x-5 md:space-x-10 font-medium text-lg md:text-xl">

                <NavLink to={"/"} className="text-gray-600 hover:text-gray-800">Home</NavLink>
                <NavLink to={"/blog"} className="text-gray-600 hover:text-gray-800">Blog</NavLink>
                <NavLink to={"/about"} className="text-gray-600 hover:text-gray-800">About</NavLink>
                <NavLink to={"/contect"} className="text-gray-600 hover:text-gray-800">Contact</NavLink>
            </nav>

            {/* action buttons */}
            <div className='space-x-3'>
                <Button 
                onClick={() => navigate("/login")}
                className="cursor-pointer"
                >Login</Button>
                <Button
                onClick={() => navigate("/signup")}>Sign Up</Button>
            </div>
        </div>
     
    </header>
  )
}

export default Navbar
