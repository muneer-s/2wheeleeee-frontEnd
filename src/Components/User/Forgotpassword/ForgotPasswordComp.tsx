import React, { useState } from 'react';
import { forgotPassword } from '../../../Api/user';


const ForgotPasswordComp: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        setEmailError('');
        setMessage(null);

        try {

            const response = await forgotPassword(email)

            if (response?.data?.success) {
                setMessage('Password reset instructions have been sent to your email.');
            } else {
                setEmailError(response?.data?.message || 'Failed to send email. Please try again.');
            }

        } catch (error) {
            console.error(error);
            setEmailError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            <div className="bg-white rounded-lg shadow-xl p-8 w-96">
                <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
                    Forgot Your Password?
                </h2>
                <p className="text-gray-600 text-center mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {message ? (
                    <p className="text-green-600 font-medium text-center mb-4">{message}</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block font-medium text-gray-700"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ${emailError ? 'border-red-500' : ''
                                    }`}
                            />
                            {emailError && (
                                <p className="text-red-500 text-sm mt-1">{emailError}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 text-white font-bold rounded-lg transition duration-300 ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-purple-500 hover:bg-purple-600'
                                }`}
                        >
                            {loading ? 'Sending...' : 'Submit'}
                        </button>
                    </form>
                )}

                <div className="text-center mt-6">
                    <button
                        onClick={() => window.history.back()}
                        className="text-blue-500 hover:underline"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordComp;
