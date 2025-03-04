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
        <div className="min-h-screen flex items-center justify-evenly relative bg-blue-100">
            <div className='w-1/2'>
                <Lottie animationData={logAnime} loop={true} />
            </div>
            <div className="relative z-10 bg-blue-200 p-8  rounded-lg shadow-lg w-96 ">
                <h2 className="text-center text-2xl font-bold mb-4" style={{ color: '#00A3FF' }} >Login</h2>
                <button
                    className="absolute top-2 right-2 text-blue-700 font-bold"
                    onClick={() => navigate('/')}
                >
                    ✕
                </button>

                <form className="space-y-4" onSubmit={handleSubmit}>

                    {error && (<p className="text-red-500 text-center">{error}</p>)}

                    <div>
                        <label htmlFor="email" className="block font-medium">
                            Enter your email:
                        </label>

                        <input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Your Email Address"
                            className={`w-full px-3 py-2 border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'
                                } rounded focus:outline-none focus:ring-2 ${validationErrors.email ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                                }`}
                        />
                        {validationErrors.email && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block font-medium">
                            Enter your password:
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Your Password"
                            className={`w-full px-3 py-2 border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'
                                } rounded focus:outline-none focus:ring-2 ${validationErrors.password ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                                }`}

                        />
                        {validationErrors.password && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}

                        className="w-full text-white py-2 rounded hover:bg-blue-700 transition"
                        style={{ backgroundColor: '#00A3FF' }}
                    >
                        {loading ? 'Logging in...' : 'Login'}

                    </button>
                </form>
                {/* <p className="text-blue-500 hover:underline cursor-pointer" onClick={() => navigate('/forgotpassword')}>Forgot Password?</p> */}


                <div className="text-center mt-4">
                    <p className="text-sm text-gray-700">
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="text-blue-500 hover:underline font-medium"
                        >
                            Register Now
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
