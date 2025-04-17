import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import logAnime from '../../../assets/anime/logAnime.json';
import { login } from '../../../Api/user';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../../../Apps/store';
import { saveUser } from '../../../Apps/slice/AuthSlice';
import { setUserCredential } from '../../../Apps/slice/AuthSlice';

import { handleApiResponse } from '../../../Utils/apiUtils';

const UserLogin: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

    const { userData } = useAppSelector((state) => state.auth)
    const authState = useAppSelector((state) => state.auth);
    const userDetails = authState.user

    useEffect(() => {
        if (userData && userDetails) navigate('/');
    }, [userData, userDetails]);

    const validateForm = () => {
        const errors: { email?: string; password?: string } = {};

        if (!email) {
            errors.email = 'Email is required';
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            errors.email = 'Invalid email format';
        }

        if (!password) {
            errors.password = 'Password is required';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password)) {
            errors.password =
                'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;

        setLoading(true)
        try {
            const response = await login({ email, password })
            const data = handleApiResponse(response);

            const user = {
                email: data.user.email,
                name: data.user.name,
                profile_picture: data.user.profile_picture,
                userId: data.user.userId,
            };
            dispatch(saveUser(user));
            dispatch(setUserCredential(data.userAccessToken));
            toast.success(response.message);
            navigate('/');

        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-sky-50">
            <div className="flex w-full max-w-5xl shadow-2xl rounded-3xl overflow-hidden">
                {/* Animation Section */}

                <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-sky-400 to-blue-600 p-12 items-center justify-center">
                    <div className="w-full max-w-md">
                        <Lottie animationData={logAnime} loop={true} />
                    </div>
                </div>

                {/* Form Section */}
                <div className="w-full md:w-1/2 bg-white p-12">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-sky-500">Welcome Back</h2>
                        <button
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            onClick={() => navigate('/')}
                            aria-label="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <p className="text-gray-600 mb-8">Please enter your details to sign in to your account</p>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <p className="text-red-500">{error}</p>
                            </div>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className={`w-full px-4 py-3 border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} 
                                    rounded-lg focus:outline-none focus:ring-2 ${validationErrors.email ? 'focus:ring-red-300' : 'focus:ring-sky-300'}`}
                                />
                                {validationErrors.email && (
                                    <div className="absolute right-3 top-3 text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {validationErrors.email && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className={`w-full px-4 py-3 border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} 
                                    rounded-lg focus:outline-none focus:ring-2 ${validationErrors.password ? 'focus:ring-red-300' : 'focus:ring-sky-300'}`}
                                />
                                {validationErrors.password && (
                                    <div className="absolute right-3 top-3 text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {validationErrors.password && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                            )}
                        </div>

                        {/* Uncomment if you want to add this feature back
                        <div className="flex justify-end">
                            <button 
                                type="button" 
                                onClick={() => navigate('/forgotpassword')}
                                className="text-sm text-sky-600 hover:text-sky-800 font-medium"
                            >
                                Forgot Password?
                            </button>
                        </div>
                        */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-sky-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <button
                                onClick={() => navigate('/register')}
                                className="text-sky-600 font-medium hover:text-sky-800 transition-colors"
                            >
                                Create an account
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;