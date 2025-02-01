import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-sky-300 to-blue-600">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white shadow-2xl rounded-lg p-10 flex flex-col items-center text-center"
            >
                {/* animated Check Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 150 }}
                >
                    <CheckCircle className="text-green-500" size={80} />
                </motion.div>

                <h1 className="text-3xl font-bold text-gray-800 mt-5">Booking Confirmed Successfully!</h1>
                <p className="text-gray-600 mt-3">
                    Thank you for choosing us. Your rental booking has been confirmed.
                </p>

                {/* back to Home Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate("/")}
                    className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition"
                >
                    Go to Home
                </motion.button>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
