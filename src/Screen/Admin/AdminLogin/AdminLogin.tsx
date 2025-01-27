import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../Api/admin'; // Assume you have a separate API for admin
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../Apps/store';
import { setAdminCredential } from '../../../Apps/slice/AuthSlice';
import { handleApiResponse } from '../../../Utils/apiUtils';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<{ email?: string; password?: string;general?:string }>({});
    const [loading, setLoading] = useState<boolean>(false);

    const { adminData } = useAppSelector((state) => state.auth);


    useEffect(() => {
        if (adminData) {
            navigate('/adminDashboard');
        }
    }, [adminData])

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!password) {
            newErrors.password = 'Password is required.';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors before submitting.');
            return;
        }

        setLoading(true);
        setErrors({});
        try {
            const response = await login({ email, password });

            const data = handleApiResponse(response)
console.log(1,response);
console.log(2,data);



            if (response?.success && data.token) {
                dispatch(setAdminCredential(data.token))
                toast.success(response.message);
                navigate('/adminDashboard');
            }
             else {
                toast.error(response.message || 'Something went wrong...');
            }



        } catch (error:any) {
            if (error.response) {
                const { status, data } = error.response;
                console.error(`Error ${status}:`, data);
    
                if (status === 401) {
                    toast.error('Unauthorized! Please check your email or password.');
                } else if (status === 400) {
                    toast.error(data.message || 'Invalid request.');
                    setErrors(data.errors || {}); 
                } else {
                    toast.error(data.message || 'Something went wrong.');
                }
            } else if (error.request) {
                console.error('No response received:', error.request);
                toast.error('Network error! Please try again later.');
            } else {
                console.error('Error:', error.message);
                toast.error('Unexpected error occurred. Please try again.');
            }

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
                    {/* {errors.email && <p className="text-red-500 text-center">{errors.email}</p>} */}
                    {errors.general && <p className="text-red-500 text-center">{errors.general}</p>}

                    <div>
                        <label htmlFor="email" className="block font-medium">
                            Email:
                        </label>
                        <input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Admin Email"
                            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                                }`}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                    </div>

                    <div>
                        <label htmlFor="password" className="block font-medium">
                            Password:
                        </label>
                        <input
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Admin Password"
                            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                                }`}
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white py-2 rounded transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-red-700'
                            }`}
                        style={{ backgroundColor: loading ? '#d3d3d3' : '#ff4500' }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
