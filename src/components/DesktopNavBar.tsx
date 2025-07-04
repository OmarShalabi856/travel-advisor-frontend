
import { Link } from 'react-router'
import NavItem from './NavItem'
import { useAuth } from '../services/useAuth';


const NavBar = () => {
  const { user, isLoggedIn, logout } = useAuth();
  return (
    <div className="fixed top-0 left-0 w-screen h-[68px] z-50 bg-gray-50 shadow flex items-center justify-between px-4">
      <div>
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <img className="h-16 w-auto" src="/travel-logo.jpg" alt="" />
          Travel Advisor
        </Link>
      </div>

      <div className="text-sm flex flex-row sm:gap-12 md:gap 28 lg:50 mr-6 w-3/5 justify-end items-center">
        <NavItem path="/" label="Home" />
        <NavItem path="/my-trips" label="My Trips" />
        <NavItem path="/add-destination" label="Add" />
        <NavItem path="/about" label="About" />
        {isLoggedIn() ? <div className='truncate max-w-[300px] font-semibold relative flex flex-row gap-2 text-sm p-2 underline underline-offset-8 justify-center items-center'>Hello, {user?.userName}
          <img onClick={logout} className="cursor-pointer size-5" src="/logout.png" /></div> : <NavItem path="/sign-up" label="Sign Up/Login" />}
      </div>
    </div>
  )
}

export default NavBar
