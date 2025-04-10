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
        <div className="bg-gray-100 flex flex-col items-center justify-center h-screen w-full dark:bg-gray-900">
            <div className="w-full max-w-md px-8 py-10 bg-white rounded-lg shadow-md dark:bg-gray-950 dark:text-gray-200">
                <h1 className="text-2xl font-semibold text-center mb-6">Enter OTP</h1>
                <p className="text-gray-600 text-center mb-4">Code sent to your Email</p>
                <div className="flex justify-center my-2">
                    <input
                        type="text"
                        value={otp}
                        onChange={handleOTPChange}
                        maxLength={6}
                        className="rounded-lg bg-gray-100 cursor-text dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-400 text-center outline-none"
                    />
                </div>
                <div className="flex items-center flex-col justify-between mb-6">

                    <div className="ps-1">
                        {seconds <= 0 ? (
                            <div>
                                OTP Expired{' '}
                                <span className="text-blue-500 cursor-pointer" onClick={resendOTP}>
                                    Resend OTP?
                                </span>
                            </div>
                        ) : (
                            <div>
                                OTP expires in {seconds} sec
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleVerify}
                    className={`w-full px-4 py-2 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Verify'}
                </button>
            </div>
        </div>
    );
};

export default OTPComponent;
