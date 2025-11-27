import { motion } from "framer-motion";
import { Home, ShoppingBag, User, ShoppingCart, History } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BottomNavUser = () => {
    const navItems = [
        { id: 1, label: "Home", icon: Home },
        { id: 2, label: "My Orders", icon: ShoppingBag },
        { id: 3, label: "My Cart", icon: ShoppingCart },
        { id: 4, label: "History", icon: History },
        { id: 5, label: "Account", icon: User },
    ];

    const [activeItem, setActiveItem] = useState(1);
    const navigate = useNavigate();

    const handleClick = (item) => {
        setActiveItem(item.id);

        if (item.label === "Home") navigate("/");
        else if (item.label === "My Orders") navigate("/orders");
        else if (item.label === "My Cart") navigate("/cart");
        else if (item.label === "History") navigate("/history");
        else if (item.label === "Account") navigate("/account");
    };

    return (
        <div className="fixed bottom-0 left-0 w-full h-16 bg-white  backdrop-blur-xl shadow-2xl z-50">
            <div className="w-full max-w-2xl mx-auto h-full grid grid-cols-5 items-center px-3 relative">

                {/* === ACTIVE UNDERLINE BAR === */}
                <motion.div
                    layout
                    className="absolute bottom-0 h-1 bg-emerald-500 rounded-full"
                    style={{
                        width: `${100 / navItems.length}%`,
                        left: `${(activeItem - 1) * (100 / navItems.length)}%`,
                    }}
                    transition={{ type: "spring", stiffness: 220, damping: 20 }}
                />

                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeItem === item.id;

                    return (
                        <motion.button
                            key={item.id}
                            whileTap={{ scale: 0.85 }}
                            onClick={() => handleClick(item)}
                            className="relative flex flex-col items-center justify-center gap-1 w-full pt-1"
                        >
                            {/* Active Glow Floating Background */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeGlow"
                                    className="
                absolute -top-6
                w-12 h-12
                rounded-full
                bg-emerald-500
                shadow-[0_0_20px_6px_rgba(16,185,129,0.35)]
                backdrop-blur-md
                border border-emerald-300/40
                -z-10
            "
                                    transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                                />
                            )}

                            {/* Icon */}
                            <motion.div
                                animate={
                                    isActive
                                        ? {
                                            scale: 1.35,
                                            y: -16,
                                            color: "#fff",
                                            textShadow: "0px 0px 12px rgba(16,185,129,0.8)",
                                        }
                                        : { scale: 1, y: 0, color: "#065f46", textShadow: "none" }
                                }
                                transition={{ duration: 0.3 }}
                            >
                                <Icon size={24} />
                            </motion.div>

                            {/* Label */}
                            <motion.span
                                animate={
                                    isActive
                                        ? { opacity: 1, scale: 1 }
                                        : { opacity: 0.45, scale: 0.95 }
                                }
                                className={`text-[11px] font-semibold ${isActive ? "text-emerald-700 " : "text-emerald-900"
                                    }`}
                            >
                                {item.label}
                            </motion.span>
                        </motion.button>

                    );
                })}
            </div>
        </div>
    );
};

export default BottomNavUser;
