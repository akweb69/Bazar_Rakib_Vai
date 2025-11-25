import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Package } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound404 = () => {
    return (
        <>
            {/* Full-screen Background with Subtle Gradient Animation */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-black" />
                <motion.div
                    animate={{
                        backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-0 opacity-30 bg-gradient-to-tr from-orange-400/20 via-transparent to-pink-500/20"
                />
            </div>

            <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
                {/* Floating Elements Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-64 h-64 bg-orange-300/10 rounded-full blur-3xl"
                            animate={{
                                x: [0, 100, 0],
                                y: [0, -100, 0],
                            }}
                            transition={{
                                duration: 15 + i * 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 1.5,
                            }}
                            style={{
                                top: `${20 + i * 15}%`,
                                left: `${10 + i * 15}%`,
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 max-w-2xl mx-auto">
                    {/* Main Icon Animation - Elevated & Premium */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative mb-10 flex justify-center"
                    >
                        {/* Orbiting Ring */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="w-48 h-48 rounded-full border border-orange-300/30" />
                        </motion.div>

                        {/* Pulsing Glow Background */}
                        <motion.div
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute w-36 h-36 bg-orange-500/20 rounded-full blur-xl"
                        />

                        {/* Main Bag with Floating Effect */}
                        <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="relative"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 8 }}
                                className="relative p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700"
                            >
                                <ShoppingBag className="w-20 h-20 text-orange-500 drop-shadow-lg" strokeWidth={2} />

                                {/* Small "X" over bag */}
                                <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg">
                                    <span className="text-xl font-bold">×</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* 404 Text with Glitch Effect */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <h1 className="text-8xl md:text-9xl font-extrabold tracking-tighter">
                            <span className="bg-clip bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                                4
                            </span>
                            <span className="text-gray-800 dark:text-gray-100 mx-2">0</span>
                            <span className="bg-clip-text bg-gradient-to-r from-pink-600 to-orange-500 text-transparent">
                                4
                            </span>
                        </h1>
                    </motion.div>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="mt-6 text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light tracking-wide"
                    >
                        Oops! Looks like this page went shopping... <br className="hidden md:block" />
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                            and never came back.
                        </span>
                    </motion.p>

                    {/* Secondary Message */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        className="mt-4 text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto"
                    >
                        The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link
                            to="/"
                            className="group flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-orange-500 font-medium px-6 py-4 rounded-xl border border-gray-300 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300"
                        >
                            <Package className="w-5 h-5" />
                            Go Back
                        </button>
                    </motion.div>

                    {/* Fun Footer Note */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="mt-16 text-sm text-gray-400 dark:text-gray-500"
                    >
                        Error 404 • Page Not Found • Maybe try searching?
                    </motion.p>
                </div>
            </div>
        </>
    );
};

export default NotFound404;