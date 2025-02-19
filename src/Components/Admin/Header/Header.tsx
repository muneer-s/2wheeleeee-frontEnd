import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { adminLogout } from '../../../Apps/slice/AuthSlice';
import { logout } from '../../../Api/admin';



const AdminHeader: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const adminData = useSelector((state: any) => state.auth.adminData);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!adminData) {
            dispatch(adminLogout());
            navigate('/adminLogin');
        }
    }, [adminData, dispatch, navigate]);

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




    return (
        <header className="flex flex-wrap justify-between items-center p-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-700 text-white shadow-lg">
            {/* Logo */}
            <div className="text-2xl font-bold italic tracking-wide">
                2Wheeleeee
            </div>

            {/* Hamburger Menu for Mobile */}
            <button
                className="block lg:hidden text-white focus:outline-none"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16m-7 6h7"
                    />
                </svg>
            </button>

            {/* Navigation Links */}
            <nav className={`${menuOpen ? 'block' : 'hidden'
                } w-full lg:w-auto lg:flex lg:items-center lg:gap-6 text-lg font-semibold`}
            >
                <NavLink
                    to="/adminDashboard"
                    className={({ isActive }) =>
                        isActive
                            ? 'underline text-white block lg:inline-block mt-2 lg:mt-0'
                            : 'hover:underline block lg:inline-block mt-2 lg:mt-0'
                        }
                >
                    Dashboard
                </NavLink>


                <NavLink
                    to="/adminUserList"
                    className={({ isActive }) =>
                        isActive
                            ? 'underline text-white block lg:inline-block mt-2 lg:mt-0'
                            : 'hover:underline block lg:inline-block mt-2 lg:mt-0'
                    }
                >
                    Users
                </NavLink>


                <NavLink
                    to="/adminHostList"
                    className={({ isActive }) =>
                        isActive
                            ? 'underline text-white block lg:inline-block mt-2 lg:mt-0'
                            : 'hover:underline block lg:inline-block mt-2 lg:mt-0'
                    }
                >
                    Host
                </NavLink>


                <NavLink
                    to="/adminOrderList"
                    className={({ isActive }) =>
                        isActive
                            ? 'underline text-white block lg:inline-block mt-2 lg:mt-0'
                            : 'hover:underline block lg:inline-block mt-2 lg:mt-0'
                    }
                >
                    Orders
                </NavLink>

                <NavLink
                    to="/adminFeedbackList"
                    className={({ isActive }) =>
                        isActive
                            ? 'underline text-white block lg:inline-block mt-2 lg:mt-0'
                            : 'hover:underline block lg:inline-block mt-2 lg:mt-0'
                    }
                >
                    Feedbacks
                </NavLink>


                <button
                    onClick={handleLogout}
                    className="hover:underline text-white block lg:inline-block mt-2 lg:mt-0"
                >
                    Logout
                </button>
            </nav>
        </header>
    );
};

export default AdminHeader;
