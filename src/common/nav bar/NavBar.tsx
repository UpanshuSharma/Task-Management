import React, { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { ROUTES } from '../../routes/contant'
import "./navbar.css"
const NavBar: React.FC = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <header className="navbar">
            <div className="nav-container">
                <div className="text-heading ">Task Management</div>
                <button
                    className="menu-btn"
                    aria-label="Toggle menu"
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </button>
                <nav className={`nav-links ${open ? "open" : ""}`}>
                    <Link
                        to={`/${ROUTES.ALL_TASK}`}
                        className={isActive(`/${ROUTES.ALL_TASK}`) ? 'active' : ''}
                    >
                        All Tasks
                    </Link>
                    <Link
                        to={`/${ROUTES.COMPLETE_TASK}`}
                        className={isActive(`/${ROUTES.COMPLETE_TASK}`) ? 'active' : ''}
                    >
                        Completed Tasks
                    </Link>

                </nav>
            </div>
        </header>
    )
}

export default NavBar