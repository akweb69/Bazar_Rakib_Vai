import { motion } from "framer-motion";
import { Menu, ShoppingCart, User } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import useCart from "../Components/useCart";
import toast from "react-hot-toast";
import axios from "axios";

const Header = () => {
    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext)
    const [openCart, setOpenCart] = useState(false);
    const { cart, isLoading, refetch } = useCart()
    console.log(cart);

    const handleSignUp = () => {
        navigate('/signup');
    }

    // handle check out---->
    const handleCheckOut = () => {
        if (cart.length === 0) {
            toast.error("Your cart is empty. Please add items to proceed to checkout.");
            return;
        }

        toast.success("Proceeding to checkout...");
        // Implement further checkout functionality here
    }


    // handle remove item from cart---->
    const handleRemoveFromCart = (itemId) => {
        // Implement remove from cart functionality here
        const id = itemId;
        axios.delete(`${import.meta.env.VITE_BASE_URL}/carts/${id}`)
            .then(() => {
                toast.success("Item removed from cart successfully.");
                refetch();
            })
            .catch(() => {
                toast.error("Failed to remove item from cart.");
            });
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

                    className="absolute top-14 right-0 w-10/12 bg-white/95 backdrop-blur-md rounded-l-lg shadow-lg p-4 z-50 h-[80vh]">

                    {/* close btn */}
                    <div
                        onClick={() => setOpenCart(false)} className="absolute top-0 right-0 h-10 w-10 rounded-l-full flex justify-center items-center cursor-pointer bg-red-500 text-white font-semibold pl-1">X</div>

                    <h3 className="text-lg font-semibold mb-4 text-emerald-500">Shopping Cart</h3>

                    {cart.length > 0 ? (
                        <ul className="space-y-3 h-[60vh] overflow-y-auto">
                            {cart.map((item) => (
                                <li key={item._id} className="flex items-center justify-between border-b pb-2 border-b-emerald-500">

                                    <div className="flex items-center gap-3">
                                        <div className="">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                                        </div>

                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-500">
                                                Quantity: {item.quantity} Kg
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-end gap-4 flex-col">
                                        <div
                                            onClick={() => handleRemoveFromCart(item._id)}
                                            className="w-6 h-6 rounded-full flex justify-center items-center mr-4 text-white cursor-pointer text-xs bg-red-500 ">
                                            {/* Remove from cart button could go here */}
                                            X
                                        </div>
                                        <p className="font-semibold text-lg pr-4 text-emerald-600">RM {item.price}</p>

                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">Your cart is empty.</p>
                    )}
                    {/* total amount---> */}
                    <p className="mt-4 text-lg font-semibold text-gray-600">Total: RM {cart.reduce((total, item) => total + item.price, 0)}</p>
                    {/* check out btn */}
                    <motion.button
                        onClick={handleCheckOut}
                        whileTap={{ scale: 0.9 }}
                        className="mt-4 w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold shadow-md hover:brightness-110 transition-all"
                    >
                        Checkout
                    </motion.button>
                </motion.div>
            )}

        </motion.div>
    );
};

export default Header;
