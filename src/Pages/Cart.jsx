import React from "react";
import { AuthContext } from "../Context/AuthContext";
import useCart from "../Components/useCart";
import Loader from "../Common/Loader";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Cart = () => {
    const { user, loading: userLoading } = React.useContext(AuthContext);
    const { cart, isLoading, refetch } = useCart();
    const navigate = useNavigate();
    const base_url = import.meta.env.VITE_BASE_URL;

    // Update quantity
    const updateQuantity = async (id, newQty) => {
        if (newQty < 1) return;
        try {
            await axios.patch(`${base_url}/carts/${id}`, { quantity: newQty });
            refetch();
        } catch (err) {
            toast.error("Failed to update quantity");
        }
    };

    // Remove item
    const removeItem = async (id) => {
        try {
            await axios.delete(`${base_url}/carts/${id}`);
            toast.success("Removed from cart");
            refetch();
        } catch (err) {
            toast.error("Failed to remove");
        }
    };

    // Calculate total
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (userLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen -mt-4 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <ShoppingBag className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">Please Login First</h2>
                    <button
                        onClick={() => navigate("/login")}
                        className="mt-6 px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br -mt-4  from-emerald-50 to-teal-50 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold text-center text-emerald-800 mb-10"
                >
                    Your Cart
                </motion.h1>

                {cart.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <ShoppingBag className="w-32 h-32 text-emerald-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-semibold text-gray-700 mb-4">
                            Your cart is empty
                        </h2>
                        <button
                            onClick={() => navigate("/")}
                            className="px-10 py-4 bg-emerald-600 text-white text-lg font-medium rounded-xl hover:bg-emerald-700 transition shadow-lg"
                        >
                            Continue Shopping
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="space-y-6">
                            {cart.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-emerald-100"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                                        {/* Product Image */}
                                        <div className="shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-28 h-28 sm:w-24 sm:h-24 object-cover rounded-xl border-2 border-emerald-200"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-800 truncate">
                                                {item.name}
                                            </h3>
                                            <p className="text-emerald-600 font-bold text-base mt-1">
                                                RM {item.price.toFixed(2)} / Kg
                                            </p>
                                        </div>

                                        {/* Quantity Controls - Mobile এ নিচে, Desktop এ পাশে */}
                                        <div className="flex items-center justify-between sm:justify-start gap-4 order-first sm:order-none">
                                            <div className="flex items-center gap-3 bg-gray-50 rounded-full px-3 py-2">
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="w-9 h-9 rounded-full bg-white shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-12 text-center font-bold text-emerald-700 text-lg">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="w-9 h-9 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 shadow-md flex items-center justify-center transition"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Total Price for this item */}
                                            <div className="text-right sm:text-left">
                                                <p className="text-xl font-bold text-emerald-600 whitespace-nowrap">
                                                    RM {(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Bar - Remove Button (Full width on mobile) */}
                                    <div className="border-t border-gray-100 px-5 py-3 bg-gray-50">
                                        <button
                                            onClick={() => removeItem(item._id)}
                                            className="w-full sm:w-auto text-red-600 hover:text-red-700 font-medium text-sm flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-red-50 transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Remove from Cart
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-emerald-200 sticky top-6"
                            >
                                <h2 className="text-2xl font-bold text-emerald-800 mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-4 text-lg">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Items</span>
                                        <span className="font-semibold">{totalItems} Kg</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold">RM {totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Delivery Charge</span>
                                        <span className="text-emerald-600 font-bold">Free</span>
                                    </div>

                                    <div className="border-t-2 border-emerald-200 pt-4 mt-6">
                                        <div className="flex justify-between text-2xl font-bold text-emerald-700">
                                            <span>Total</span>
                                            <span>RM {totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate("/checkout")}
                                    className="w-full mt-8 py-5 bg-emerald-600 text-white text-xl font-bold rounded-xl hover:bg-emerald-700 transition shadow-xl flex items-center justify-center gap-3"
                                >
                                    Proceed to Checkout
                                </button>

                                <button
                                    onClick={() => navigate("/")}
                                    className="w-full mt-4 py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition"
                                >
                                    Continue Shopping
                                </button>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;