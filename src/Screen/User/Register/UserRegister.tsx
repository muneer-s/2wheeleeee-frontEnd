import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { signup } from '../../../Api/user';

const UserRegister: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    // Yup schema for form validation
    const validationSchema = Yup.object({
        userName: Yup.string().trim().required('Username is required.'),
        email: Yup.string()
            .email('Enter a valid email address.')
            .required('Email is required.'),
        password: Yup.string()
            .required('Password is required.')
            .min(6, 'Password must be at least 6 characters long.')
            .matches(
                /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
            ),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords do not match.')
            .required('Confirm Password is required.'),
    });

    // Formik setup
    const formik = useFormik({
        initialValues: {
            userName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await signup({
                    name: values.userName,
                    email: values.email,
                    password: values.password,
                });

                if (response.success) {
                    toast.success(response.message);
                    navigate(`/otp?email=${response.data.email}`);
                }
            } catch (error: any) {
                toast.error(error.response.data.message || 'An error occurred during registration.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-sky-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-sky-400 to-blue-600 py-6 px-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">Create Account</h2>
                        <button
                            className="text-white hover:text-blue-200 transition-colors"
                            onClick={() => navigate('/')}
                            aria-label="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-blue-100 mt-2">Join our community to enjoy the best bike rental experience</p>
                </div>

                <div className="p-8">
                    <form className="space-y-6" onSubmit={formik.handleSubmit}>
                        <div>
                            <label htmlFor="userName" className="block text-gray-700 font-medium mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    id="userName"
                                    type="text"
                                    placeholder="Enter your username"
                                    value={formik.values.userName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full pl-10 pr-4 py-3 border ${
                                        formik.touched.userName && formik.errors.userName ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 ${
                                        formik.touched.userName && formik.errors.userName ? 'focus:ring-red-300' : 'focus:ring-sky-300'
                                    }`}
                                />
                                {formik.touched.userName && formik.errors.userName && (
                                    <div className="absolute right-3 top-3 text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {formik.touched.userName && formik.errors.userName && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.userName}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full pl-10 pr-4 py-3 border ${
                                        formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 ${
                                        formik.touched.email && formik.errors.email ? 'focus:ring-red-300' : 'focus:ring-sky-300'
                                    }`}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <div className="absolute right-3 top-3 text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full pl-10 pr-4 py-3 border ${
                                        formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 ${
                                        formik.touched.password && formik.errors.password ? 'focus:ring-red-300' : 'focus:ring-sky-300'
                                    }`}
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <div className="absolute right-3 top-3 text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full pl-10 pr-4 py-3 border ${
                                        formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 ${
                                        formik.touched.confirmPassword && formik.errors.confirmPassword ? 'focus:ring-red-300' : 'focus:ring-sky-300'
                                    }`}
                                />
                                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                    <div className="absolute right-3 top-3 text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={`w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-sky-600 font-medium hover:text-sky-800 transition-colors"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;