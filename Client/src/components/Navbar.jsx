import React, { useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAppContext } from "../context/AppContext.jsx";
import {motion} from "motion/react"

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, api, setIsOwner } = useAppContext()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const changeRole = async () => {
    // Check if user is logged in first
    if (!user) {
      setShowLogin(true); // Show login modal if not logged in
      return;
    }

    try {
      const { data } = await api.post('/api/owner/change-role');
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setShowLogin(true); // Show login modal if token is invalid
      } else {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  }

  return (
    <motion.div
    initial={{y:-20,opacity:0}}
    animate={{y:0,opacity:1}}
    transition={{duration:0.5}}

      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${
        location.pathname === '/' ? 'bg-light' : 'bg-white'
      }`}
    >
      {/* Logo */}
      <Link to='/'>
        <motion.img whileHover={{scale:1.05}}
        src={assets.logo} alt='logo' className='h-8' />
      </Link>

      {/* Nav links + Search + Actions */}
      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 max-sm:p-4
        transition-all duration-300 z-40
        ${location.pathname === '/' ? 'bg-light' : 'bg-white'}
        ${open ? 'max-sm:translate-x-0' : 'max-sm:translate-x-full'}`}
      >
        {/* Menu Links */}
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-8'>
          {menuLinks.map((link, index) => (
            <Link key={index} to={link.path}>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Search bar (desktop only) */}
        <div className='hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56'>
          <input
            type='text'
            className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500'
            placeholder='Search Products'
          />
          <img src={assets.search_icon} alt='search' />
        </div>

        {/* Right side actions */}
        <div className='flex max-sm:flex-col items-start sm:items-center gap-4 sm:ml-auto'>
          <button
            onClick={() => {
              if (!user) {
                setShowLogin(true);
                return;
              }
              isOwner ? navigate('/owner') : changeRole();
            }}
            className='cursor-pointer'
          >
            {isOwner ? 'Dashboard' : 'List cars'}
          </button>
          <button
            onClick={() => (user ? logout() : setShowLogin(true))}
            className='cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg'
          >
            {user ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>

      {/* Hamburger button (only mobile) */}
      <button
        className='sm:hidden cursor-pointer z-50'
        aria-label='Menu'
        onClick={() => setOpen(!open)}
      >
        <img
          src={open ? assets.close_icon : assets.menu_icon}
          alt='menu'
        />
      </button>
    </motion.div>
  )
}

export default Navbar
