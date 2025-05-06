import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/api';

const NavBar = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">Blog</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        {isAuthenticated && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/new">New Post</Link>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav">
                        {isAuthenticated ? (
                            <li className="nav-item">
                                <button
                                    className="btn btn-link nav-link"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signup">Sign Up</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar; 