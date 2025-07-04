import React, { useState } from 'react'
import { Link } from 'react-router'
import NavItem from './NavItem'
import { useAuth } from '../services/useAuth'


const MobileSideBar = () => {
  const { user, isLoggedIn, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <div className="w-screen shadow bg-gray-50 h-[68px] flex flex-row justify-between items-center rounded-md">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <img className="h-16 w-auto" src="/travel-logo.jpg" alt="" />
          Travel Advisor
        </Link>

        <div className="flex flex-row size-12 justify-end items-center">
          <button
            className="cursor-pointer"
            onClick={() => setOpen((prevState) => !prevState)}
          > 
            <img src="./hamburger.png" alt="" />
          </button>
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 h-full md:w-1/3 sm:w-2/3 bg-white shadow-lg transition-transform duration-300 z-50 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col p-6 gap-4">
            <button
              className="self-end text-xl cursor-pointer"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <NavItem path="/" label="Home" closeNavBar={() => setOpen(false)} />
            <NavItem
              path="/my-trips"
              label="My Trips"
              closeNavBar={() => setOpen(false)}
            />
            <NavItem
              path="/add-destination"
              label="Add"
              closeNavBar={() => setOpen(false)}
            />
            <NavItem
              path="/about"
              label="About"
              closeNavBar={() => setOpen(false)}
            />
          </div>

          <div className="border-t border-gray-300 p-4 shadow-inner">
            {isLoggedIn() ? (
              <div className="truncate max-w-[300px] font-semibold relative flex flex-row gap-4 text-sm p-2 justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-md font-semibold">{user?.userName}</span>
                  <span className="text-sm text-gray-600">{user?.email}</span>
                </div>
                <img
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                  className="cursor-pointer size-5"
                  src="/logout.png"
                  alt="Logout"
                />
              </div>
            ) : (
              <NavItem path="/sign-up" label="Sign Up/Login" closeNavBar={() => setOpen(false)} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileSideBar
