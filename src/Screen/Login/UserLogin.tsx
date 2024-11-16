import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import loginBg from '../../assets/login-bg.png'; 
import Lottie from 'lottie-react';
import logAnime from '../../assets/anime/logAnime.json';

const UserLogin: React.FC = () => {
    const navigate = useNavigate();
    const [email,setEmail] = useState<string>('')
    const [password,setPassword] = useState<string>('')
  
    return (
        <div className="min-h-screen flex items-center justify-center relative bg-blue-100">
            {/* Optional Background Image */}
            {/* <div
                className="absolute inset-0 bg-cover bg-center opacity-50"
                style={{ backgroundImage: `url(${loginBg})` }}
            ></div> */}

            <div className="relative z-10 bg-blue-200 p-8 rounded-lg shadow-lg w-96">
                <h2
                    className="text-center text-2xl font-bold mb-4"
                    style={{ color: '#00A3FF' }}
                >
                    Login
                </h2>
                <Lottie animationData={logAnime} loop={true} />
                <button
                    className="absolute top-2 right-2 text-blue-700 font-bold"
                    onClick={() => navigate('/')}
                >
                    ✕
                </button>

                <form className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block font-medium">
                            Enter your email:
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter Your Email Address"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block font-medium">
                            Enter your password:
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter Your Password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full text-white py-2 rounded hover:bg-blue-700 transition"
                        style={{ backgroundColor: '#00A3FF' }}
                    >
                        Login
                    </button>
                </form>

                <div className="text-center my-4">OR</div>

                <button className="w-full flex items-center justify-center gap-2 bg-white py-2 border border-gray-300 rounded shadow hover:shadow-md transition">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
                        alt="Google Logo"
                        className="w-5"
                    />
                    Continue With Google
                </button>

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
