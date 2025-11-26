import { motion } from "framer-motion";
import { Home, ShoppingBag, LayoutGrid, User } from "lucide-react";

const BottomNavUser = () => {
    const navItems = [
        { id: 1, label: "Home", icon: <Home size={22} /> },
        { id: 2, label: "My Orders", icon: <ShoppingBag size={22} /> },
        { id: 3, label: "Category", icon: <LayoutGrid size={22} /> },
        { id: 4, label: "Account", icon: <User size={22} /> },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full h-16 bg-white/70 dark:bg-black/20 backdrop-blur-xl shadow-top z-50 border-t border-orange-300/40">
            <div className="w-11/12 mx-auto h-full grid grid-cols-4 items-center">
                {navItems.map((item) => (
                    <motion.button
                        key={item.id}
                        whileTap={{ scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        className="flex flex-col items-center justify-center text-orange-600 font-medium"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {item.icon}
                        </motion.div>

                        <span className="text-xs font-semibold  mt-1">
                            {item.label}
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default BottomNavUser;
