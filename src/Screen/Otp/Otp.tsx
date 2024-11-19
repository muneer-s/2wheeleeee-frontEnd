import React, { useEffect, useState } from 'react';
import { resendOtp, verifyOtp } from '../../Api/user';
import { useNavigate,useSearchParams } from 'react-router-dom';
import { saveUser } from '../../app/slice/AuthSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/store';

const OTPComponent: React.FC = () => {

    const [searchParams] = useSearchParams();

    const userId = searchParams.get('email');

    const [otp, setOTP] = useState<string>('');
    const [seconds, setSeconds] = useState(60);

    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    const remainingSeconds = seconds % 60;

    const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setOTP(e.target.value);
    };

    const handleVerify = async () => {
        try {
            console.log("OTP: ", otp);
            console.log('userid : ',userId);
            
            
           const result = await verifyOtp({otp,userId});

           console.log("otp de verify result : ",result);
           
            if (result?.data.success) {
                dispatch(saveUser(result.data.userId));
                navigate('/');
            } else {
                console.log("Invalid OTP or verification failed.");
            }
        } catch (err) {
            console.error("Error during OTP verification:", err);
        }
    };

    const resendOTP = async () => {
        try {
            await resendOtp();
            setSeconds(60); // Reset countdown
        } catch (error) {
            console.error("Error resending OTP:", error);
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
                    <p className="text-gray-600 text-sm">
                        Didn't receive code?{' '}
                        <span onClick={resendOTP} className="text-blue-500 cursor-pointer">
                            Resend Otp
                        </span>
                    </p>
                    <div className="ps-1">
                        {seconds <= 0 ? (
                            <div>
                                OTP Expired{' '}
                                <span className="text-blue-500 cursor-pointer" onClick={resendOTP}>
                                    Request another?
                                </span>
                            </div>
                        ) : (
                            <div>
                                OTP expires in {remainingSeconds} sec
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleVerify}
                    className="w-full px-4 py-2 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    Verify
                </button>
            </div>
        </div>
    );
};

export default OTPComponent;
