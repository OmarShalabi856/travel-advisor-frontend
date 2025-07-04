import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface NavItemProps {
    path: string;
     closeNavBar?: React.MouseEventHandler<HTMLAnchorElement>
    label: string;
}

const NavItem = ({ path, label ,closeNavBar}: NavItemProps) => {
    const location = useLocation();
    let isActive = location.pathname === path;
    return (
        <div>
            <button >
            <Link onClick={closeNavBar} className={`p-2 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 
            ${isActive?`after:scale-x-100`:`after:scale-x-0`} hover:after:scale-x-100`} to={path}>
                {label}
            </Link>
            </button>
        </div>
    )
}

export default NavItem