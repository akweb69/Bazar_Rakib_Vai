import { motion } from "framer-motion";
import { LoaderPinwheel } from "lucide-react";

const Loader = ({ size = "md", className = "" }) => {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-24 h-24",
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="relative"
            >
                <LoaderPinwheel
                    className={`${sizeClasses[size] || sizeClasses.md} text-orange-500`}
                    strokeWidth={2.5}
                />

                {/* Optional: glowing center dot */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={{
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <div className="w-3 h-3 bg-orange-400 rounded-full shadow-lg shadow-orange-400/50" />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Loader;