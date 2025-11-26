import { motion } from "framer-motion";
import { Menu, ShoppingCart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate('/signup');
    }
    return (
        <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-14 bg-white/70 dark:bg-black/20 sticky top-0 z-50 shadow-sm backdrop-blur-xl border-b border-orange-300/30"
        >
            <div className="w-11/12 mx-auto flex items-center justify-between h-full">

                {/* Left Logo */}
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="text-2xl font-extrabold text-orange-600 tracking-wide"
                >
                    Bazar
                </motion.div>

                {/* Right Profile Icon */}
                <div className="flex items-center gap-2">
                    <motion.div
                        whileTap={{ scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        className="h-10 w-10 rounded-full bg-orange-500 flex justify-center items-center text-white shadow-md cursor-pointer"
                    >
                        <ShoppingCart size={20} />
                    </motion.div>

                    {/* sign up btn */}
                    <motion.button
                        onClick={handleSignUp}
                        whileTap={{ scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        className="px-4 py-2 rounded-md bg-orange-600 text-sm text-white font-semibold shadow-md cursor-pointer"
                    >
                        Sign Up
                    </motion.button>
                </div>

            </div>
        </motion.div>
    );
};

export default Header;
