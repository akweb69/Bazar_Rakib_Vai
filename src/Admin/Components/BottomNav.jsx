import { motion } from "framer-motion";
import {
    ChevronsLeftRightEllipsis,
    HomeIcon,
    Images,
    LayoutGrid,
    List,
    ShoppingBagIcon
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
    const location = useLocation();

    const navItemData = [
        { id: 1, name: "Home", path: "", icon: <HomeIcon className="w-5 h-5" /> },
        { id: 2, name: "Products", path: "products", icon: <List className="w-5 h-5" /> },
        { id: 3, name: "Category", path: "category", icon: <LayoutGrid className="w-5 h-5" /> },
        { id: 4, name: "Order", path: "order", icon: <ShoppingBagIcon className="w-5 h-5" /> },
        { id: 5, name: "Slider", path: "slider", icon: <Images className="w-5 h-5" /> },
        { id: 6, name: "Web Data", path: "web-data", icon: <ChevronsLeftRightEllipsis className="w-5 h-5" /> },
    ];

    return (
        <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="w-full h-16 bg-white/80 backdrop-blur-xl border-t border-orange-300/30 shadow-md"
        >
            <div className="w-11/12 mx-auto grid grid-cols-6 gap-4 h-full">
                {navItemData.map((item) => {
                    const isActive = location.pathname === `/admin/${item.path}`;

                    return (
                        <Link
                            key={item.id}
                            to={`/admin/${item.path}`}
                            className="flex flex-col items-center justify-center"
                        >
                            <motion.div
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.85 }}
                                className={`flex flex-col items-center justify-center cursor-pointer 
                                    ${isActive ? "text-orange-600" : "text-gray-600 hover:text-orange-500"}`}
                            >
                                {/* Icon */}
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {item.icon}
                                </motion.div>

                                {/* Name */}
                                <span className="text-[11px] mt-1 font-medium">
                                    {item.name}
                                </span>

                                {/* Active Indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="w-2 h-2 bg-orange-500 rounded-full mt-1"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default BottomNav;
