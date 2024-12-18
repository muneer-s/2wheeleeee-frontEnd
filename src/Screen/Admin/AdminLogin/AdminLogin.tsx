import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../Api/admin'; // Assume you have a separate API for admin
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../app/store';
import { setAdminCredential } from '../../../app/slice/AuthSlice';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();



    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const { adminData } = useAppSelector((state) => state.auth);

    console.log('admin data : ', adminData);

    useEffect(() => {
        if (adminData) {
            navigate('/adminDashboard');
        }
    }, [adminData])


    const handleSubmit = async (e: React.FormEvent) => {
        console.log(email);
        console.log(password);

        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const response = await login({ email, password });
            console.log('Admin login response:', response);
            console.log(response.token);

            if (response?.success && response.token) {
                dispatch(setAdminCredential(response.token))
                toast.success('Admin logged in successfully');
                navigate('/adminDashboard');
            } else {
                toast.error('Login failed');
                setError(response?.message || 'Invalid email or password');
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
            toast.error("Invalid email or password")
            console.error('Admin login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-gray-100">
            <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-center text-2xl font-bold mb-4" style={{ color: '#ff4500' }}>
                    Admin Login
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <div>
                        <label htmlFor="email" className="block font-medium">
                            Email:
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Admin Email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block font-medium">
                            Password:
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Admin Password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-white py-2 rounded hover:bg-red-700 transition"
                        style={{ backgroundColor: '#ff4500' }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
