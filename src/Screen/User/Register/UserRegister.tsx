import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

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
                const response = await fetch('http://localhost:3000/api/user/userSignup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        name: values.userName,
                        email: values.email,
                        password: values.password,
                    }),
                });

                const data = await response.json();
                if (data.success) {
                    toast.success(data.message);
                    navigate(`/otp?email=${data.email}`);
                } else {
                    toast.error(data.message);
                }
            } catch (err) {
                toast.error('An error occurred during registration.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className=" flex items-center justify-center  bg-blue-70 min-h-screen p-4">
            <div className="relative z-10 bg-blue-200 p-8 rounded-lg shadow-lg w-full max-w-sm" style={{ marginTop: '80px' }}>
                <h2 className="text-center text-2xl font-bold mb-4" style={{ color: '#00A3FF' }}>
                    Register
                </h2>
                <button
                    className="absolute top-2 right-2 md:top-4 md:right-4 text-blue-700 font-bold"
                    onClick={() => navigate('/')}
                >
                    ✕
                </button>

                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                    <div>
                        <label htmlFor="userName" className="block font-medium">
                            Enter your username:
                        </label>
                        <input
                            id="userName"
                            type="text"
                            placeholder="Enter Your Username"
                            value={formik.values.userName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-3 py-2 border ${formik.touched.userName && formik.errors.userName
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {formik.touched.userName && formik.errors.userName && (
                            <p className="text-red-500 text-sm">{formik.errors.userName}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block font-medium">
                            Enter your email:
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter Your Email Address"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-3 py-2 border ${formik.touched.email && formik.errors.email
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-red-500 text-sm">{formik.errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block font-medium">
                            Enter your password:
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter Your Password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-3 py-2 border ${formik.touched.password && formik.errors.password
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <p className="text-red-500 text-sm">{formik.errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block font-medium">
                            Confirm your password:
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm Your Password"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-3 py-2 border ${formik.touched.confirmPassword && formik.errors.confirmPassword
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <p className="text-red-500 text-sm">{formik.errors.confirmPassword}</p>
                        )}
                    </div>





                    <button
                        type="submit"
                        className={`w-full text-white py-2 rounded hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        style={{ backgroundColor: '#00A3FF' }}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Register'}
                    </button>

                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-700">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-blue-500 hover:underline font-medium"
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;
