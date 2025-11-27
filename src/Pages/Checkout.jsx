import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import useCart from "../Components/useCart";
import Loader from "../Common/Loader";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const { user, loading: userLoading } = useContext(AuthContext);
    const { cart, isLoading: cartLoading, refetch } = useCart();
    const navigate = useNavigate();

    const [placingOrder, setPlacingOrder] = useState(false);

    const base_url = import.meta.env.VITE_BASE_URL;

    // Remove item from cart
    const handleRemoveFromCart = async (itemId) => {
        try {
            await axios.delete(`${base_url}/carts/${itemId}`);
            toast.success("Item removed from cart");
            refetch();
        } catch (err) {
            toast.error("Failed to remove item");
        }
    };

    // Calculate Total
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Place Order
    const handlePlaceOrder = async () => {
        if (!user?.deliveryAddress) {
            toast.error("Please add delivery address first!");
            navigate("/account");
            return;
        }

        if (cart.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }

        setPlacingOrder(true);

        const orderData = {
            email: user.email,
            name: user.name,
            deliveryAddress: user.deliveryAddress,
            items: cart.map(item => ({
                productId: item.productId,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
            })),
            totalAmount: totalPrice,
            status: "pending", // or "confirmed", "delivered" etc.
            orderDate: new Date().toISOString(),
        };

        try {
            const res = await axios.post(`${base_url}/orders`, orderData);

            if (res.data.insertedId) {
                // Clear cart after successful order
                await Promise.all(
                    cart.map(item => axios.delete(`${base_url}/carts/${item._id}`))
                );

                toast.success("Order placed successfully!");
                refetch();

            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to place order. Try again.");
        } finally {
            setPlacingOrder(false);
        }
    };

    // Loading state
    if (userLoading || cartLoading) {
        return (
            <div className="h-[70vh] flex justify-center items-center">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 -mt-4 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-center text-emerald-800 mb-8">
                    Checkout
                </h2>

                {/* Delivery Address */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-emerald-200">
                    <h3 className="text-xl font-semibold text-emerald-700 mb-3 flex items-center gap-2">
                        Delivery Address
                    </h3>
                    {user?.deliveryAddress ? (
                        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-gray-700">
                                {user.deliveryAddress.street}, {user.deliveryAddress.city}
                                <br />
                                {user.deliveryAddress.state} - {user.deliveryAddress.zipCode}
                                <br />
                                {user.deliveryAddress.country}
                            </p>
                            <p className="mt-2 font-semibold text-emerald-700">
                                Phone: {user.deliveryAddress.phone}
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-red-600">
                            <p>No delivery address found!</p>
                            <button
                                onClick={() => navigate("/account")}
                                className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                            >
                                Add Address Now
                            </button>
                        </div>
                    )}
                </div>

                {/* Cart Items */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold text-emerald-700 mb-4">
                        Your Order ({cart.length} items)
                    </h3>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {cart.length === 0 ? (
                            <p className="text-center text-gray-500 py-10">Your cart is empty</p>
                        ) : (
                            cart.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center justify-between border-b pb-4 last:border-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-lg border"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-800">{item.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.quantity} Kg × RM {item.price}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <p className="font-bold text-emerald-600">
                                            RM {(item.price * item.quantity).toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => handleRemoveFromCart(item._id)}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Total */}
                    <div className="border-t-2 border-emerald-200 mt-6 pt-4">
                        <div className="flex justify-between text-xl font-bold text-emerald-800">
                            <span>Total Amount:</span>
                            <span>RM {totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Place Order Button */}
                <div className="text-center">
                    <button
                        onClick={handlePlaceOrder}
                        disabled={placingOrder || cart.length === 0 || !user?.deliveryAddress}
                        className="px-10 py-5 bg-emerald-600 text-white text-xl font-bold rounded-xl shadow-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3 mx-auto"
                    >
                        {placingOrder ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Placing Order...
                            </>
                        ) : (
                            <>
                                Place Order
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;