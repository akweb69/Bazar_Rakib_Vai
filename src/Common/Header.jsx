import { motion } from "framer-motion";
import { Menu, ShoppingCart, User } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import useCart from "../Components/useCart";

const Header = () => {
    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext)
    const [openCart, setOpenCart] = useState(false);
    const { cart, isLoading } = useCart()
    console.log(cart);

    const handleSignUp = () => {
        navigate('/signup');
    }
    return (
        <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-14 bg-white/70  sticky top-0 z-50 shadow-sm backdrop-blur-xl border-b border-emerald-300/30"
        >
            <div className="w-11/12 mx-auto flex items-center justify-between h-full">

                {/* Left Logo */}
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="text-2xl font-extrabold text-emerald-600 tracking-wide"
                >
                    Bazar
                </motion.div>

                {/* Right Profile Icon */}
                <div className="flex items-center gap-3">
                    <motion.div
                        onClick={() => setOpenCart(!openCart)}
                        whileTap={{ scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        className="h-10 w-10 rounded-full bg-emerald-500 flex justify-center items-center text-white shadow-md cursor-pointer relative"
                    >
                        <ShoppingCart size={16} />

                        <p className="absolute -top-1 -right-1.5 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{isLoading ? "" : cart?.length}</p>

                    </motion.div>

                    {/* sign up btn */}

                    {
                        !loading && user && user?.email ? <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md cursor-pointer">

                            <img className="w-full " src={user?.profilePic} alt="" />
                        </div> :
                            <motion.button
                                onClick={handleSignUp}
                                whileTap={{ scale: 0.8 }}
                                whileHover={{ scale: 1.1 }}
                                className="px-4 py-2 rounded-md bg-emerald-600 text-sm text-white font-semibold shadow-md cursor-pointer"
                            >
                                Sign Up
                            </motion.button>
                    }
                </div>

            </div>

            {openCart && (
                <motion.div
                    initial={{ opacity: 0, x: 1000 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, type: "spring" }}
                    exit={{ opacity: 0, x: 1000 }}

                    className="absolute top-14 right-0 w-10/12 bg-white/95 backdrop-blur-md rounded-l-lg shadow-lg p-4 z-50">

                    {/* close btn */}
                    <div
                        onClick={() => setOpenCart(false)} className="absolute top-0 right-0 h-10 w-10 rounded-l-full flex justify-center items-center cursor-pointer bg-red-500 text-white font-semibold pl-1">X</div>

                    <h3 className="text-lg font-semibold mb-4 text-emerald-500">Shopping Cart</h3>

                    {cart.length > 0 ? (
                        <ul className="space-y-3 max-h-60 overflow-y-auto">
                            {cart.map((item) => (
                                <li key={item._id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Quantity: {item.quantity} Kg
                                        </p>
                                    </div>
                                    <p className="font-semibold">RM {item.price}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">Your cart is empty.</p>
                    )}
                </motion.div>
            )}

        </motion.div>
    );
};

export default Header;
