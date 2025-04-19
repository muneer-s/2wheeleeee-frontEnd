import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { adminLogout } from '../../../Apps/slice/AuthSlice';
import { logout } from '../../../Api/admin';

const AdminHeader: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const menuRef = useRef<HTMLDivElement>(null);

    const adminData = useSelector((state: any) => state.auth.adminData);
    const [menuOpen, setMenuOpen] = useState(false);
    // const [userMenuOpen, setUserMenuOpen] = useState(false);

    useEffect(() => {
        if (!adminData) {
            dispatch(adminLogout());
            navigate('/adminLogin');
        }
    }, [adminData, dispatch, navigate]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
                // setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleLogout = async () => {
        try {
            const response = await logout();
            if (response?.data?.success) {
                dispatch(adminLogout());
                navigate('/adminLogin');
                toast.success('Logged out successfully');
            } else {
                toast.error('Failed to log out');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            toast.error('An error occurred while logging out');
        }
    };

    const navLinkClass = ({ isActive }: { isActive: boolean }) => 
        `flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
            isActive 
                ? 'bg-white/10 text-white font-medium' 
                : 'text-blue-50 hover:bg-white/10'
        }`;

    return (
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg" ref={menuRef}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13 7H7v6h6V7z" />
                                <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2 text-2xl font-bold text-white tracking-wide">
                                2<span className="italic text-yellow-300">Wheeleeee</span>
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        <NavLink to="/adminDashboard" className={navLinkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                            Dashboard
                        </NavLink>

                        <NavLink to="/adminUserList" className={navLinkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            Users
                        </NavLink>

                        <NavLink to="/adminHostList" className={navLinkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                            </svg>
                            Host
                        </NavLink>

                        <NavLink to="/adminOrderList" className={navLinkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                            </svg>
                            Orders
                        </NavLink>

                        <NavLink to="/adminFeedbackList" className={navLinkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                            Feedbacks
                        </NavLink>

                        <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 rounded-lg text-blue-50 hover:bg-white/10 transition-all duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-4-4H3zm9 2.586L15.414 9H12V5.586z" clipRule="evenodd" />
                                <path d="M4 6a1 1 0 011-1h5a1 1 0 110 2H5a1 1 0 01-1-1z" />
                                <path d="M12 5a1 1 0 00-1 1v4a1 1 0 001 1h3a1 1 0 001-1V9.414l-4-4z" />
                            </svg>
                            Logout
                        </button>
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden bg-blue-700/90 backdrop-blur-sm">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavLink 
                            to="/adminDashboard" 
                            className={({ isActive }) => 
                                `block px-3 py-2 rounded-md text-base font-medium ${
                                    isActive ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-600'
                                }`
                            }
                            onClick={() => setMenuOpen(false)}
                        >
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                </svg>
                                Dashboard
                            </div>
                        </NavLink>

                        <NavLink 
                            to="/adminUserList" 
                            className={({ isActive }) => 
                                `block px-3 py-2 rounded-md text-base font-medium ${
                                    isActive ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-600'
                                }`
                            }
                            onClick={() => setMenuOpen(false)}
                        >
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                                Users
                            </div>
                        </NavLink>

                        <NavLink 
                            to="/adminHostList" 
                            className={({ isActive }) => 
                                `block px-3 py-2 rounded-md text-base font-medium ${
                                    isActive ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-600'
                                }`
                            }
                            onClick={() => setMenuOpen(false)}
                        >
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                </svg>
                                Host
                            </div>
                        </NavLink>

                        <NavLink 
                            to="/adminOrderList" 
                            className={({ isActive }) => 
                                `block px-3 py-2 rounded-md text-base font-medium ${
                                    isActive ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-600'
                                }`
                            }
                            onClick={() => setMenuOpen(false)}
                        >
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                </svg>
                                Orders
                            </div>
                        </NavLink>

                        <NavLink 
                            to="/adminFeedbackList" 
                            className={({ isActive }) => 
                                `block px-3 py-2 rounded-md text-base font-medium ${
                                    isActive ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-600'
                                }`
                            }
                            onClick={() => setMenuOpen(false)}
                        >
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                </svg>
                                Feedbacks
                            </div>
                        </NavLink>

                        <button
                            onClick={() => {
                                handleLogout();
                                setMenuOpen(false);
                            }}
                            className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-4-4H3zm9 2.586L15.414 9H12V5.586z" clipRule="evenodd" />
                                <path d="M4 6a1 1 0 011-1h5a1 1 0 110 2H5a1 1 0 01-1-1z" />
                                <path d="M12 5a1 1 0 00-1 1v4a1 1 0 001 1h3a1 1 0 001-1V9.414l-4-4z" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default AdminHeader;