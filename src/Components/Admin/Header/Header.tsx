import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

import { adminLogout } from '../../../app/slice/AuthSlice';
import { logout } from '../../../Api/admin';



const AdminHeader: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();


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
        <header className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-700 text-white shadow-lg">
            {/* Logo */}
            <div className="text-2xl font-bold italic tracking-wide">
                2Wheeleeee
            </div>

            {/* Navigation Links */}
            <nav className="flex gap-6 text-lg font-semibold">
                <NavLink
                    to="/adminDashboard"
                    className={({ isActive }) =>
                        isActive ? 'underline text-white' : 'hover:underline'
                    }
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/adminUserList"
                    className={({ isActive }) =>
                        isActive ? 'underline text-white' : 'hover:underline'
                    }
                >
                    Users
                </NavLink>
                <NavLink
                    to="/adminHostList"
                    className={({ isActive }) =>
                        isActive ? 'underline text-white' : 'hover:underline'
                    }
                >
                    Host
                </NavLink>
                <NavLink
                    to="/admin/orders"
                    className={({ isActive }) =>
                        isActive ? 'underline text-white' : 'hover:underline'
                    }
                >
                    Orders
                </NavLink>
                <NavLink
                    to="/admin/payments"
                    className={({ isActive }) =>
                        isActive ? 'underline text-white' : 'hover:underline'
                    }
                >
                    Payments
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="hover:underline text-white"
                >
                    Logout
                </button>
            </nav>
        </header>
    );
};

export default AdminHeader;
