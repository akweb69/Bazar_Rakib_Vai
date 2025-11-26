import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginForm = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            // Success feedback could be improved with toast later
            navigate("/");
            toast.success("Login successful!");
        } catch (err) {
            toast.error("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen -my-4 py-10 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex justify-center px-4 relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -100, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
                />
                <motion.div
                    animate={{
                        x: [0, -150, 0],
                        y: [0, 150, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative w-full max-w-md"
            >
                {/* Glassmorphic Card */}
                <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
                            <LogIn className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-white/70">Sign in to continue your journey</p>
                    </motion.div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Field */}
                        <motion.div
                            whileTap={{ scale: 0.98 }}
                            className="relative group"
                        >
                            <Mail className="absolute left-4 top-5 w-5 h-5 text-white/60 group-focus-within:text-purple-400 transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/30 transition-all duration-300"
                                placeholder=" "
                                id="email"
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-12 top-5 text-white/70 pointer-events-none transition-all duration-300  group-focus-within:text-purple-950 group-focus-within:text-md"
                                style={{
                                    transform: email ? "translateY(-32px) scale(0.85)" : "translateY(0)",
                                    opacity: email ? 1 : 1,
                                }}
                            >
                                Email Address
                            </label>
                        </motion.div>

                        {/* Password Field */}
                        <motion.div
                            whileTap={{ scale: 0.98 }}
                            className="relative group"
                        >
                            <Lock className="absolute left-4 top-5 w-5 h-5 text-white/60 group-focus-within:text-purple-400 transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/30 transition-all duration-300"
                                placeholder=" "
                                id="password"
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-12 top-5 text-white/70 pointer-events-none transition-all duration-300 group-focus-within:text-purple-50 group-focus-within:text-md"
                                style={{
                                    transform: password ? "translateY(-32px) scale(0.85)" : "translateY(0)",
                                }}
                            >
                                Password
                            </label>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            type="submit"
                            className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-lg rounded-xl shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                </>
                            )}
                        </motion.button>
                    </form>

                    <p className="text-center text-white/60 mt-8 text-sm">
                        Don't have an account?{" "}
                        <a href="/signup" className="text-purple-300 hover:text-purple-200 font-medium transition">
                            Sign up
                        </a>
                    </p>
                </div>

                {/* Subtle bottom glow */}
                <motion.div
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-x-0 -bottom-10 h-32 bg-purple-500/30 blur-3xl -z-10"
                />
            </motion.div>
        </div>
    );
};

export default LoginForm;