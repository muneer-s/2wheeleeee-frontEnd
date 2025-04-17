import React, { useEffect, useState } from 'react';
import { resendOtp, verifyOtp } from '../../../Api/user';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { saveUser, setUserCredential } from '../../../Apps/slice/AuthSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../Apps/store';
import toast from 'react-hot-toast';
import { handleApiResponse } from '../../../Utils/apiUtils';

const OTPComponent: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('email');
    const [otp, setOTP] = useState<string>('');
    const [seconds, setSeconds] = useState(60);
    const { userData } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (userData) navigate('/');
    }, [userData, navigate]);

    useEffect(() => {
        if (seconds > 0) {
            const timer = setInterval(() => setSeconds((prev) => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [seconds]);

    const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setOTP(e.target.value);
    };

    const handleVerify = async () => {
        if (!otp) {
            toast.error('Please enter the OTP.');
            return;
        }

        if (isNaN(Number(otp))) {
            toast.error('OTP must be a valid number.');
            return;
        }

        setLoading(true);
        try {
            const response = await verifyOtp({ otp, userId });
            const data = handleApiResponse(response)

            if (response?.success) {
                dispatch(saveUser(data.userData));
                dispatch(setUserCredential(data.userAccessToken))
                toast.success(response.message);
                navigate('/');
            }
        } catch (err: any) {
            console.error('Error during OTP verification:', err.response.data.message);
            toast.error(err.response.data.message)
        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async () => {
        const email = userId || '';

        if (!email) {
            toast.error("Email is missing. Please try again.");
            return;
        }
        setLoading(true);
        try {
            const result = await resendOtp({ email });

            if (result?.success) {
                toast.success(result.message)
                setSeconds(60);
            }
        }
        catch (error) {
            console.error("Error resending OTP:", error);
            toast.error("An error occurred while resending the OTP.");
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">Verify OTP</h1>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">Enter the code sent to your email</p>
                
                <div className="mb-6">
                    <input
                        type="text"
                        value={otp}
                        onChange={handleOTPChange}
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        className="w-full px-4 py-3 text-center text-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                    />
                </div>

                <div className="text-center mb-6">
                    {seconds <= 0 ? (
                        <p className="text-gray-600 dark:text-gray-300">
                            OTP Expired{' '}
                            <span 
                                className="text-blue-500 hover:text-blue-600 cursor-pointer font-medium transition-colors duration-200" 
                                onClick={resendOTP}
                            >
                                Resend OTP
                            </span>
                        </p>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-300">
                            OTP expires in <span className="font-medium">{seconds}</span> seconds
                        </p>
                    )}
                </div>

                <button
                    onClick={handleVerify}
                    className={`w-full py-3 px-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        'Verify OTP'
                    )}
                </button>
            </div>
        </div>
    );
};

export default OTPComponent;