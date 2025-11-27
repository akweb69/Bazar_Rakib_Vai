import { useContext, useState, useRef } from "react";
import { AuthContext } from "../Context/AuthContext";
import {
    Mail,
    Lock,
    UserPlus,
    Loader2,
    Sparkles,
    User,
    Image as ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const SignupForm = () => {
    const { signup } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [profilePicUrl, setProfilePicUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const base_url = import.meta.env.VITE_BASE_URL;
    const imgbb_api_key = import.meta.env.VITE_IMGBB_API_KEY;

    // তোমার ব্র্যান্ড কালার
    const primaryColor = "#10B981";

    // Image upload to imgbb
    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        setIsUploading(true);
        try {
            const res = await axios.post(
                `https://api.imgbb.com/1/upload?key=${imgbb_api_key}`,
                formData
            );
            setProfilePicUrl(res.data.data.url);
            toast.success("Profile picture uploaded!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Name is required");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setIsLoading(true);
        try {
            await signup(email, password);
            await axios.post(`${base_url}/users`, {
                email,
                name: name.trim(),
                profilePic: profilePicUrl || null,
            });

            toast.success("Account created successfully!");
            navigate("/");
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to create account. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen -my-4 py-10 bg-gray-900 flex justify-center px-4 relative overflow-hidden">
            {/* Animated Emerald Orbs */}
            <div className="absolute inset-0">
                <motion.div
                    animate={{
                        x: [0, -120, 50, -80, 0],
                        y: [0, 100, -100, 80, 0],
                    }}
                    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                    className="absolute top-20 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
                    style={{ backgroundColor: primaryColor }}
                />
                <motion.div
                    animate={{
                        x: [0, 100, -100, 80, 0],
                        y: [0, -80, 120, -50, 0],
                    }}
                    transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-10 right-10 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
                    style={{ backgroundColor: primaryColor }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative w-full max-w-md"
            >
                {/* Glass Card */}
                <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10">
                    {/* Logo + Title */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="text-center mb-8"
                    >
                        <div
                            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-5 shadow-2xl relative"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <UserPlus className="w-10 h-10 text-white" />
                            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-pulse" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-white/70">Join us and start your journey today</p>
                    </motion.div>

                    <form onSubmit={handleSignup} className="space-y-6">
                        {/* Name Field */}
                        <motion.div whileTap={{ scale: 0.98 }} className="relative group">
                            <User className="absolute left-4 top-5 w-5 h-5 text-white/60 transition-colors"
                                style={{ color: name ? primaryColor : undefined }} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-4 transition-all duration-300"
                                style={{ borderColor: name ? primaryColor : undefined }}
                                placeholder=" "
                                id="signup-name"
                            />
                            <label
                                htmlFor="signup-name"
                                className="absolute left-12 top-5 text-white/70 pointer-events-none transition-all duration-300"
                                style={{
                                    transform: name ? "translateY(-32px) scale(0.85)" : "translateY(0)",
                                    color: name ? primaryColor : undefined,
                                }}
                            >
                                Full Name
                            </label>
                        </motion.div>

                        {/* Email */}
                        <motion.div whileTap={{ scale: 0.98 }} className="relative group">
                            <Mail className="absolute left-4 top-5 w-5 h-5 text-white/60 transition-colors"
                                style={{ color: email ? primaryColor : undefined }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-4 transition-all duration-300"
                                style={{ borderColor: email ? primaryColor : undefined }}
                                placeholder=" "
                                id="signup-email"
                            />
                            <label
                                htmlFor="signup-email"
                                className="absolute left-12 top-5 text-white/70 pointer-events-none transition-all duration-300"
                                style={{
                                    transform: email ? "translateY(-32px) scale(0.85)" : "translateY(0)",
                                    color: email ? primaryColor : undefined,
                                }}
                            >
                                Email Address
                            </label>
                        </motion.div>

                        {/* Password */}
                        <motion.div whileTap={{ scale: 0.98 }} className="relative group">
                            <Lock className="absolute left-4 top-5 w-5 h-5 text-white/60 transition-colors"
                                style={{ color: password ? primaryColor : undefined }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength="6"
                                className="w-full pl-12 pr-4 py-5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-4 transition-all duration-300"
                                style={{ borderColor: password ? primaryColor : undefined }}
                                placeholder=" "
                                id="signup-password"
                            />
                            <label
                                htmlFor="signup-password"
                                className="absolute left-12 top-5 text-white/70 pointer-events-none transition-all duration-300"
                                style={{
                                    transform: password ? "translateY(-32px) scale(0.85)" : "translateY(0)",
                                    color: password ? primaryColor : undefined,
                                }}
                            >
                                Password
                            </label>
                        </motion.div>

                        {/* Confirm Password */}
                        <motion.div whileTap={{ scale: 0.98 }} className="relative group">
                            <Lock className="absolute left-4 top-5 w-5 h-5 text-white/60 transition-colors"
                                style={{ color: confirmPassword ? primaryColor : undefined }} />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-4 transition-all duration-300"
                                style={{ borderColor: confirmPassword ? primaryColor : undefined }}
                                placeholder=" "
                                id="confirm-password"
                            />
                            <label
                                htmlFor="confirm-password"
                                className="absolute left-12 top-5 text-white/70 pointer-events-none transition-all duration-300"
                                style={{
                                    transform: confirmPassword ? "translateY(-32px) scale(0.85)" : "translateY(0)",
                                    color: confirmPassword ? primaryColor : undefined,
                                }}
                            >
                                Confirm Password
                            </label>
                        </motion.div>

                        {/* Profile Picture Upload */}
                        <motion.div whileTap={{ scale: 0.98 }}>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                id="profile-pic"
                            />
                            <button
                                type="button"
                                disabled={isUploading}
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-5 bg-white/10 border border-white/20 rounded-xl text-white flex items-center justify-center gap-3 hover:bg-white/15 transition-all"
                            >
                                {isUploading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <ImageIcon className="w-5 h-5" />
                                )}
                                <span>
                                    {profilePicUrl
                                        ? "Picture uploaded [Check]"
                                        : "Upload Profile Picture (optional)"}
                                </span>
                            </button>

                            {profilePicUrl && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-4 flex justify-center"
                                >
                                    <img
                                        src={profilePicUrl}
                                        alt="Profile preview"
                                        className="w-28 h-28 rounded-full object-cover border-4 shadow-lg"
                                        style={{ borderColor: primaryColor }}
                                    />
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Submit Button - Pure Emerald */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            disabled={isLoading || isUploading}
                            type="submit"
                            style={{ backgroundColor: primaryColor }}
                            className="w-full py-5 text-white font-bold text-lg rounded-xl shadow-xl hover:brightness-110 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5" />
                                        Create Account
                                    </>
                                )}
                            </span>
                            <motion.div
                                className="absolute inset-0 bg-white/20"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "100%" }}
                                transition={{ duration: 0.6 }}
                            />
                        </motion.button>
                    </form>

                    <p className="text-center text-white/60 mt-8 text-sm">
                        Already have an account?{" "}
                        <a href="/login" style={{ color: primaryColor }} className="font-medium hover:brightness-125 transition">
                            Sign in here
                        </a>
                    </p>
                </div>

                {/* Bottom Emerald Glow */}
                <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute inset-x-0 -bottom-12 h-40 blur-3xl -z-10"
                    style={{ backgroundColor: `${primaryColor}80` }}
                />
            </motion.div>
        </div>
    );
};

export default SignupForm;