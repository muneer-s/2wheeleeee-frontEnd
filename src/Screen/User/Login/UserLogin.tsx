import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import logAnime from '../../../assets/anime/logAnime.json';
import { login } from '../../../Api/user';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../../../app/store';
import { saveUser } from '../../../app/slice/AuthSlice';
import { setUserCredential } from '../../../app/slice/AuthSlice';


const UserLogin: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const { userData } = useAppSelector((state) => state.auth)
    console.log('userdataaa login page:', userData);


    const authState = useAppSelector((state) => state.auth);
    const userDetails = authState.user

    useEffect(() => {
        if (userData && userDetails) navigate('/');
    }, [userData, userDetails]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true)
        try {
            const response = await login({ email, password })
            console.log('login response : ', response)
            console.log('login response : ', response.userAccessToken)

            if (response?.success && response.user) {
                const user = {
                    email: response.user.email,
                    name: response.user.name,
                    profile_picture: response.user.profile_picture,
                };
                dispatch(saveUser(user))
                dispatch(setUserCredential(response.userAccessToken))
                toast.success('Logged in successfully');
                navigate('/');
            } else {
                toast.error(response?.message || 'Login failed');
                setError(response?.message || 'Invalid email or password');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
            toast.error('login Failed');
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
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Your Email Address"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
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
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
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
