import { motion } from "framer-motion";
import { Menu, User } from "lucide-react";

const Header = () => {
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
                <motion.div
                    whileTap={{ scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    className="h-10 w-10 rounded-full bg-orange-500 flex justify-center items-center text-white shadow-md cursor-pointer"
                >
                    <User size={20} />
                </motion.div>

            </div>
        </motion.div>
    );
};

export default Header;
