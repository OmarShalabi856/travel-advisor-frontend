import React from 'react'
import MobileSideBar from './MobileSideBar'
import DesktopNavBar from './DesktopNavBar'
import { Outlet } from 'react-router'

const NavBar = () => {
  return (
    <div>
      <div className="hidden max-sm:block">
        <MobileSideBar />
      </div>
      <div className="hidden sm:block">
        <DesktopNavBar />
      </div>
       <Outlet />
    </div>
  )
}

export default NavBar