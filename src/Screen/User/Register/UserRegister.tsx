import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UserRegister: React.FC = () => {
    const navigate = useNavigate();

    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!userName.trim()) newErrors.userName = 'Username is required.';
        if (!email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Enter a valid email address.';
        }
        if (!password) {
            newErrors.password = 'Password is required.';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long.';
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Confirm Password is required.';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await fetch('http://localhost:3000/api/user/userSignup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ name: userName, email, password }),
                });

                console.log('response : ', response);

                const data = await response.json();
                console.log('response data : ', data);

                if (data.success) {
                    toast.success(data.message)
                    console.log('Registration Successful:', data);
                    navigate(`/otp?email=${data.userId}`);
                } else {
                    setErrors({ form: data.message });
                    toast.error(data.message);
                }

            } catch (err) {
                setErrors({ form: 'An error occurred during registration' });
                console.log('error respomese', err);

            }
        }
    };

    return (
        <div className="h-full flex items-center justify-center relative bg-blue-10">
            <div className="relative z-10 bg-blue-200 p-8 rounded-lg shadow-lg w-96" style={{ marginTop: '80px' }} >
                <h2 className="text-center text-2xl font-bold mb-4" style={{ color: '#00A3FF' }}>
                    Register
                </h2>
                <button
                    className="absolute top-2 right-2 text-blue-700 font-bold"
                    onClick={() => navigate('/')}
                >
                    ✕
                </button>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="block font-medium">
                            Enter your username:
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter Your Username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className={`w-full px-3 py-2 border ${errors.userName ? 'border-red-500' : 'border-gray-300'
                                } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.userName && <p className="text-red-500 text-sm">{errors.userName}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block font-medium">
                            Enter your email:
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter Your Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block font-medium">
                            Enter your password:
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter Your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block font-medium">
                            Confirm your password:
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm Your Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full text-white py-2 rounded hover:bg-blue-700 transition"
                        style={{ backgroundColor: '#00A3FF' }}
                    >
                        Register
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
