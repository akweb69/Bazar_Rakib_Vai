import React from "react";
import { AuthContext } from "../Context/AuthContext";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    LogOut,
    Sparkles,
    Camera,
    Shield,
    Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Account = () => {
    const { user, loading, logout } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const primaryColor = "#10B981"; // তোমার চাওয়া ডিফল্ট কালার

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen -my-4 bg-gray-900 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen -my-4 bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Animated Background Orbs - Emerald Theme */}
            <div className="absolute inset-0">
                <motion.div
                    animate={{
                        x: [0, -100, 80, -120, 0],
                        y: [0, 120, -80, 100, 0],
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute top-10 left-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
                    style={{ backgroundColor: primaryColor }}
                />
                <motion.div
                    animate={{
                        x: [0, 120, -80, 100, 0],
                        y: [0, -100, 120, -80, 0],
                    }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-20 right-20 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
                    style={{ backgroundColor: primaryColor }}
                />
            </div>

            {/* Not Logged In State */}
            {!user ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 text-center"
                >
                    <motion.div
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-8 shadow-2xl"
                    >
                        <Shield className="w-12 h-12 text-white/70" />
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Welcome Back!
                    </h1>
                    <p className="text-white/70 text-lg mb-10 max-w-md">
                        Please log in or create an account to access your profile.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/login")}
                            style={{ backgroundColor: primaryColor }}
                            className="px-8 py-4 text-white font-semibold rounded-xl shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-3"
                        >
                            <Mail className="w-5 h-5" />
                            Sign In
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/signup")}
                            className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/30 text-white font-semibold rounded-xl shadow-xl hover:bg-white/20 transition-all flex items-center justify-center gap-3"
                        >
                            <User className="w-5 h-5" />
                            Create Account
                        </motion.button>
                    </div>
                </motion.div>
            ) : (
                /* Logged In - Profile Card */
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-2xl"
                >
                    <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 md:p-12">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                                className="relative inline-block"
                            >
                                <div
                                    className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 shadow-2xl relative"
                                    style={{ borderColor: primaryColor }}
                                >
                                    {user?.profilePic ? (
                                        <img
                                            src={user.profilePic}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                                            <User className="w-16 h-16 text-white/80" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-4xl font-bold text-white mt-6"
                            >
                                {user?.name || "User"}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="text-white/60 mt-2 flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
                                Welcome back!
                            </motion.p>
                        </div>

                        {/* Info Cards */}
                        <div className="space-y-6">
                            {/* Name */}
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="flex items-center gap-5 p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl"
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20` }}>
                                    <User className="w-6 h-6" style={{ color: primaryColor }} />
                                </div>
                                <div>
                                    <p className="text-white/50 text-sm">Full Name</p>
                                    <p className="text-white font-medium text-lg">{user?.name || "Not set"}</p>
                                </div>
                            </motion.div>

                            {/* Email */}
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.9 }}
                                className="flex items-center gap-5 p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl"
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20` }}>
                                    <Mail className="w-6 h-6" style={{ color: primaryColor }} />
                                </div>
                                <div>
                                    <p className="text-white/50 text-sm">Email Address</p>
                                    <p className="text-white font-medium text-lg break-all">{user?.email}</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Logout Button */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleLogout}
                            style={{ backgroundColor: primaryColor }}
                            className="w-full mt-10 py-5 text-white font-bold text-lg rounded-xl shadow-xl hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-3 group"
                        >
                            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Sign Out
                        </motion.button>
                    </div>

                    {/* Bottom Glow */}
                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute inset-x-0 -bottom-20 h-40 blur-3xl -z-10"
                        style={{ background: `linear-gradient(to top, ${primaryColor}80, transparent)` }}
                    />
                </motion.div>
            )}
        </div>
    );
};

export default Account;