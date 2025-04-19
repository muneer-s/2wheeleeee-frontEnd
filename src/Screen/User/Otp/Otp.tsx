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

    // Handle individual digit inputs
    const handleDigitChange = (index: number, value: string) => {
        if (value === '' || /^\d$/.test(value)) {
            const newOtp = otp.split('');
            newOtp[index] = value;
            setOTP(newOtp.join(''));
            
            // Auto-focus next input if value is entered
            if (value && index < 5) {
                const nextInput = document.getElementById(`otp-input-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    // Handle paste event
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const pastedOtp = pastedData.replace(/\D/g, '').slice(0, 6);
        setOTP(pastedOtp);
    };

    // Handle backspace key for digit inputs
    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace') {
            if (index > 0 && !otp[index]) {
                const prevInput = document.getElementById(`otp-input-${index - 1}`);
                if (prevInput) prevInput.focus();
            }
        }
    };

    const handleVerify = async () => {
        if (!otp || otp.length !== 6) {
            toast.error('Please enter the complete 6-digit OTP.');
            return;
        }

        if (isNaN(Number(otp))) {
            toast.error('OTP must be a valid number.');
            return;
        }

        setLoading(true);
        try {
            const response = await verifyOtp({ otp, userId });
            const data = handleApiResponse(response);

            if (response?.success) {
                dispatch(saveUser(data.userData));
                dispatch(setUserCredential(data.userAccessToken));
                toast.success(response.message);
                navigate('/');
            }
        } catch (err: any) {
            console.error('Error during OTP verification:', err.response?.data?.message);
            toast.error(err.response?.data?.message || 'Verification failed. Please try again.');
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
                toast.success(result.message);
                setSeconds(60);
            }
        }
        catch (error) {
            console.error("Error resending OTP:", error);
            toast.error("An error occurred while resending the OTP.");
        } finally {
            setLoading(false);
        }
    };

    // Create digit inputs based on OTP length
    const renderOtpInputs = () => {
        const inputs = [];
        for (let i = 0; i < 6; i++) {
            inputs.push(
                <input
                    key={i}
                    id={`otp-input-${i}`}
                    type="text"
                    maxLength={1}
                    value={otp[i] || ''}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    className="w-12 h-14 text-center text-2xl font-semibold bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 focus:outline-none transition-all duration-200"
                />
            );
        }
        return inputs;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl border border-gray-100 dark:border-gray-700">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">Verify Your Email</h1>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
                    We've sent a 6-digit code to <span className="font-medium">{userId || 'your email'}</span>
                </p>
                
                <div className="flex gap-2 justify-center mb-8">
                    {renderOtpInputs()}
                </div>

                <button
                    onClick={handleVerify}
                    className={`w-full py-4 px-6 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 shadow-md hover:shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Verifying...
                        </span>
                    ) : (
                        'Verify & Continue'
                    )}
                </button>

                <div className="text-center mt-6">
                    {seconds <= 0 ? (
                        <p className="text-gray-600 dark:text-gray-300">
                            Didn't receive the code?{' '}
                            <button 
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200 focus:outline-none" 
                                onClick={resendOTP}
                                disabled={loading}
                            >
                                Resend OTP
                            </button>
                        </p>
                    ) : (
                        <div className="flex flex-col items-center">
                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                                Code expires in 
                            </p>
                            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
                                <span className="font-bold text-blue-600 dark:text-blue-400">{seconds} seconds</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OTPComponent;